import { useEffect, useState } from "react";
import axiosClient from "../../../api/axiosClient";
import { Box, Typography, TextField } from "@mui/material";

import EmployeeTable from "./EmployeeTable";
import EmployeeModal from "./EmployeeModal";

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

  // debounce search
  useEffect(() => {
    const delay = setTimeout(() => {
      setSearch(searchInput);
      setPage(0);
    }, 500);

    return () => clearTimeout(delay);
  }, [searchInput]);

  useEffect(() => {
    fetchEmployees();
  }, [page, rowsPerPage, search]);

  const fetchEmployees = () => {
    setLoading(true);

    axiosClient.get("/admin/employees", {
      params: { page, size: rowsPerPage, search }
    })
      .then(res => {
        setEmployees(res.data?.content || []);
        setTotalElements(res.data?.totalElements || 0);
      })
      .finally(() => setLoading(false));
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Xóa employee này?")) return;

    await axiosClient.delete(`/admin/employees/${id}`);

    if (employees.length === 1 && page > 0) {
      setPage(page - 1);
    } else {
      fetchEmployees();
    }
  };

  const handleOpenModal = (emp) => {
    setEditingEmployee(emp);
    setOpenModal(true);
  };

  const handleSubmit = async (data) => {
    await axiosClient.put(`/admin/employees/${editingEmployee.id}`, data);
    fetchEmployees();
    setOpenModal(false);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 2, fontWeight: "bold" }}>
        Quản lý nhân viên
      </Typography>

      <TextField
        placeholder="Tìm kiếm nhân viên, điện thoại, chức vụ..."
        fullWidth
        sx={{ mb: 2 }}
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
      />

      <EmployeeTable
        employees={employees}
        loading={loading}
        page={page}
        rowsPerPage={rowsPerPage}
        totalElements={totalElements}
        onPageChange={setPage}
        onRowsPerPageChange={setRowsPerPage}
        onEdit={handleOpenModal}
        onDelete={handleDelete}
      />

      <EmployeeModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSubmit={handleSubmit}
        editingEmployee={editingEmployee}
      />
    </Box>
  );
}

export default Employees;