import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper,
  Button, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField,
  CircularProgress, TablePagination, Box, Typography
} from "@mui/material";

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalElements, setTotalElements] = useState(0);

  const [search, setSearch] = useState("");

  const [openModal, setOpenModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: ""
  });

  // ================= FETCH =================
  useEffect(() => {
    fetchCustomers();
  }, [page, rowsPerPage, search]);

  const fetchCustomers = () => {
    setLoading(true);

    axiosClient.get("/customers", {
      params: {
        page: page,
        size: rowsPerPage,
        search: search   // backend phải hỗ trợ
      }
    })
      .then(res => {
        setCustomers(res.data.content);
        setTotalElements(res.data.totalElements);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  // ================= DELETE =================
  const handleDelete = (id) => {
    if (!window.confirm("Xóa customer này?")) return;

    axiosClient.delete(`/customers/${id}`)
      .then(() => fetchCustomers())
      .catch(() => alert("Xóa thất bại"));
  };

  // ================= MODAL =================
  const handleOpenModal = (customer) => {
    setEditingCustomer(customer);
    setForm({
      name: customer.name || "",
      phone: customer.phone || "",
      address: customer.address || ""
    });
    setOpenModal(true);
  };

  const handleCloseModal = () => setOpenModal(false);

  // ================= UPDATE =================
  const handleSubmit = () => {
    axiosClient.put(`/customers/${editingCustomer.id}`, form)
      .then(() => {
        fetchCustomers();
        setOpenModal(false);
      })
      .catch(() => alert("Cập nhật thất bại"));
  };

  // ================= UI =================
  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" sx={{ mb: 2, fontWeight: "bold" }}>
        Customers
      </Typography>

      {/* SEARCH */}
      <TextField
        placeholder="Search name or phone..."
        fullWidth
        sx={{ mb: 2 }}
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(0); // reset về trang đầu
        }}
      />

      <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
        {loading ? (
          <Box sx={{ textAlign: "center", p: 5 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: "#f5f5f5" }}>
                  <TableCell><b>ID</b></TableCell>
                  <TableCell><b>Name</b></TableCell>
                  <TableCell><b>Phone</b></TableCell>
                  <TableCell><b>Address</b></TableCell>
                  <TableCell><b>Action</b></TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {customers.map(c => (
                  <TableRow key={c.id} hover>
                    <TableCell>{c.id}</TableCell>
                    <TableCell>{c.name}</TableCell>
                    <TableCell>{c.phone}</TableCell>
                    <TableCell>{c.address}</TableCell>
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

                {customers.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      No data
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

            {/* SERVER PAGINATION */}
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
          </>
        )}
      </TableContainer>

      {/* MODAL */}
      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle>Edit Customer</DialogTitle>

        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          <TextField
            label="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <TextField
            label="Phone"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />

          <TextField
            label="Address"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseModal}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Customers;