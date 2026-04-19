import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button
} from "@mui/material";
import { useState, useEffect } from "react";

function PartFormDialog({ open, onClose, onSubmit, editingPart }) {
  const [form, setForm] = useState({
    name: "",
    price: "",
    stockQuantity: "",
    minStockLevel: ""
  });

  useEffect(() => {
    if (editingPart) {
      setForm(editingPart);
    } else {
      setForm({
        name: "",
        price: "",
        stockQuantity: "",
        minStockLevel: ""
      });
    }
  }, [editingPart]);

  const handleSave = () => {
    if (!form.name || !form.price || !form.stockQuantity || !form.minStockLevel) {
      alert("Vui lòng điền đầy đủ");
      return;
    }
    onSubmit(form);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{editingPart ? "Sửa" : "Thêm"} phụ tùng</DialogTitle>

      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField label="Tên phụ tùng"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
        />

        <TextField label="Giá" type="number"
          value={form.price}
          onChange={e => setForm({ ...form, price: e.target.value })}
        />

        <TextField label="Số lượng tồn kho" type="number"
          value={form.stockQuantity}
          onChange={e => setForm({ ...form, stockQuantity: e.target.value })}
        />

        <TextField label="Mức tồn kho tối thiểu" type="number"
          value={form.minStockLevel}
          onChange={e => setForm({ ...form, minStockLevel: e.target.value })}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button variant="contained" onClick={handleSave}>
          Lưu
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default PartFormDialog;