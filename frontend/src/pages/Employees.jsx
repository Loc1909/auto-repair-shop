import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper,
  Button, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField,
  CircularProgress, TablePagination, Box, Typography
} from "@mui/material";

function Employees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalElements, setTotalElements] = useState(0);

  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const [openModal, setOpenModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    position: "",
    salary: ""
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
    fetchEmployees();
  }, [page, rowsPerPage, search]);

  const fetchEmployees = () => {
    setLoading(true);

    axiosClient.get("/admin/employees", {
      params: {
        page,
        size: rowsPerPage,
        search
      }
    })
      .then(res => {
        setEmployees(res.data.content);
        setTotalElements(res.data.totalElements);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  // ================= DELETE =================
  const handleDelete = (id) => {
    if (!window.confirm("Xóa employee này?")) return;

    axiosClient.delete(`/admin/employees/${id}`)
      .then(() => {
        if (employees.length === 1 && page > 0) {
          setPage(page - 1);
        } else {
          fetchEmployees();
        }
      })
      .catch(() => alert("Xóa thất bại"));
  };

  // ================= EDIT =================
  const handleOpenModal = (emp) => {
    setEditingEmployee(emp);
    setForm({
      name: emp.name || "",
      phone: emp.phone || "",
      position: emp.position || "",
      salary: emp.salary || ""
    });
    setOpenModal(true);
  };

  const handleCloseModal = () => setOpenModal(false);

  // ================= UPDATE =================
  const handleSubmit = () => {
    if (!form.name || !form.phone) {
      alert("Vui lòng nhập Name và Phone");
      return;
    }

    axiosClient.put(`/admin/employees/${editingEmployee.id}`, form)
      .then(() => {
        fetchEmployees();
        setOpenModal(false);
      })
      .catch(() => alert("Cập nhật thất bại"));
  };

  // ================= UI =================
  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" sx={{ mb: 2, fontWeight: "bold" }}>
        Employees
      </Typography>

      {/* SEARCH */}
      <TextField
        placeholder="Search name, phone, position..."
        fullWidth
        sx={{ mb: 2 }}
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
      />

      <Box sx={{ position: "relative" }}>
        <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
          
          {/* LOADING OVERLAY */}
          {loading && (
            <Box sx={{
              position: "absolute",
              top: 0,
              left: 0,
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
                <TableCell><b>Username</b></TableCell>
                <TableCell><b>Name</b></TableCell>
                <TableCell><b>Phone</b></TableCell>
                <TableCell><b>Position</b></TableCell>
                <TableCell><b>Salary</b></TableCell>
                <TableCell><b>Action</b></TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {employees.map(e => (
                <TableRow key={e.id} hover>
                  <TableCell>{e.id}</TableCell>
                  <TableCell>{e.username}</TableCell>
                  <TableCell>{e.name}</TableCell>
                  <TableCell>{e.phone}</TableCell>
                  <TableCell>{e.position}</TableCell>
                  <TableCell>
                    {e.salary?.toLocaleString("vi-VN")} ₫
                  </TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      variant="contained"
                      onClick={() => handleOpenModal(e)}
                      sx={{ mr: 1 }}
                    >
                      Edit
                    </Button>

                    <Button
                      size="small"
                      variant="contained"
                      color="error"
                      onClick={() => handleDelete(e.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}

              {employees.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center">
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
        <DialogTitle>Edit Employee</DialogTitle>

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
            label="Position"
            value={form.position}
            onChange={(e) => setForm({ ...form, position: e.target.value })}
          />

          <TextField
            label="Salary"
            type="number"
            value={form.salary}
            onChange={(e) => setForm({ ...form, salary: e.target.value })}
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

export default Employees;