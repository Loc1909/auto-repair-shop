import { useState, useEffect } from "react";
import { 
  Typography, Box, Paper, Grid, CircularProgress, 
  Button, Chip, Dialog, DialogTitle, DialogContent, 
  DialogActions, TextField 
} from "@mui/material";
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
  const [appointmentId, setAppointmentId] = useState("");
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

  const handleReceiveVehicle = async () => {
    if (!appointmentId) {
      alert("Vui lòng nhập ID lịch hẹn");
      return;
    }
    try {
      await axiosClient.post("/repair-orders/receive", {
        appointmentId: Number(appointmentId),
        employeeId: MOCK_EMPLOYEE_ID,
        notes: receiveNotes
      });
      setReceiveOpen(false);
      setAppointmentId("");
      setReceiveNotes("");
      fetchOrders();
    } catch (error) {
      console.error("Lỗi khi tiếp nhận xe", error);
      alert("Tiếp nhận xe thất bại! Vui lòng kiểm tra ID lịch hẹn.");
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
      case "PENDING": return "warning";
      case "DIAGNOSING": return "secondary";
      case "QUOTING": return "info";
      case "APPROVED": return "primary";
      case "REPAIRING": return "success";
      case "COMPLETED": return "success";
      case "CANCELLED": return "error";
      default: return "default";
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight="bold">
          Quản lý Phiếu sửa chữa
        </Typography>
        <Button variant="contained" color="primary" onClick={() => setReceiveOpen(true)}>
          + Tiếp nhận xe
        </Button>
      </Box>

      <Grid container spacing={3}>
        {orders.map((order) => (
          <Grid item xs={12} sm={6} md={4} key={order.id}>
            <Paper sx={{ p: 2, borderRadius: 2, boxShadow: 3 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography variant="h6" fontWeight="bold">
                  Mã phiếu: #{order.id}
                </Typography>
                <Chip label={order.status} color={getStatusColor(order.status)} size="small" />
              </Box>
              
              <Typography variant="body2" color="textSecondary" gutterBottom>
                <strong>Xe:</strong> {order.vehicleLicensePlate || "Không rõ"}
              </Typography>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                <strong>Ngày tạo:</strong> {order.createdDate ? dayjs(order.createdDate).format("DD/MM/YYYY HH:mm") : "N/A"}
              </Typography>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                <strong>Ghi chú:</strong> {order.notes || "Không có"}
              </Typography>

              <Box mt={2} display="flex" gap={1} flexWrap="wrap">
                <Button 
                  variant="outlined" 
                  color="primary" 
                  size="small"
                  onClick={() => navigate(`/employee/repair-orders/${order.id}`)}
                >
                  Tiến độ & Vật tư
                </Button>

                {order.status !== "COMPLETED" && order.status !== "CANCELLED" && (
                  <Button 
                    variant="contained" 
                    color="success" 
                    size="small"
                    onClick={() => openCompleteDialog(order.id)}
                  >
                    Hoàn thành
                  </Button>
                )}
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {orders.length === 0 && (
        <Typography color="textSecondary" sx={{ mt: 2 }}>
          Không có phiếu sửa chữa nào được phân công cho bạn.
        </Typography>
      )}

      {/* Dialog Tiếp nhận xe */}
      <Dialog open={receiveOpen} onClose={() => setReceiveOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Tiếp nhận xe (Tạo phiếu sửa chữa)</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="ID Lịch hẹn (đã xác nhận)"
            type="number"
            fullWidth
            variant="outlined"
            value={appointmentId}
            onChange={(e) => setAppointmentId(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Ghi chú nhận xe (tuỳ chọn)"
            type="text"
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            value={receiveNotes}
            onChange={(e) => setReceiveNotes(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReceiveOpen(false)}>Hủy bỏ</Button>
          <Button onClick={handleReceiveVehicle} color="primary" variant="contained">
            Xác nhận tiếp nhận
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog Hoàn thành */}
      <Dialog open={completeOpen} onClose={() => setCompleteOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Hoàn thành phiếu sửa chữa</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Ghi chú hoàn thành"
            type="text"
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            value={completeNotes}
            onChange={(e) => setCompleteNotes(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCompleteOpen(false)}>Hủy bỏ</Button>
          <Button onClick={handleCompleteOrder} color="success" variant="contained">
            Đồng ý hoàn thành
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default EmployeeRepairOrders;
