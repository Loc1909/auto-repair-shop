import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, MenuItem,
  FormGroup, FormControlLabel, Checkbox, Switch
} from "@mui/material";
import { useState, useEffect } from "react";

const EVENT_TYPES = [
  "APPOINTMENT_REMINDER",
  "APPOINTMENT_CONFIRMED",
  "APPOINTMENT_CANCELLED",
  "REPAIR_UPDATE",
  "REPAIR_COMPLETE",
];

const CHANNELS = ["EMAIL", "PUSH"];

function NotificationFormDialog({ open, onClose, onSubmit, editingConfig }) {
  const [form, setForm] = useState({
    name: "",
    emailTemplate: "",
    pushTemplate: "",
    eventType: "",
    sendTimeOffset: 0,
    channels: [],
    status: true
  });

  useEffect(() => {
    if (editingConfig) {
      setForm({
        name: editingConfig.name || "",
        emailTemplate: editingConfig.templateEmail || "",
        pushTemplate: editingConfig.templatePush || "",
        eventType: editingConfig.eventType || "",
        sendTimeOffset: editingConfig.sendTimeOffset || 0,
        channels: editingConfig.channels || [],
        status: editingConfig.status === "ACTIVE"
      });
    } else {
      setForm({
        name: "",
        emailTemplate: "",
        pushTemplate: "",
        eventType: "",
        sendTimeOffset: 0,
        channels: [],
        status: true
      });
    }
  }, [editingConfig]);

  const toggleChannel = (ch) => {
    setForm(prev => ({
      ...prev,
      channels: prev.channels.includes(ch)
        ? prev.channels.filter(c => c !== ch)
        : [...prev.channels, ch]
    }));
  };

  const handleSave = () => {
    if (!form.name || !form.eventType) {
      alert("Thiếu dữ liệu");
      return;
    }
    onSubmit(form);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        {editingConfig ? "Chỉnh sửa" : "Thêm"} cấu hình thông báo
      </DialogTitle>

      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField
          label="Tên"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
        />

        <TextField
          label="Mẫu email"
          multiline
          minRows={3}
          value={form.emailTemplate}
          onChange={e => setForm({ ...form, emailTemplate: e.target.value })}
        />

        <TextField
          label="Mẫu thông báo (push)"
          value={form.pushTemplate}
          onChange={e => setForm({ ...form, pushTemplate: e.target.value })}
        />

        <TextField
          select
          label="Loại sự kiện"
          value={form.eventType}
          onChange={e => setForm({ ...form, eventType: e.target.value })}
        >
          {EVENT_TYPES.map(e => (
            <MenuItem key={e} value={e}>{e}</MenuItem>
          ))}
        </TextField>

        <TextField
          type="number"
          label="Thời gian gửi trước (phút)"
          value={form.sendTimeOffset}
          onChange={e => setForm({ ...form, sendTimeOffset: e.target.value })}
        />

        <FormGroup row>
          {CHANNELS.map(ch => (
            <FormControlLabel
              key={ch}
              control={
                <Checkbox
                  checked={form.channels.includes(ch)}
                  onChange={() => toggleChannel(ch)}
                />
              }
              label={ch}
            />
          ))}
        </FormGroup>

        <FormControlLabel
          control={
            <Switch
              checked={form.status}
              onChange={e => setForm({ ...form, status: e.target.checked })}
            />
          }
          label="Kích hoạt"
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

export default NotificationFormDialog;