import { useState, useEffect } from "react";
import { 
  Typography, Box, Paper, Grid, CircularProgress, 
  List, ListItem, ListItemText, Divider, Chip 
} from "@mui/material";
import axiosClient from "../../api/axiosClient";
import dayjs from "dayjs";

const MOCK_EMPLOYEE_ID = 14; // TODO: Lấy từ Context/Auth

const getAptStatusColor = (status) => {
  switch (status) {
    case "PENDING": return "warning";
    case "CONFIRMED": return "success";
    case "CANCELLED": return "error";
    case "RECEIVED": return "info";
    default: return "default";
  }
};

const getRepairStatusColor = (status) => {
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

function EmployeeSchedule() {
  const [scheduleData, setScheduleData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSchedule();
  }, []);

  const fetchSchedule = async () => {
    try {
      const response = await axiosClient.get(`/staff/${MOCK_EMPLOYEE_ID}/schedule`);
      setScheduleData(response.data);
    } catch (error) {
      console.error("Lỗi khi tải lịch làm việc", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <CircularProgress sx={{ display: "block", mx: "auto", mt: 4 }} />;
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold" }}>
        Lịch làm việc của tôi
      </Typography>

      <Grid container spacing={3}>
        {/* Cột Lịch hẹn */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, borderRadius: 2, height: "100%", boxShadow: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, color: "#3f51b5", fontWeight: "bold" }}>
              Lịch hẹn đã nhận
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            {scheduleData?.appointments?.length === 0 ? (
              <Typography color="textSecondary">Không có lịch hẹn nào</Typography>
            ) : (
              <List>
                {scheduleData?.appointments.map((apt, index) => (
                  <div key={apt.id}>
                    <ListItem alignItems="flex-start">
                      <ListItemText
                        primary={`Xe: ${apt.vehicleLicensePlate} - Khách: ${apt.customerName}`}
                        secondary={`Thời gian: ${dayjs(apt.appointmentTime).format("DD/MM/YYYY HH:mm")}`}
                      />
                      <Chip 
                        label={apt.status} 
                        color={getAptStatusColor(apt.status)} 
                        size="small" 
                        sx={{ mt: 1 }}
                      />
                    </ListItem>
                    {index < scheduleData.appointments.length - 1 && <Divider component="li" />}
                  </div>
                ))}
              </List>
            )}
          </Paper>
        </Grid>

        {/* Cột Phiếu sửa chữa */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, borderRadius: 2, height: "100%", boxShadow: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, color: "#e91e63", fontWeight: "bold" }}>
              Phiếu sửa chữa đang làm
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            {scheduleData?.activeOrders?.length === 0 ? (
              <Typography color="textSecondary">Không có phiếu sửa chữa nào</Typography>
            ) : (
              <List>
                {scheduleData?.activeOrders.map((order, index) => (
                  <div key={order.id}>
                    <ListItem alignItems="flex-start">
                      <ListItemText
                        primary={`Mã phiếu: #${order.id} - Xe: ${order.vehicleLicensePlate}`}
                        secondary={`Ngày tạo: ${dayjs(order.createdDate).format("DD/MM/YYYY HH:mm")}`}
                      />
                      <Chip 
                        label={order.status} 
                        color={getRepairStatusColor(order.status)} 
                        size="small" 
                        sx={{ mt: 1 }}
                      />
                    </ListItem>
                    {index < scheduleData.activeOrders.length - 1 && <Divider component="li" />}
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

export default EmployeeSchedule;
