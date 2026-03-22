import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper,
  Button, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField,
  CircularProgress, TablePagination, Box, Typography
} from "@mui/material";

function ServiceCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalElements, setTotalElements] = useState(0);

  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const [openModal, setOpenModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const [form, setForm] = useState({
    name: "",
    description: ""
  });

  // ================= DEBOUNCE SEARCH =================
  useEffect(() => {
    const delay = setTimeout(() => {
      setSearch(searchInput);
      setPage(0);
    }, 500);

    return () => clearTimeout(delay);
  }, [searchInput]);

  // ================= FETCH =================
  useEffect(() => {
    fetchCategories();
  }, [page, rowsPerPage, search]);

  const fetchCategories = () => {
    setLoading(true);

    axiosClient.get("/admin/service-categories", {
      params: {
        page,
        size: rowsPerPage,
        search
      }
    })
      .then(res => {
        setCategories(res.data?.content || []);
        setTotalElements(res.data?.totalElements || 0);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
    if (!window.confirm("Xóa category này?")) return;

    setLoading(true);
    try {
      await axiosClient.delete(`/admin/service-categories/${id}`);

      if (categories.length === 1 && page > 0) {
        setPage(page - 1);
      } else {
        fetchCategories();
      }
    } catch {
      alert("Xóa thất bại");
    } finally {
      setLoading(false);
    }
  };

  // ================= MODAL =================
  const handleOpenModal = (category = null) => {
    setEditingCategory(category);

    if (category) {
      setForm({
        name: category.name || "",
        description: category.description || ""
      });
    } else {
      setForm({
        name: "",
        description: ""
      });
    }

    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setEditingCategory(null);
  };

  // ================= SUBMIT =================
  const handleSubmit = () => {
    if (!form.name) {
      alert("Vui lòng nhập tên category");
      return;
    }

    const request = editingCategory
      ? axiosClient.put(`/admin/service-categories/${editingCategory.id}`, form)
      : axiosClient.post("/admin/service-categories", form);

    setLoading(true);

    request
      .then(() => {
        fetchCategories();
        setOpenModal(false);
      })
      .catch(() => alert("Thao tác thất bại"))
      .finally(() => setLoading(false));
  };

  // ================= UI =================
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 2, fontWeight: "bold" }}>
        Service Categories
      </Typography>

      {/* SEARCH */}
      <TextField
        placeholder="Search category name..."
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
        Thêm Category
      </Button>

      <Box sx={{ position: "relative" }}>
        <TableContainer component={Paper} sx={{ borderRadius: 3 }}>

          {/* LOADING */}
          {loading && (
            <Box sx={{
              position: "absolute",
              width: "100%",
              height: "100%",
              bgcolor: "rgba(255,255,255,0.6)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
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
                <TableCell><b>Description</b></TableCell>
                <TableCell><b>Action</b></TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {categories.map(c => (
                <TableRow key={c.id} hover>
                  <TableCell>{c.id}</TableCell>
                  <TableCell>{c.name}</TableCell>
                  <TableCell>{c.description}</TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      variant="contained"
                      onClick={() => handleOpenModal(c)}
                      sx={{ mr: 1 }}
                    >
                      Edit
                    </Button>

                    <Button
                      size="small"
                      variant="contained"
                      color="error"
                      onClick={() => handleDelete(c.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}

              {categories.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    No data
                  </TableCell>
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
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
            rowsPerPageOptions={[5, 10, 20]}
          />
        </TableContainer>
      </Box>

      {/* MODAL */}
      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle>
          {editingCategory ? "Edit Category" : "Add Category"}
        </DialogTitle>

        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          <TextField
            label="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <TextField
            label="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            multiline
            rows={3}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseModal}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit} disabled={loading}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default ServiceCategories;