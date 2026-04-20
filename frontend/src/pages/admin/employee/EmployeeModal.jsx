import { useEffect, useState } from "react";
import {
  Dialog, DialogTitle, DialogContent,
  DialogActions, Button, TextField
} from "@mui/material";

function EmployeeModal({ open, onClose, onSubmit, editingEmployee }) {

  const [form, setForm] = useState({
    name: "",
    phone: "",
    position: "",
    salary: ""
  });

  useEffect(() => {
    if (editingEmployee) {
      setForm({
        name: editingEmployee.name || "",
        phone: editingEmployee.phone || "",
        position: editingEmployee.position || "",
        salary: editingEmployee.salary || ""
      });
    }
  }, [editingEmployee]);

  const handleSubmit = () => {
    if (!form.name || !form.phone) {
      alert("Vui lòng nhập Name và Phone");
      return;
    }

    onSubmit({
      ...form,
      salary: Number(form.salary) || 0
    });
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Sửa thông tin nhân viên</DialogTitle>

      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
        <TextField
          label="Tên nhân viên"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <TextField
          label="Điện thoại"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />

        <TextField
          label="Chức vụ"
          value={form.position}
          onChange={(e) => setForm({ ...form, position: e.target.value })}
        />

        <TextField
          label="Lương"
          type="number"
          value={form.salary}
          onChange={(e) => setForm({ ...form, salary: e.target.value })}
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

export default EmployeeModal;