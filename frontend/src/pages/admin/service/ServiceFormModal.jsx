import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, MenuItem, Select, InputLabel, FormControl
} from "@mui/material";

function ServiceFormModal({
  open,
  onClose,
  onSubmit,
  form,
  setForm,
  categories,
  editingService,
  loading
}) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        {editingService ? "Sửa dịch vụ" : "Thêm dịch vụ"}
      </DialogTitle>

      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
        <TextField
          label="Tên dịch vụ"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <TextField
          label="Giá"
          type="number"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
        />

        <TextField
          label="Mô tả"
          multiline
          rows={3}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        <FormControl fullWidth>
          <InputLabel>Danh mục</InputLabel>
          <Select
            value={form.categoryId}
            label="Danh mục"
            onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
          >
            {categories.map(cat => (
              <MenuItem key={cat.id} value={cat.id}>
                {cat.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button variant="contained" onClick={onSubmit} disabled={loading}>
          Lưu
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ServiceFormModal;