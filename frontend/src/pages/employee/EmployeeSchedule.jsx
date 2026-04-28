import { useState, useEffect } from "react";
import { Typography, Box, Card, CardContent, Grid, CircularProgress, List, ListItem, ListItemText, Divider, Chip, Avatar } from "@mui/material";
import { BuildCircle, EventAvailable } from "@mui/icons-material";
import { useEmployeeSchedule } from "../../hooks/useEmployeeSchedule";
import dayjs from "dayjs";

const getAptStatusColor = (status) => {
  switch (status) {
    case "PENDING": return { color: "warning", label: "Chờ xác nhận" };
    case "CONFIRMED": return { color: "success", label: "Đã xác nhận" };
    case "CANCELLED": return { color: "error", label: "Đã hủy" };
    case "RECEIVED": return { color: "info", label: "Đã tiếp nhận" };
    default: return { color: "default", label: status };
  }
};

const getRepairStatusColor = (status) => {
  switch (status) {
    case "PENDING": return { color: "warning", label: "Chờ xử lý" };
    case "DIAGNOSING": return { color: "secondary", label: "Đang chẩn đoán" };
    case "QUOTING": return { color: "info", label: "Đang báo giá" };
    case "APPROVED": return { color: "primary", label: "Khách đã duyệt" };
    case "REPAIRING": return { color: "success", label: "Đang sửa chữa" };
    case "COMPLETED": return { color: "success", label: "Hoàn thành" };
    case "CANCELLED": return { color: "error", label: "Đã hủy" };
    default: return { color: "default", label: status };
  }
};

function EmployeeSchedule() {
  const { scheduleData, loading } = useEmployeeSchedule();

  if (loading) {
    return <CircularProgress sx={{ display: "block", mx: "auto", mt: 4 }} />;
  }

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: "bold", color: "#1e1e2d" }}>
          Lịch làm việc của tôi
        </Typography>
        <Typography variant="body1" sx={{ color: "#6e6e7c", mt: 1 }}>
          Danh sách lịch hẹn và phiếu sửa chữa được phân công cho bạn.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Lịch hẹn */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 4, height: "100%", boxShadow: "0 8px 24px rgba(0,0,0,0.04)" }}>
            <CardContent sx={{ p: 3 }}>
              <Box display="flex" alignItems="center" gap={1.5} mb={2}>
                <Avatar sx={{ bgcolor: "rgba(33, 150, 243, 0.1)", color: "#1976d2" }}>
                  <EventAvailable />
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: "bold", color: "#1976d2" }}>
                  Lịch hẹn đã nhận
                </Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />

              {scheduleData?.appointments?.length === 0 ? (
                <Typography color="textSecondary" sx={{ py: 2, textAlign: "center" }}>
                  Không có lịch hẹn nào
                </Typography>
              ) : (
                <List disablePadding>
                  {scheduleData?.appointments.map((apt, index) => {
                    const st = getAptStatusColor(apt.status);
                    return (
                      <div key={apt.id}>
                        <ListItem alignItems="flex-start" sx={{ px: 0, py: 2 }}>
                          <ListItemText
                            primary={
                              <Typography variant="subtitle1" fontWeight="bold">
                                Xe: {apt.vehicleLicensePlate} - Khách: {apt.customerName}
                              </Typography>
                            }
                            secondary={`Thời gian: ${dayjs(apt.appointmentTime).format("DD/MM/YYYY HH:mm")}`}
                          />
                          <Chip
                            label={st.label}
                            color={st.color}
                            size="small"
                            sx={{ fontWeight: 600, mt: 1 }}
                          />
                        </ListItem>
                        {index < scheduleData.appointments.length - 1 && <Divider component="li" />}
                      </div>
                    );
                  })}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Phiếu sửa chữa */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 4, height: "100%", boxShadow: "0 8px 24px rgba(0,0,0,0.04)" }}>
            <CardContent sx={{ p: 3 }}>
              <Box display="flex" alignItems="center" gap={1.5} mb={2}>
                <Avatar sx={{ bgcolor: "rgba(76, 175, 80, 0.1)", color: "#2e7d32" }}>
                  <BuildCircle />
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: "bold", color: "#2e7d32" }}>
                  Phiếu sửa chữa đang làm
                </Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />

              {scheduleData?.activeOrders?.length === 0 ? (
                <Typography color="textSecondary" sx={{ py: 2, textAlign: "center" }}>
                  Không có phiếu sửa chữa nào
                </Typography>
              ) : (
                <List disablePadding>
                  {scheduleData?.activeOrders.map((order, index) => {
                    const st = getRepairStatusColor(order.status);
                    return (
                      <div key={order.id}>
                        <ListItem alignItems="flex-start" sx={{ px: 0, py: 2 }}>
                          <ListItemText
                            primary={
                              <Typography variant="subtitle1" fontWeight="bold">
                                Mã phiếu: #{order.id} - Xe: {order.vehicleLicensePlate}
                              </Typography>
                            }
                            secondary={`Ngày tạo: ${dayjs(order.createdDate).format("DD/MM/YYYY HH:mm")}`}
                          />
                          <Chip
                            label={st.label}
                            color={st.color}
                            size="small"
                            sx={{ fontWeight: 600, mt: 1 }}
                          />
                        </ListItem>
                        {index < scheduleData.activeOrders.length - 1 && <Divider component="li" />}
                      </div>
                    );
                  })}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default EmployeeSchedule;
