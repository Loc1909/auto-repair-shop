import { useState, useEffect } from "react";
import {
  Typography, Box, Grid, CircularProgress,
  Button, Chip, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Card, CardContent, Divider, Paper
} from "@mui/material";
import { DirectionsCar, Person, AccessTime, EventAvailable, Cancel } from "@mui/icons-material";
import { useEmployeeAppointments } from "../../hooks/useEmployeeAppointments";
import { getAppointmentStatusMeta } from "../../constants/employeeStatus";
import dayjs from "dayjs";


function EmployeeAppointments() {
  const {
    appointments,
    loading,
    cancelOpen,
    cancelReason,
    setCancelOpen,
    setCancelReason,
    handleConfirm,
    openCancelDialog,
    handleCancelClick
  } = useEmployeeAppointments();

  if (loading) {
    return <CircularProgress sx={{ display: "block", mx: "auto", mt: 4 }} />;
  }

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: "bold", color: "#1e1e2d" }}>
          Quản lý Lịch hẹn
        </Typography>
        <Typography variant="body1" sx={{ color: "#6e6e7c", mt: 1 }}>
          Xem và cập nhật trạng thái các lịch hẹn của khách hàng.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {appointments.map((apt) => {
          const statusInfo = getAppointmentStatusMeta(apt.status);
          return (
            <Grid item xs={12} sm={6} md={4} key={apt.id}>
              <Card sx={{
                borderRadius: 3,
                boxShadow: "0 8px 16px rgba(0,0,0,0.03)",
                transition: "transform 0.2s",
                "&:hover": { transform: "translateY(-4px)", boxShadow: "0 12px 24px rgba(0,0,0,0.06)" }
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <DirectionsCar color="primary" />
                      <Typography variant="h6" fontWeight="bold">
                        {apt?.licensePlate || "Không rõ xe"}
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
                      <Person fontSize="small" sx={{ color: "#888" }} />
                      <Typography variant="body2" color="textSecondary">
                        Khách hàng: <strong>{apt.customer?.name || apt.customerName || "Không rõ"}</strong>
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={1}>
                      <AccessTime fontSize="small" sx={{ color: "#888" }} />
                      <Typography variant="body2" color="textSecondary">
                        Thời gian: <strong>{apt.appointmentTime ? dayjs(apt.appointmentTime).format("DD/MM/YYYY HH:mm") : "N/A"}</strong>
                      </Typography>
                    </Box>
                  </Box>

                  {apt.note && (
                    <Box sx={{ bgcolor: "#f8f9fa", p: 1.5, borderRadius: 2, mb: 2 }}>
                      <Typography variant="body2" color="textSecondary">
                        <em>"{apt.note}"</em>
                      </Typography>
                    </Box>
                  )}

                  <Divider sx={{ my: 2 }} />

                  <Box display="flex" gap={1} justifyContent="flex-end">
                    {apt.status === "PENDING" && (
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        startIcon={<EventAvailable />}
                        onClick={() => handleConfirm(apt.id)}
                        sx={{ borderRadius: 2 }}
                      >
                        Xác nhận
                      </Button>
                    )}

                    {(apt.status === "PENDING" || apt.status === "CONFIRMED") && (
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        startIcon={<Cancel />}
                        onClick={() => openCancelDialog(apt.id)}
                        sx={{ borderRadius: 2 }}
                      >
                        Hủy lịch
                      </Button>
                    )}

                    {apt.status !== "PENDING" && apt.status !== "CONFIRMED" && (
                      <Typography variant="caption" color="textSecondary" sx={{ py: 0.5 }}>
                        Không có hành động
                      </Typography>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {appointments.length === 0 && (
        <Paper sx={{ p: 4, textAlign: "center", borderRadius: 3, bgcolor: "#f8f9fa", mt: 2 }}>
          <Typography color="textSecondary">
            Không có lịch hẹn nào tồn tại trong hệ thống.
          </Typography>
        </Paper>
      )}

      {/* Dialog Hủy Lịch */}
      <Dialog
        open={cancelOpen}
        onClose={() => setCancelOpen(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ fontWeight: "bold" }}>Lý do hủy lịch hẹn</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Lý do hủy"
            type="text"
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button onClick={() => setCancelOpen(false)} color="inherit">Trở lại</Button>
          <Button onClick={handleCancelClick} color="error" variant="contained" sx={{ borderRadius: 2 }}>
            Xác nhận hủy
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default EmployeeAppointments;
