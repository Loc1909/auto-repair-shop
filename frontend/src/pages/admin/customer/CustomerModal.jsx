import { useEffect, useState } from "react";
import {
  Dialog, DialogTitle, DialogContent,
  DialogActions, Button, TextField
} from "@mui/material";

function CustomerModal({ open, onClose, onSubmit, editingCustomer }) {

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: ""
  });

  useEffect(() => {
    if (editingCustomer) {
      setForm({
        name: editingCustomer.name || "",
        phone: editingCustomer.phone || "",
        address: editingCustomer.address || ""
      });
    }
  }, [editingCustomer]);

  const handleSubmit = () => {
    onSubmit(form);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Chỉnh sửa khách hàng</DialogTitle>

      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
        <TextField
          label="Tên"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <TextField
          label="Số điện thoại"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />

        <TextField
          label="Địa chỉ"
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button variant="contained" onClick={handleSubmit}>
          Lưu
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default CustomerModal;