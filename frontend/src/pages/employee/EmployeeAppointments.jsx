import { useState, useEffect } from "react";
import { 
  Typography, Box, Paper, Grid, CircularProgress, 
  Button, Chip, Dialog, DialogTitle, DialogContent, 
  DialogActions, TextField 
} from "@mui/material";
import axiosClient from "../../api/axiosClient";
import dayjs from "dayjs";

const MOCK_EMPLOYEE_ID = 2; // TODO: Lấy từ Context/Auth

function EmployeeAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [cancelOpen, setCancelOpen] = useState(false);
  const [cancelId, setCancelId] = useState(null);
  const [cancelReason, setCancelReason] = useState("");

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await axiosClient.get("/appointments");
      setAppointments(response.data);
    } catch (error) {
      console.error("Lỗi khi tải lịch hẹn", error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (id) => {
    try {
      await axiosClient.patch(`/appointments/${id}/confirm?employeeId=${MOCK_EMPLOYEE_ID}`);
      fetchAppointments();
    } catch (error) {
      console.error("Lỗi khi xác nhận lịch hẹn", error);
      alert("Xác nhận thất bại!");
    }
  };

  const openCancelDialog = (id) => {
    setCancelId(id);
    setCancelReason("");
    setCancelOpen(true);
  };

  const handleCancelClick = async () => {
    try {
      await axiosClient.patch(`/appointments/${cancelId}/cancel`, {
        reason: cancelReason,
      });
      setCancelOpen(false);
      fetchAppointments();
    } catch (error) {
      console.error("Lỗi khi hủy lịch hẹn", error);
      alert("Hủy thất bại!");
    }
  };

  if (loading) {
    return <CircularProgress sx={{ display: "block", mx: "auto", mt: 4 }} />;
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING": return "warning";
      case "CONFIRMED": return "success";
      case "CANCELLED": return "error";
      case "RECEIVED": return "info";
      default: return "default";
    }
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold" }}>
        Quản lý Lịch hẹn
      </Typography>

      <Grid container spacing={3}>
        {appointments.map((apt) => (
          <Grid item xs={12} sm={6} md={4} key={apt.id}>
            <Paper sx={{ p: 2, borderRadius: 2, boxShadow: 3 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography variant="h6" fontWeight="bold">
                  {apt?.licensePlate || "Không rõ xe"}
                </Typography>
                <Chip label={apt.status} color={getStatusColor(apt.status)} size="small" />
              </Box>
              
              <Typography variant="body2" color="textSecondary" gutterBottom>
                <strong>Khách hàng:</strong> {apt.customer?.name || apt.customerName || "Không rõ"}
              </Typography>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                <strong>Thời gian:</strong> {apt.appointmentTime ? dayjs(apt.appointmentTime).format("DD/MM/YYYY HH:mm") : "N/A"}
              </Typography>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                <strong>Ghi chú:</strong> {apt.note || "Không có"}
              </Typography>

              <Box mt={2} display="flex" gap={1}>
                {apt.status === "PENDING" && (
                  <Button 
                    variant="contained" 
                    color="success" 
                    size="small"
                    onClick={() => handleConfirm(apt.id)}
                  >
                    Xác nhận
                  </Button>
                )}
                
                {(apt.status === "PENDING" || apt.status === "CONFIRMED") && (
                  <Button 
                    variant="outlined" 
                    color="error" 
                    size="small"
                    onClick={() => openCancelDialog(apt.id)}
                  >
                    Hủy
                  </Button>
                )}
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
      
      {appointments.length === 0 && (
        <Typography color="textSecondary" sx={{ mt: 2 }}>
          Không có lịch hẹn nào tồn tại.
        </Typography>
      )}

      {/* Dialog Hủy Lịch */}
      <Dialog open={cancelOpen} onClose={() => setCancelOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Lý do hủy lịch hẹn</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Lý do"
            type="text"
            fullWidth
            variant="outlined"
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelOpen(false)}>Hủy bỏ</Button>
          <Button onClick={handleCancelClick} color="error" variant="contained">
            Đồng ý hủy
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default EmployeeAppointments;
