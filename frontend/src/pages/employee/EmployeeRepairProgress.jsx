import { useState, useEffect } from "react";
import {
  Typography, Box, Paper, Grid, CircularProgress,
  Button, List, ListItem, ListItemText, Divider,
  TextField, MenuItem, Select, FormControl, InputLabel, Chip,
  Autocomplete
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import axiosClient from "../../api/axiosClient";
import dayjs from "dayjs";

function EmployeeRepairProgress() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [progresses, setProgresses] = useState([]);
  const [partRequests, setPartRequests] = useState([]);
  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form Cập nhật tiến độ
  const [newStatus, setNewStatus] = useState("DIAGNOSING");
  const [progressNote, setProgressNote] = useState("");

  // Form Yêu cầu vật tư
  const [selectedPart, setSelectedPart] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const REPAIR_STATUSES = [
    { value: "DIAGNOSING", label: "Đang chẩn đoán" },
    { value: "QUOTING", label: "Đang báo giá" },
    { value: "APPROVED", label: "Đã duyệt báo giá" },
    { value: "REPAIRING", label: "Đang sửa chữa" },
    { value: "COMPLETED", label: "Hoàn thành" }
  ];

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [progRes, reqRes, partsRes] = await Promise.all([
        axiosClient.get(`/repair-progress/by-order/${id}`),
        axiosClient.get(`/part-requests/by-order/${id}`),
        axiosClient.get(`/admin/parts`) // Fetch parts list for dropdown
      ]);
      setProgresses(progRes.data);
      setPartRequests(reqRes.data);
      setParts(partsRes.data.content || partsRes.data || []);
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu chi tiết phiếu sửa chữa", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProgress = async () => {
    try {
      await axiosClient.post("/repair-progress", {
        repairOrderId: Number(id),
        status: newStatus,
        note: progressNote
      });
      setProgressNote("");
      fetchData(); // reload
    } catch (error) {
      console.error("Lỗi cập nhật tiến độ", error);
      alert("Cập nhật tiến độ thất bại!");
    }
  };

  const handleRequestPart = async () => {
    if (!selectedPart || quantity <= 0) {
      alert("Vui lòng chọn vật tư và số lượng hợp lệ");
      return;
    }
    try {
      await axiosClient.post("/part-requests", {
        repairOrderId: Number(id),
        partId: selectedPart.id,
        requestedQuantity: Number(quantity)
      });
      setSelectedPart(null);
      setQuantity(1);
      fetchData(); // reload
    } catch (error) {
      console.error("Lỗi yêu cầu vật tư", error);
      alert("Yêu cầu vật tư thất bại!");
    }
  };

  if (loading) {
    return <CircularProgress sx={{ display: "block", mx: "auto", mt: 4 }} />;
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight="bold">
          Chi tiết Phiếu sửa chữa #{id}
        </Typography>
        <Button variant="outlined" onClick={() => navigate("/employee/repair-orders")}>
          Quay lại
        </Button>
      </Box>

      <Grid container spacing={4}>
        {/* TIẾN ĐỘ SỬA CHỮA */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, borderRadius: 2, mb: 3, boxShadow: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, color: "#1976d2", fontWeight: "bold" }}>
              Cập nhật Tiến độ
            </Typography>
            <Box display="flex" flexDirection="column" gap={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Trạng thái mới</InputLabel>
                <Select
                  value={newStatus}
                  label="Trạng thái mới"
                  onChange={(e) => setNewStatus(e.target.value)}
                >
                  {REPAIR_STATUSES.map(s => (
                    <MenuItem key={s.value} value={s.value}>{s.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                label="Ghi chú hoàn thành/tiến độ"
                multiline
                rows={2}
                size="small"
                value={progressNote}
                onChange={(e) => setProgressNote(e.target.value)}
              />

              <Button variant="contained" color="primary" onClick={handleUpdateProgress}>
                Ghi nhận Tiến độ
              </Button>
            </Box>
          </Paper>

          <Paper sx={{ p: 2, borderRadius: 2, boxShadow: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
              Lịch sử Tiến độ
            </Typography>
            {progresses.length === 0 ? (
              <Typography color="textSecondary">Chưa có ghi nhận tiến độ.</Typography>
            ) : (
              <List>
                {progresses.map((p, index) => (
                  <div key={p.id}>
                    <ListItem alignItems="flex-start">
                      <ListItemText
                        primary={
                          <Box display="flex" alignItems="center" gap={1}>
                            <Typography variant="subtitle2" fontWeight="bold">{p.status}</Typography>
                            <span style={{ fontSize: '0.8rem', color: '#888' }}>
                              {dayjs(p.timestamp).format("DD/MM/YYYY HH:mm")}
                            </span>
                          </Box>
                        }
                        secondary={p.note || "Không có ghi chú"}
                      />
                    </ListItem>
                    {index < progresses.length - 1 && <Divider component="li" />}
                  </div>
                ))}
              </List>
            )}
          </Paper>
        </Grid>

        {/* YÊU CẦU VẬT TƯ */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, borderRadius: 2, mb: 3, boxShadow: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, color: "#e91e63", fontWeight: "bold" }}>
              Yêu cầu Vật tư mới
            </Typography>
            <Box display="flex" flexDirection="column" gap={2}>
              <Autocomplete
                options={parts}
                getOptionLabel={(part) =>
                  `${part.name} (Kho: ${part.stockQuantity} - ${part.price?.toLocaleString() || "N/A"} VND)`
                }
                isOptionEqualToValue={(option, value) => option.id === value.id}
                value={selectedPart}
                onChange={(_, newValue) => setSelectedPart(newValue)}
                noOptionsText="Không tìm thấy vật tư"
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Chọn Vật tư"
                    size="small"
                    placeholder="Gõ tên vật tư để tìm..."
                  />
                )}
              />

              <TextField
                label="Số lượng cần"
                type="number"
                size="small"
                inputProps={{ min: 1 }}
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />

              <Button variant="contained" color="secondary" onClick={handleRequestPart}>
                Gửi Yêu cầu
              </Button>
            </Box>
          </Paper>

          <Paper sx={{ p: 2, borderRadius: 2, boxShadow: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
              Danh sách Vật tư đã yêu cầu
            </Typography>
            {partRequests.length === 0 ? (
              <Typography color="textSecondary">Chưa có yêu cầu vật tư nào.</Typography>
            ) : (
              <List>
                {partRequests.map((req, index) => (
                  <div key={req.id}>
                    <ListItem alignItems="flex-start">
                      <ListItemText
                        primary={
                          <Box display="flex" justifyContent="space-between">
                            <strong>{req.part?.name || `Vật tư ID: ${req.partId}`}</strong>
                            <Chip
                              label={req.status}
                              size="small"
                              color={req.status === 'APPROVED' ? 'success' : req.status === 'REJECTED' ? 'error' : 'warning'}
                            />
                          </Box>
                        }
                        secondary={`Số lượng: ${req.requestedQuantity} - Ngày YC: ${dayjs(req.requestDate).format("DD/MM/YYYY HH:mm")}`}
                      />
                    </ListItem>
                    {index < partRequests.length - 1 && <Divider component="li" />}
                  </div>
                ))}
              </List>
            )}
          </Paper>
        </Grid>

      </Grid>
    </Box>
  );
}

export default EmployeeRepairProgress;
