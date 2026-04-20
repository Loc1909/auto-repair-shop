import { useEffect, useState } from "react";
import axiosClient from "../../../api/axiosClient";
import {
  Box, Typography, TextField, Button
} from "@mui/material";

import UserTable from "./UserTable";
import UserModal from "./UserModal";

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

  // debounce search
  useEffect(() => {
    const delay = setTimeout(() => {
      setSearch(searchInput);
      setPage(0);
    }, 500);

    return () => clearTimeout(delay);
  }, [searchInput]);

  useEffect(() => {
    fetchUsers();
  }, [page, rowsPerPage, search]);

  const fetchUsers = () => {
    setLoading(true);

    axiosClient.get("/admin/users", {
      params: { page, size: rowsPerPage, search }
    })
      .then(res => {
        setUsers(res.data?.content || []);
        setTotalElements(res.data?.totalElements || 0);
      })
      .finally(() => setLoading(false));
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Xóa user này?")) return;

    await axiosClient.delete(`/admin/users/${id}`);
    fetchUsers();
  };

  const handleOpenModal = (user = null) => {
    setEditingUser(user);
    setOpenModal(true);
  };

  const handleSubmit = async (data) => {
    if (editingUser) {
      await axiosClient.put(`/admin/users/${editingUser.id}`, data);
    } else {
      await axiosClient.post("/admin/users", data);
    }

    fetchUsers();
    setOpenModal(false);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 2, fontWeight: "bold" }}>
        Quản lý người dùng
      </Typography>

      <TextField
        placeholder="Tìm kiếm người dùng..."
        fullWidth
        sx={{ mb: 2 }}
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
      />

      <Button variant="contained" sx={{ mb: 2 }} onClick={() => handleOpenModal()}>
        Thêm người dùng
      </Button>

      <UserTable
        users={users}
        loading={loading}
        page={page}
        rowsPerPage={rowsPerPage}
        totalElements={totalElements}
        onPageChange={setPage}
        onRowsPerPageChange={setRowsPerPage}
        onEdit={handleOpenModal}
        onDelete={handleDelete}
      />

      <UserModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSubmit={handleSubmit}
        editingUser={editingUser}
      />
    </Box>
  );
}

export default Users;