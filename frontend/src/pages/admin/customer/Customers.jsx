import { useEffect, useState } from "react";
import axiosClient from "../../../api/axiosClient";
import { Box, Typography, TextField } from "@mui/material";

import CustomerTable from "./CustomerTable";
import CustomerModal from "./CustomerModal";

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalElements, setTotalElements] = useState(0);

  const [search, setSearch] = useState("");

  const [openModal, setOpenModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);

  useEffect(() => {
    fetchCustomers();
  }, [page, rowsPerPage, search]);

  const fetchCustomers = () => {
    setLoading(true);

    axiosClient.get("/customers", {
      params: { page, size: rowsPerPage, search }
    })
      .then(res => {
        setCustomers(res.data?.content || []);
        setTotalElements(res.data?.totalElements || 0);
      })
      .finally(() => setLoading(false));
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Xóa khách hàng này?")) return;

    await axiosClient.delete(`/customers/${id}`);
    fetchCustomers();
  };

  const handleOpenModal = (customer) => {
    setEditingCustomer(customer);
    setOpenModal(true);
  };

  const handleSubmit = async (data) => {
    await axiosClient.put(`/customers/${editingCustomer.id}`, data);
    fetchCustomers();
    setOpenModal(false);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 2, fontWeight: "bold" ,color: "#3f51b5"}}>
       Quản lý khách hàng
      </Typography>

      <TextField
        placeholder="Tìm theo tên hoặc số điện thoại..."
        fullWidth
        sx={{ mb: 2 }}
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(0);
        }}
      />

      <CustomerTable
        customers={customers}
        loading={loading}
        page={page}
        rowsPerPage={rowsPerPage}
        totalElements={totalElements}
        onPageChange={setPage}
        onRowsPerPageChange={setRowsPerPage}
        onEdit={handleOpenModal}
        onDelete={handleDelete}
      />

      <CustomerModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSubmit={handleSubmit}
        editingCustomer={editingCustomer}
      />
    </Box>
  );
}

export default Customers;