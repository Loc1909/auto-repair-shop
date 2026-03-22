import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper,
  Button, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField,
  CircularProgress, TablePagination, Box, Typography, MenuItem
} from "@mui/material";

const roles = ["ROLE_ADMIN", "ROLE_STAFF", "ROLE_CUSTOMER"];

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalElements, setTotalElements] = useState(0);

  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const [openModal, setOpenModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const [form, setForm] = useState({
    username: "",
    password: "",
    email: "",
    role: "ROLE_STAFF",
    active: true
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
    fetchUsers();
  }, [page, rowsPerPage, search]);

  const fetchUsers = () => {
    setLoading(true);

    axiosClient.get("/admin/users", {
      params: {
        page,
        size: rowsPerPage,
        search
      }
    })
      .then(res => {
        setUsers(res.data?.content || []);
        setTotalElements(res.data?.totalElements || 0);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
    if (!window.confirm("Xóa user này?")) return;

    setLoading(true);
    try {
      await axiosClient.delete(`/admin/users/${id}`);

      if (users.length === 1 && page > 0) {
        setPage(page - 1);
      } else {
        fetchUsers();
      }
    } catch {
      alert("Xóa thất bại");
    } finally {
      setLoading(false);
    }
  };

  // ================= OPEN MODAL =================
  const handleOpenModal = (user = null) => {
    setEditingUser(user);

    if (user) {
      setForm({
        username: user.username || "",
        email: user.email || "",
        role: user.role || "ROLE_STAFF",
        active: user.active ?? true,
        password: ""
      });
    } else {
      setForm({
        username: "",
        password: "",
        email: "",
        role: "ROLE_STAFF",
        active: true
      });
    }

    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setEditingUser(null);
  };

  // ================= SUBMIT =================
  const handleSubmit = () => {
    if (!form.username || (!editingUser && !form.password)) {
      alert("Vui lòng nhập username và password");
      return;
    }

    const payload = { ...form };

    // không gửi password rỗng khi update
    if (editingUser && !payload.password) {
      delete payload.password;
    }

    const request = editingUser
      ? axiosClient.put(`/admin/users/${editingUser.id}`, payload)
      : axiosClient.post("/admin/users", payload);

    setLoading(true);

    request
      .then(() => {
        fetchUsers();
        setOpenModal(false);
      })
      .catch(() => alert("Thao tác thất bại"))
      .finally(() => setLoading(false));
  };

  // ================= UI =================
  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" sx={{ mb: 2, fontWeight: "bold" }}>
        Users
      </Typography>

      {/* SEARCH */}
      <TextField
        placeholder="Search username, email..."
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
        Thêm User
      </Button>

      <Box sx={{ position: "relative" }}>
        <TableContainer component={Paper} sx={{ borderRadius: 3 }}>

          {/* LOADING */}
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
                <TableCell><b>Email</b></TableCell>
                <TableCell><b>Role</b></TableCell>
                <TableCell><b>Active</b></TableCell>
                <TableCell><b>Action</b></TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {users.map(u => (
                <TableRow key={u.id} hover>
                  <TableCell>{u.id}</TableCell>
                  <TableCell>{u.username}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>{u.role}</TableCell>
                  <TableCell>{u.active ? "Yes" : "No"}</TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      variant="contained"
                      onClick={() => handleOpenModal(u)}
                      sx={{ mr: 1 }}
                    >
                      Edit
                    </Button>

                    <Button
                      size="small"
                      variant="contained"
                      color="error"
                      onClick={() => handleDelete(u.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}

              {users.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center">
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
          {editingUser ? "Edit User" : "Add User"}
        </DialogTitle>

        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          <TextField
            label="Username"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
          />

          {!editingUser && (
            <TextField
              label="Password"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          )}

          <TextField
            label="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <TextField
            select
            label="Role"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          >
            {roles.map(r => (
              <MenuItem key={r} value={r}>{r}</MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Active"
            value={form.active ? "true" : "false"}
            onChange={(e) => setForm({ ...form, active: e.target.value === "true" })}
          >
            <MenuItem value="true">Yes</MenuItem>
            <MenuItem value="false">No</MenuItem>
          </TextField>
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

export default Users;