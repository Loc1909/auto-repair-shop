import { useState } from "react";
import {
  Typography, Box, Grid, Card, CardContent,
  FormControl, InputLabel, Select, MenuItem, TextField, Button, Paper
} from "@mui/material";
import axiosClient from "../../api/axiosClient";
import dayjs from "dayjs";

const REPAIR_STATUSES = [
  { value: "DIAGNOSING", label: "Đang chẩn đoán" },
  { value: "QUOTING", label: "Đang báo giá" },
  { value: "APPROVED", label: "Đã duyệt báo giá" },
  { value: "REPAIRING", label: "Đang sửa chữa" },
  { value: "COMPLETED", label: "Hoàn thành" }
];

export default function RepairStatusTab({ repairOrderId, progresses, refreshData }) {
  const [newStatus, setNewStatus] = useState("DIAGNOSING");
  const [progressNote, setProgressNote] = useState("");

  const handleUpdateProgress = async () => {
    try {
      await axiosClient.post("/repair-progress", {
        repairOrderId: Number(repairOrderId),
        status: newStatus,
        note: progressNote
      });
      setProgressNote("");
      if (refreshData) refreshData();
    } catch (error) {
      console.error("Lỗi cập nhật tiến độ", error);
      alert(error.response?.data?.detail || "Cập nhật tiến độ thất bại!");
    }
  };

  return (
    <Grid container spacing={4}>
      <Grid item xs={12} md={5}>
        <Card sx={{ borderRadius: 4, boxShadow: "0 8px 16px rgba(0,0,0,0.03)" }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, color: "#1976d2", fontWeight: "bold" }}>
              Cập nhật Trạng thái mới
            </Typography>
            <Box display="flex" flexDirection="column" gap={2}>
              <FormControl fullWidth size="medium">
                <InputLabel>Trạng thái</InputLabel>
                <Select
                  value={newStatus}
                  label="Trạng thái"
                  onChange={(e) => setNewStatus(e.target.value)}
                  sx={{ borderRadius: 2 }}
                >
                  {REPAIR_STATUSES.map(s => (
                    <MenuItem key={s.value} value={s.value}>{s.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                label="Ghi chú thêm"
                multiline
                rows={3}
                variant="outlined"
                value={progressNote}
                onChange={(e) => setProgressNote(e.target.value)}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              />
              <Button variant="contained" color="primary" onClick={handleUpdateProgress} sx={{ py: 1.5, borderRadius: 2 }}>
                Ghi nhận
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12} md={7}>
        <Card sx={{ borderRadius: 4, boxShadow: "0 8px 16px rgba(0,0,0,0.03)" }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: "bold" }}>Lịch sử Thay đổi Tiến độ</Typography>
            {progresses.length === 0 ? (
              <Typography color="textSecondary">Chưa có thay đổi tiến độ nào.</Typography>
            ) : (
              <Box sx={{ position: "relative", ml: 2, pl: 3, borderLeft: "2px solid #e0e0e0" }}>
                {progresses.map((p, index) => (
                  <Box key={p.id} sx={{ mb: index !== progresses.length - 1 ? 4 : 0, position: "relative" }}>
                    <Box sx={{
                      position: "absolute", left: -34, top: 0,
                      width: 14, height: 14, borderRadius: "50%",
                      bgcolor: index === 0 ? "#1976d2" : "#a0aab5",
                      border: "4px solid #fff", boxShadow: "0 0 0 1px #e0e0e0"
                    }} />
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                      <Typography variant="subtitle1" fontWeight="bold" sx={{ color: index === 0 ? "#1976d2" : "#333" }}>
                        {p.status}
                      </Typography>
                      <Typography variant="caption" sx={{ color: "#888" }}>
                        {dayjs(p.timestamp).format("DD/MM/YYYY HH:mm")}
                      </Typography>
                    </Box>
                    {p.note && (
                      <Paper elevation={0} sx={{ mt: 1, p: 1.5, bgcolor: "#f8f9fa", borderRadius: 2 }}>
                        <Typography variant="body2" color="textSecondary">{p.note}</Typography>
                      </Paper>
                    )}
                  </Box>
                ))}
              </Box>
            )}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
