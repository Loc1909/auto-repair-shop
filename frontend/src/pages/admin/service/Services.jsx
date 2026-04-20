import { useEffect, useState } from "react";
import axiosClient from "../../../api/axiosClient";
import { Box, Typography, TextField, Button } from "@mui/material";
import ServiceTable from "./CategoryTable";
import ServiceModal from "./ServiceFormModal";

function Services() {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalElements, setTotalElements] = useState(0);

  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const [openModal, setOpenModal] = useState(false);
  const [editingService, setEditingService] = useState(null);

  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    categoryId: ""
  });

  // debounce
  useEffect(() => {
    const delay = setTimeout(() => {
      setSearch(searchInput);
      setPage(0);
    }, 500);
    return () => clearTimeout(delay);
  }, [searchInput]);

  useEffect(() => {
    fetchServices();
    fetchCategories();
  }, [page, rowsPerPage, search]);

  const fetchServices = () => {
    setLoading(true);
    axiosClient.get("/admin/services", {
      params: { page, size: rowsPerPage, search }
    })
      .then(res => {
        setServices(res.data?.content || []);
        setTotalElements(res.data?.totalElements || 0);
      })
      .finally(() => setLoading(false));
  };

  const fetchCategories = () => {
    axiosClient.get("/admin/service-categories", {
      params: { page: 0, size: 1000 }
    })
      .then(res => setCategories(res.data?.content || []));
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Xóa service này?")) return;
    await axiosClient.delete(`/admin/services/${id}`);
    fetchServices();
  };

  const handleOpenModal = (service = null) => {
    setEditingService(service);
    setForm(service || {
      name: "",
      price: "",
      description: "",
      categoryId: ""
    });
    setOpenModal(true);
  };

  const handleSubmit = async () => {
    const payload = {
      ...form,
      price: Number(form.price)
    };

    if (editingService) {
      await axiosClient.put(`/admin/services/${editingService.id}`, payload);
    } else {
      await axiosClient.post("/admin/services", payload);
    }

    fetchServices();
    setOpenModal(false);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 2, fontWeight: "bold" ,color: "#3f51b5"}}>
        Quản lý dịch vụ
      </Typography>

      <TextField
        placeholder="Tìm kiếm dịch vụ ..."
        fullWidth
        sx={{ mb: 2 }}
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
      />

      <Button variant="contained" sx={{ mb: 2 }} onClick={() => handleOpenModal()}>
        Thêm dịch vụ
      </Button>

      <ServiceTable
        services={services}
        loading={loading}
        page={page}
        rowsPerPage={rowsPerPage}
        totalElements={totalElements}
        onPageChange={(e, p) => setPage(p)}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setPage(0);
        }}
        onEdit={handleOpenModal}
        onDelete={handleDelete}
      />

      <ServiceModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSubmit={handleSubmit}
        form={form}
        setForm={setForm}
        categories={categories}
        editingService={editingService}
        loading={loading}
      />
    </Box>
  );
}

export default Services;