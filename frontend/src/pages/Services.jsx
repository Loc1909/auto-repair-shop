import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField
} from "@mui/material";

function Services() {
  const [services, setServices] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [form, setForm] = useState({ name: "", price: "", categoryName: "" });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = () => {
    axiosClient.get("/admin/services")
      .then(res => setServices(res.data))
      .catch(err => console.error(err));
  };

  const handleDelete = (id) => {
    if (!window.confirm("Xóa service này?")) return;

    axiosClient.delete(`/admin/services/${id}`)
      .then(() => {
        alert("Xóa thành công");
        fetchServices();
      })
      .catch(() => alert("Xóa thất bại"));
  };

  const handleOpenModal = (service = null) => {
    setEditingService(service);
    setForm(service ? { ...service } : { name: "", price: "", categoryName: "" });
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleSubmit = () => {
    if (!form.name || !form.price || !form.categoryName) {
      alert("Vui lòng điền đầy đủ thông tin");
      return;
    }

    if (editingService) {
      // Sửa service
      axiosClient.put(`/admin/services/${editingService.id}`, form)
        .then(() => {
          alert("Cập nhật thành công");
          fetchServices();
          setOpenModal(false);
        })
        .catch(() => alert("Cập nhật thất bại"));
    } else {
      // Thêm service
      axiosClient.post("/admin/services", form)
        .then(() => {
          alert("Thêm thành công");
          fetchServices();
          setOpenModal(false);
        })
        .catch(() => alert("Thêm thất bại"));
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Services</h2>

      <Button
        variant="contained"
        color="primary"
        onClick={() => handleOpenModal()}
        style={{ marginBottom: "10px" }}
      >
        Thêm Service
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {services.map((s) => (
              <TableRow key={s.id}>
                <TableCell>{s.id}</TableCell>
                <TableCell>{s.name}</TableCell>
                <TableCell>{s.price}</TableCell>
                <TableCell>{s.categoryName}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="success"
                    size="small"
                    onClick={() => handleOpenModal(s)}
                    style={{ marginRight: "5px" }}
                  >
                    Sửa
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    size="small"
                    onClick={() => handleDelete(s.id)}
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
        <DialogTitle>{editingService ? "Sửa Service" : "Thêm Service"}</DialogTitle>
        <DialogContent style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "5px" }}>
          <TextField
            label="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <TextField
            label="Price"
            type="number"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />
          <TextField
            label="Category"
            value={form.categoryName}
            onChange={(e) => setForm({ ...form, categoryName: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Hủy</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {editingService ? "Cập nhật" : "Thêm"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Services;