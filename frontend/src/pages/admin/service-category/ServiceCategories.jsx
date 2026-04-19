import { useEffect, useState } from "react";
import axiosClient from "../../../api/axiosClient";
import { Box, Typography, TextField, Button } from "@mui/material";
import CategoryTable from "./Categorytable";
import CategoryFormModal from "./CategoryFormModal";

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

  // debounce
  useEffect(() => {
    const delay = setTimeout(() => {
      setSearch(searchInput);
      setPage(0);
    }, 500);
    return () => clearTimeout(delay);
  }, [searchInput]);

  useEffect(() => {
    fetchCategories();
  }, [page, rowsPerPage, search]);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await axiosClient.get("/admin/service-categories", {
        params: { page, size: rowsPerPage, search }
      });
      setCategories(res.data?.content || []);
      setTotalElements(res.data?.totalElements || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Xóa danh mục này?")) return;

    try {
      await axiosClient.delete(`/admin/service-categories/${id}`);

      if (categories.length === 1 && page > 0) {
        setPage(page - 1);
      } else {
        fetchCategories();
      }
    } catch {
      alert("Xóa thất bại");
    }
  };

  const handleOpenModal = (category = null) => {
    setEditingCategory(category);
    setOpenModal(true);
  };

  const handleSubmit = async (form) => {
    try {
      if (editingCategory) {
        await axiosClient.put(`/admin/service-categories/${editingCategory.id}`, form);
      } else {
        await axiosClient.post("/admin/service-categories", form);
      }

      fetchCategories();
      setOpenModal(false);
    } catch {
      alert("Thao tác thất bại");
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 2, fontWeight: "bold" }}>
        Danh mục dịch vụ
      </Typography>

      <TextField
        placeholder="Tìm theo tên danh mục..."
        fullWidth
        sx={{ mb: 2 }}
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
      />

      <Button variant="contained" sx={{ mb: 2 }} onClick={() => handleOpenModal()}>
        Thêm danh mục
      </Button>

      <CategoryTable
        categories={categories}
        loading={loading}
        page={page}
        rowsPerPage={rowsPerPage}
        totalElements={totalElements}
        onPageChange={setPage}
        onRowsPerPageChange={setRowsPerPage}
        onEdit={handleOpenModal}
        onDelete={handleDelete}
      />

      <CategoryFormModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSubmit={handleSubmit}
        editingCategory={editingCategory}
      />
    </Box>
  );
}

export default ServiceCategories;