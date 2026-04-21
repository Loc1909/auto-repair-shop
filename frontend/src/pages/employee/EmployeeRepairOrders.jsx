import { useState, useEffect } from "react";
import {
  Typography, Box, Grid, CircularProgress,
  Button, Chip, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Autocomplete,
  Card, CardContent, Divider, Paper
} from "@mui/material";
import { AddCircle, CheckCircle, ArrowForward, Build, AirportShuttle, LocalOffer } from "@mui/icons-material";
import axiosClient from "../../api/axiosClient";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

const MOCK_EMPLOYEE_ID = 2; // TODO: Lấy từ Context/Auth

function EmployeeRepairOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Dialog Tiếp nhận xe
  const [receiveOpen, setReceiveOpen] = useState(false);
  const [confirmedAppointments, setConfirmedAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [receiveNotes, setReceiveNotes] = useState("");

  // Dialog Hoàn thành
  const [completeOpen, setCompleteOpen] = useState(false);
  const [completeId, setCompleteId] = useState(null);
  const [completeNotes, setCompleteNotes] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axiosClient.get(`/repair-orders/employee/${MOCK_EMPLOYEE_ID}`);
      setOrders(response.data);
    } catch (error) {
      console.error("Lỗi khi tải phiếu sửa chữa", error);
    } finally {
      setLoading(false);
    }
  };

  const openReceiveDialog = async () => {
    try {
      const response = await axiosClient.get("/appointments");
      const confirmed = response.data.filter((apt) => apt.status === "CONFIRMED");
      setConfirmedAppointments(confirmed);
    } catch (error) {
      console.error("Lỗi khi tải danh sách lịch hẹn", error);
    }
    setSelectedAppointment(null);
    setReceiveNotes("");
    setReceiveOpen(true);
  };

  const handleReceiveVehicle = async () => {
    if (!selectedAppointment) {
      alert("Vui lòng chọn lịch hẹn");
      return;
    }
    try {
      await axiosClient.post("/repair-orders/receive", {
        appointmentId: selectedAppointment.id,
        employeeId: MOCK_EMPLOYEE_ID,
        notes: receiveNotes
      });
      setReceiveOpen(false);
      setSelectedAppointment(null);
      setReceiveNotes("");
      fetchOrders();
    } catch (error) {
      console.error("Lỗi khi tiếp nhận xe", error);
      alert("Tiếp nhận xe thất bại!");
    }
  };

  const openCompleteDialog = (id) => {
    setCompleteId(id);
    setCompleteNotes("");
    setCompleteOpen(true);
  };

  const handleCompleteOrder = async () => {
    try {
      await axiosClient.put(`/repair-orders/${completeId}/complete`, {
        notes: completeNotes
      });
      setCompleteOpen(false);
      fetchOrders();
    } catch (error) {
      console.error("Lỗi khi hoàn thành phiếu", error);
      alert("Hoàn thành thất bại!");
    }
  };

  if (loading) {
    return <CircularProgress sx={{ display: "block", mx: "auto", mt: 4 }} />;
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING": return { color: "warning", label: "Chờ xử lý" };
      case "DIAGNOSING": return { color: "secondary", label: "Đang chẩn đoán" };
      case "QUOTING": return { color: "info", label: "Đang làm báo giá" };
      case "APPROVED": return { color: "primary", label: "Khách đã duyệt" };
      case "REPAIRING": return { color: "success", label: "Đang sửa chữa" };
      case "COMPLETED": return { color: "success", label: "Hoàn thành" };
      case "CANCELLED": return { color: "error", label: "Đã hủy" };
      default: return { color: "default", label: status };
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4} flexWrap="wrap" gap={2}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: "bold", color: "#1e1e2d" }}>
            Phiếu sửa chữa & Bảo dưỡng
          </Typography>
          <Typography variant="body1" sx={{ color: "#6e6e7c", mt: 1 }}>
            Quản lý các xe đang nằm xưởng và theo dõi tiến độ sửa chữa.
          </Typography>
        </Box>
        <Button 
          variant="contained" 
          color="primary" 
          size="large"
          startIcon={<AddCircle />}
          onClick={openReceiveDialog}
          sx={{ borderRadius: 2, px: 3, py: 1.5, fontWeight: "bold", boxShadow: "0 4px 12px rgba(25, 118, 210, 0.2)" }}
        >
          Tiếp nhận xe mới
        </Button>
      </Box>

      <Grid container spacing={4}>
        {orders.map((order) => {
          const statusInfo = getStatusColor(order.status);
          return (
            <Grid item xs={12} sm={6} md={4} xl={3} key={order.id}>
              <Card sx={{ 
                borderRadius: 4, 
                boxShadow: "0 8px 16px rgba(0,0,0,0.03)",
                transition: "transform 0.2s, box-shadow 0.2s",
                "&:hover": { transform: "translateY(-4px)", boxShadow: "0 12px 24px rgba(0,0,0,0.06)" },
                border: "1px solid rgba(0,0,0,0.05)"
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Build color="primary" />
                      <Typography variant="h6" fontWeight="bold">
                        #{order.id}
                      </Typography>
                    </Box>
                    <Chip 
                      label={statusInfo.label} 
                      color={statusInfo.color} 
                      size="small" 
                      sx={{ fontWeight: "bold" }}
                    />
                  </Box>

                  <Box display="flex" flexDirection="column" gap={1.5} mb={2}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <AirportShuttle fontSize="small" sx={{ color: "#888" }} />
                      <Typography variant="body2" color="textSecondary">
                        Xe: <strong>{order.vehicleLicensePlate || "Không rõ biển số"}</strong>
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={1}>
                      <LocalOffer fontSize="small" sx={{ color: "#888" }} />
                      <Typography variant="body2" color="textSecondary">
                        Ngày tạo: <strong>{order.createdDate ? dayjs(order.createdDate).format("DD/MM/YYYY HH:mm") : "N/A"}</strong>
                      </Typography>
                    </Box>
                  </Box>

                  {order.notes && (
                    <Box sx={{ bgcolor: "#f8f9fa", p: 1.5, borderRadius: 2, mb: 2 }}>
                      <Typography variant="body2" color="textSecondary" sx={{ fontStyle: "italic", fontSize: "0.85rem" }}>
                        "{order.notes}"
                      </Typography>
                    </Box>
                  )}

                  <Divider sx={{ my: 2 }} />

                  <Box display="flex" gap={1} flexWrap="wrap">
                    <Button
                      variant="outlined"
                      color="primary"
                      size="small"
                      endIcon={<ArrowForward />}
                      onClick={() => navigate(`/employee/repair-orders/${order.id}`)}
                      sx={{ borderRadius: 2, flexGrow: 1 }}
                    >
                      Chi tiết & Tiến độ
                    </Button>

                    {order.status !== "COMPLETED" && order.status !== "CANCELLED" && (
                      <Button
                        variant="contained"
                        color="success"
                        size="small"
                        startIcon={<CheckCircle />}
                        onClick={() => openCompleteDialog(order.id)}
                        sx={{ borderRadius: 2, flexGrow: 1 }}
                      >
                        Hoàn thành
                      </Button>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {orders.length === 0 && (
        <Paper sx={{ p: 6, textAlign: "center", borderRadius: 4, bgcolor: "#f8f9fa", mt: 2, border: "1px dashed #ccc" }}>
          <Typography variant="h6" color="textSecondary" gutterBottom>
            Danh sách trống
          </Typography>
          <Typography color="textSecondary">
            Chưa có phiếu sửa chữa nào được phân công cho bạn.
          </Typography>
        </Paper>
      )}

      {/* Dialog Tiếp nhận xe */}
      <Dialog 
        open={receiveOpen} 
        onClose={() => setReceiveOpen(false)} 
        fullWidth maxWidth="sm"
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ fontWeight: "bold", pb: 1 }}>
          Tiếp nhận xe (Tạo phiếu sửa chữa)
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ pt: 3 }}>
          <Autocomplete
            options={confirmedAppointments}
            getOptionLabel={(apt) =>
              `Lịch #${apt.id} - Xe: ${apt.licensePlate || "N/A"} - Khách: ${apt.customerName || "N/A"}`
            }
            isOptionEqualToValue={(option, value) => option.id === value.id}
            value={selectedAppointment}
            onChange={(_, newValue) => setSelectedAppointment(newValue)}
            noOptionsText="Không có lịch hẹn nào đã xác nhận"
            renderInput={(params) => (
              <TextField
                {...params}
                label="Chọn lịch hẹn đã xác nhận"
                placeholder="Gõ để tìm kiếm..."
                variant="outlined"
              />
            )}
            sx={{ mb: 3 }}
          />
          <TextField
            label="Ghi chú nhận xe (tuỳ chọn)"
            type="text"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            value={receiveNotes}
            onChange={(e) => setReceiveNotes(e.target.value)}
            placeholder="Ghi chú về ngoại thất, nội thất xe lúc nhận..."
          />
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button onClick={() => setReceiveOpen(false)} color="inherit">Hủy bỏ</Button>
          <Button onClick={handleReceiveVehicle} color="primary" variant="contained" sx={{ borderRadius: 2 }}>
            Xác nhận tiếp nhận
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog Hoàn thành */}
      <Dialog 
        open={completeOpen} 
        onClose={() => setCompleteOpen(false)} 
        fullWidth maxWidth="xs"
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ fontWeight: "bold", color: "#2e7d32", pb: 1 }}>
          Xác nhận Hoàn thành
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ pt: 3 }}>
          <TextField
            autoFocus
            label="Ghi chú hoàn thành"
            type="text"
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            value={completeNotes}
            onChange={(e) => setCompleteNotes(e.target.value)}
            placeholder="Nhập lưu ý cho khách nếu có..."
          />
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button onClick={() => setCompleteOpen(false)} color="inherit">Trở lại</Button>
          <Button onClick={handleCompleteOrder} color="success" variant="contained" sx={{ borderRadius: 2 }}>
            Hoàn tất giao xe
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default EmployeeRepairOrders;
