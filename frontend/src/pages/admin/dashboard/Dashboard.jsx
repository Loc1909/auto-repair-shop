import { useEffect, useState } from "react";
import axiosClient from "../../../api/axiosClient";
import { Grid, Typography, Box } from "@mui/material";
import {
  Build, Warning, MiscellaneousServices,
  People, AttachMoney, Person, Category
} from "@mui/icons-material";

import StatCard from "./StatCard";

function Dashboard() {
  const [data, setData] = useState({});

  useEffect(() => {
    axiosClient.get("/admin/dashboard")
      .then(res => setData(res.data))
      .catch(console.error);
  }, []);

  const formatMoney = (value) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND"
    }).format(value || 0);

  const stats = [
    { label: "Tổng số phụ tùng", value: data.totalParts, color: "#3f51b5", icon: <Build fontSize="large" /> },
    { label: "Phụ tùng sắp hết", value: data.lowStockParts, color: "#f50057", icon: <Warning fontSize="large" /> },
    { label: "Dịch vụ", value: data.totalServices, color: "#009688", icon: <MiscellaneousServices fontSize="large" /> },
    { label: "Nhân viên", value: data.totalEmployees, color: "#ff9800", icon: <People fontSize="large" /> },
    { label: "Người dùng", value: data.totalUsers, color: "#673ab7", icon: <Person fontSize="large" /> },
    { label: "Khách hàng", value: data.totalCustomers, color: "#2196f3", icon: <People fontSize="large" /> },
    { label: "Danh mục", value: data.totalCategories, color: "#795548", icon: <Category fontSize="large" /> },
    { label: "Doanh thu", value: formatMoney(data.totalRevenue), color: "#4caf50", icon: <AttachMoney fontSize="large" /> }
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold", color: "#3f51b5" }}>
        Bảng điều khiển
      </Typography>

      <Grid container spacing={3}>
        {stats.map((s) => (
          <Grid key={s.label} size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard {...s} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default Dashboard;