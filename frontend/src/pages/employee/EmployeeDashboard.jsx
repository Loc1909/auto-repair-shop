import { useState, useEffect } from "react";
import { Typography, Box, Grid, CircularProgress, Card, CardContent } from "@mui/material";
import { CalendarTodayRounded, HandymanRounded } from "@mui/icons-material";
import axiosClient from "../../api/axiosClient";

function EmployeeDashboard() {
  const [scheduleData, setScheduleData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const employeeId = user?.employeeId;

    if (!employeeId) {
      console.error("Không tìm thấy Employee ID");
      setLoading(false);
      return;
    }

    try {
      const response = await axiosClient.get(`/staff/${employeeId}/schedule`);
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
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: "bold", color: "#1e1e2d" }}>
          Xin chào, {scheduleData?.employeeName || "Kỹ thuật viên"} 👋
        </Typography>
        <Typography variant="body1" sx={{ color: "#6e6e7c", mt: 1 }}>
          Chào mừng quay trở lại. Hãy cùng xem công việc hôm nay của bạn.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <Card
            sx={{
              borderRadius: 4,
              background: "linear-gradient(135deg, #1e88e5 0%, #1565c0 100%)",
              color: "#fff",
              position: "relative",
              overflow: "hidden",
              boxShadow: "0 10px 20px rgba(21, 101, 192, 0.2)"
            }}
          >
            <Box sx={{ position: "absolute", top: -20, right: -20, opacity: 0.2 }}>
              <CalendarTodayRounded sx={{ fontSize: 120 }} />
            </Box>
            <CardContent sx={{ position: "relative", zIndex: 1, p: 3 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, opacity: 0.9 }}>
                Lịch hẹn hôm nay
              </Typography>
              <Typography variant="h2" sx={{ fontWeight: "bold", mt: 1 }}>
                {scheduleData?.appointments?.length || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card
            sx={{
              borderRadius: 4,
              background: "linear-gradient(135deg, #43a047 0%, #2e7d32 100%)",
              color: "#fff",
              position: "relative",
              overflow: "hidden",
              boxShadow: "0 10px 20px rgba(46, 125, 50, 0.2)"
            }}
          >
            <Box sx={{ position: "absolute", top: -20, right: -20, opacity: 0.2 }}>
              <HandymanRounded sx={{ fontSize: 120 }} />
            </Box>
            <CardContent sx={{ position: "relative", zIndex: 1, p: 3 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, opacity: 0.9 }}>
                Phiếu sửa chữa đang làm
              </Typography>
              <Typography variant="h2" sx={{ fontWeight: "bold", mt: 1 }}>
                {scheduleData?.activeOrders?.length || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default EmployeeDashboard;
