import { useEffect, useState } from "react";
import {
  Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Button
} from "@mui/material";

function CategoryFormModal({ open, onClose, onSubmit, editingCategory }) {
  const [form, setForm] = useState({ name: "", description: "" });

  useEffect(() => {
    if (editingCategory) {
      setForm({
        name: editingCategory.name || "",
        description: editingCategory.description || ""
      });
    } else {
      setForm({ name: "", description: "" });
    }
  }, [editingCategory]);

  const handleSubmit = () => {
    if (!form.name) {
      alert("Vui lòng nhập tên danh mục");
      return;
    }
    onSubmit(form);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        {editingCategory ? "Chỉnh sửa danh mục" : "Thêm danh mục"}
      </DialogTitle>

      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
        <TextField
          label="Tên"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <TextField
          label="Mô tả"
          multiline
          rows={3}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
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

export default CategoryFormModal;