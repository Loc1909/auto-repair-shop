import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField
} from "@mui/material";

function Parts() {
  const [parts, setParts] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [editingPart, setEditingPart] = useState(null);
  const [form, setForm] = useState({ name: "", price: "", stockQuantity: "", minStockLevel: "" });

  useEffect(() => {
    fetchParts();
  }, []);

  const fetchParts = () => {
    axiosClient.get("/admin/parts")
      .then(res => setParts(res.data))
      .catch(err => console.error(err));
  };

  const handleDelete = (id) => {
    if (!window.confirm("Xóa part này?")) return;

    axiosClient.delete(`/admin/parts/${id}`)
      .then(() => {
        alert("Xóa thành công");
        fetchParts();
      })
      .catch(() => alert("Xóa thất bại"));
  };

  const handleOpenModal = (part = null) => {
    setEditingPart(part);
    setForm(part ? { ...part } : { name: "", price: "", stockQuantity: "", minStockLevel: "" });
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleSubmit = () => {
    if (!form.name || !form.price || !form.stockQuantity || !form.minStockLevel) {
      alert("Vui lòng điền đầy đủ thông tin");
      return;
    }

    if (editingPart) {
      // Sửa part
      axiosClient.put(`/admin/parts/${editingPart.id}`, form)
        .then(() => {
          alert("Cập nhật thành công");
          fetchParts();
          setOpenModal(false);
        })
        .catch(() => alert("Cập nhật thất bại"));
    } else {
      // Thêm part
      axiosClient.post("/admin/parts", form)
        .then(() => {
          alert("Thêm thành công");
          fetchParts();
          setOpenModal(false);
        })
        .catch(() => alert("Thêm thất bại"));
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Parts</h2>

      <Button
        variant="contained"
        color="primary"
        onClick={() => handleOpenModal()}
        style={{ marginBottom: "10px" }}
      >
        Thêm Part
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell>Min Stock</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {parts.map((p) => (
              <TableRow key={p.id}>
                <TableCell>{p.id}</TableCell>
                <TableCell>{p.name}</TableCell>
                <TableCell>{p.price}</TableCell>
                <TableCell>{p.stockQuantity}</TableCell>
                <TableCell>{p.minStockLevel}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="success"
                    size="small"
                    onClick={() => handleOpenModal(p)}
                    style={{ marginRight: "5px" }}
                  >
                    Sửa
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    size="small"
                    onClick={() => handleDelete(p.id)}
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
        <DialogTitle>{editingPart ? "Sửa Part" : "Thêm Part"}</DialogTitle>
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
            label="Stock Quantity"
            type="number"
            value={form.stockQuantity}
            onChange={(e) => setForm({ ...form, stockQuantity: e.target.value })}
          />
          <TextField
            label="Min Stock Level"
            type="number"
            value={form.minStockLevel}
            onChange={(e) => setForm({ ...form, minStockLevel: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Hủy</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {editingPart ? "Cập nhật" : "Thêm"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Parts;