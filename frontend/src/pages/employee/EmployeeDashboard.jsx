import { useState, useEffect } from "react";
import { Typography, Box, Paper, Grid, CircularProgress } from "@mui/material";
import axiosClient from "../../api/axiosClient";

const MOCK_EMPLOYEE_ID = 14; // TODO: Lấy từ Context/Auth khi có chức năng Login

function EmployeeDashboard() {
  const [scheduleData, setScheduleData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await axiosClient.get(`/staff/${MOCK_EMPLOYEE_ID}/schedule`);
      setScheduleData(response.data);
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu bảng điều khiển", error);
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
        Xin chào, {scheduleData?.employeeName || "Nhân viên"}
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} sm={4}>
          <Paper sx={{ p: 3, textAlign: "center", borderRadius: 2, boxShadow: 3 }}>
            <Typography variant="h6" color="textSecondary">Lịch hẹn được giao hôm nay</Typography>
            <Typography variant="h3" color="primary" sx={{ mt: 1, fontWeight: 'bold' }}>
              {scheduleData?.appointments?.length || 0}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper sx={{ p: 3, textAlign: "center", borderRadius: 2, boxShadow: 3 }}>
            <Typography variant="h6" color="textSecondary">Phiếu sửa chữa đang làm</Typography>
            <Typography variant="h3" color="secondary" sx={{ mt: 1, fontWeight: 'bold' }}>
              {scheduleData?.activeOrders?.length || 0}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default EmployeeDashboard;
