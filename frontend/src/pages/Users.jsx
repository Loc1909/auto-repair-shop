import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem
} from "@mui/material";

const roles = ["ROLE_ADMIN", "ROLE_STAFF", "ROLE_CUSTOMER"];

function Users() {
  const [users, setUsers] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form, setForm] = useState({ username: "", password: "", email: "", role: "ROLE_STAFF", active: true });

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = () => {
    axiosClient.get("/users")
      .then(res => setUsers(res.data))
      .catch(err => console.error(err));
  };

  const handleDelete = (id) => {
    if (!window.confirm("Xóa user này?")) return;

    axiosClient.delete(`/users/${id}`)
      .then(() => { alert("Xóa thành công"); fetchUsers(); })
      .catch(() => alert("Xóa thất bại"));
  };

  const handleOpenModal = (user = null) => {
    setEditingUser(user);
    setForm(user ? { ...user, password: "" } : { username: "", password: "", email: "", role: "ROLE_STAFF", active: true });
    setOpenModal(true);
  };

  const handleCloseModal = () => { setOpenModal(false); };

  const handleSubmit = () => {
    if (!form.username || (!editingUser && !form.password)) {
      alert("Vui lòng điền đầy đủ thông tin");
      return;
    }

    const request = editingUser
      ? axiosClient.put(`/users/${editingUser.id}`, form)
      : axiosClient.post("/users", form);

    request.then(() => {
      alert(editingUser ? "Cập nhật thành công" : "Thêm thành công");
      fetchUsers();
      setOpenModal(false);
    }).catch(() => alert("Thao tác thất bại"));
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Users</h2>

      <Button
        variant="contained"
        color="primary"
        onClick={() => handleOpenModal()}
        style={{ marginBottom: "10px" }}
      >
        Thêm User
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Active</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((u) => (
              <TableRow key={u.id}>
                <TableCell>{u.id}</TableCell>
                <TableCell>{u.username}</TableCell>
                <TableCell>{u.email}</TableCell>
                <TableCell>{u.role}</TableCell>
                <TableCell>{u.active ? "Yes" : "No"}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="success"
                    size="small"
                    onClick={() => handleOpenModal(u)}
                    style={{ marginRight: "5px" }}
                  >
                    Sửa
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    size="small"
                    onClick={() => handleDelete(u.id)}
                  >
                    Xóa
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal Thêm/Sửa */}
      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle>{editingUser ? "Sửa User" : "Thêm User"}</DialogTitle>
        <DialogContent style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "5px" }}>
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
            value={form.email || ""}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <TextField
            select
            label="Role"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          >
            {roles.map(r => <MenuItem key={r} value={r}>{r}</MenuItem>)}
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
          <Button onClick={handleCloseModal}>Hủy</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {editingUser ? "Cập nhật" : "Thêm"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Users;