import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  CircularProgress, TablePagination, Box, Typography
} from "@mui/material";

function Parts() {
  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalElements, setTotalElements] = useState(0);

  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const [openModal, setOpenModal] = useState(false);
  const [editingPart, setEditingPart] = useState(null);

  const [form, setForm] = useState({ name: "", price: "", stockQuantity: "", minStockLevel: "" });

  // ================= DEBOUNCE SEARCH =================
  useEffect(() => {
    const delay = setTimeout(() => {
      setSearch(searchInput);
      setPage(0);
    }, 500);
    return () => clearTimeout(delay);
  }, [searchInput]);

  // ================= FETCH PARTS =================
  useEffect(() => {
    fetchParts();
  }, [page, rowsPerPage, search]);

  const fetchParts = () => {
    setLoading(true);
    axiosClient.get("/admin/parts", {
      params: {
        page,
        size: rowsPerPage,
        search
      }
    })
    .then(res => {
      setParts(res.data.content);
      setTotalElements(res.data.totalElements);
    })
    .catch(err => console.error(err))
    .finally(() => setLoading(false));
  };

  // ================= DELETE =================
  const handleDelete = (id) => {
    if (!window.confirm("Xóa part này?")) return;

    axiosClient.delete(`/admin/parts/${id}`)
      .then(() => {
        if (parts.length === 1 && page > 0) {
          setPage(page - 1);
        } else {
          fetchParts();
        }
      })
      .catch(() => alert("Xóa thất bại"));
  };

  // ================= OPEN MODAL =================
  const handleOpenModal = (part = null) => {
    setEditingPart(part);
    setForm(part ? { ...part } : { name: "", price: "", stockQuantity: "", minStockLevel: "" });
    setOpenModal(true);
  };

  const handleCloseModal = () => setOpenModal(false);

  // ================= SUBMIT =================
  const handleSubmit = () => {
    if (!form.name || !form.price || !form.stockQuantity || !form.minStockLevel) {
      alert("Vui lòng điền đầy đủ thông tin");
      return;
    }

    const request = editingPart
      ? axiosClient.put(`/admin/parts/${editingPart.id}`, form)
      : axiosClient.post("/admin/parts", form);

    request
      .then(() => {
        fetchParts();
        setOpenModal(false);
      })
      .catch(() => alert("Thao tác thất bại"));
  };

  // ================= UI =================
  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" sx={{ mb: 2, fontWeight: "bold" }}>Parts</Typography>

      {/* SEARCH */}
      <TextField
        placeholder="Search by name..."
        fullWidth
        sx={{ mb: 2 }}
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
      />

      <Button
        variant="contained"
        sx={{ mb: 2 }}
        onClick={() => handleOpenModal()}
      >
        Thêm Part
      </Button>

      <Box sx={{ position: "relative" }}>
        <TableContainer component={Paper} sx={{ borderRadius: 3 }}>

          {/* LOADING */}
          {loading && (
            <Box sx={{
              position: "absolute",
              top: 0, left: 0, width: "100%", height: "100%",
              bgcolor: "rgba(255,255,255,0.6)",
              display: "flex", justifyContent: "center", alignItems: "center",
              zIndex: 1
            }}>
              <CircularProgress />
            </Box>
          )}

          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "#f5f5f5" }}>
                <TableCell><b>ID</b></TableCell>
                <TableCell><b>Name</b></TableCell>
                <TableCell><b>Price</b></TableCell>
                <TableCell><b>Stock</b></TableCell>
                <TableCell><b>Min Stock</b></TableCell>
                <TableCell><b>Action</b></TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {parts.map(p => (
                <TableRow key={p.id} hover>
                  <TableCell>{p.id}</TableCell>
                  <TableCell>{p.name}</TableCell>
                  <TableCell>{p.price}</TableCell>
                  <TableCell>{p.stockQuantity}</TableCell>
                  <TableCell>{p.minStockLevel}</TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      variant="contained"
                      onClick={() => handleOpenModal(p)}
                      sx={{ mr: 1 }}
                    >
                      Edit
                    </Button>
                    <Button
                      size="small"
                      variant="contained"
                      color="error"
                      onClick={() => handleDelete(p.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}

              {parts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center">No data</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* PAGINATION */}
          <TablePagination
            component="div"
            count={totalElements}
            page={page}
            onPageChange={(e, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
            rowsPerPageOptions={[5, 10, 20]}
          />
        </TableContainer>
      </Box>

      {/* MODAL THÊM/SỬA */}
      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle>{editingPart ? "Sửa Part" : "Thêm Part"}</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          <TextField
            label="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <TextField
            label="Price"
            type="number"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />
          <TextField
            label="Stock Quantity"
            type="number"
            value={form.stockQuantity}
            onChange={(e) => setForm({ ...form, stockQuantity: e.target.value })}
          />
          <TextField
            label="Min Stock Level"
            type="number"
            value={form.minStockLevel}
            onChange={(e) => setForm({ ...form, minStockLevel: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Hủy</Button>
          <Button variant="contained" onClick={handleSubmit}>
            {editingPart ? "Cập nhật" : "Thêm"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Parts;