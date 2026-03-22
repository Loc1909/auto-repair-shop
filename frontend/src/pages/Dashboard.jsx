import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import {
  Grid, Paper, Typography, Box
} from "@mui/material";
import {
  Build, Warning, MiscellaneousServices,
  People, AttachMoney, Person, Category
} from "@mui/icons-material";

function Dashboard() {
  const [data, setData] = useState({});

  useEffect(() => {
    axiosClient.get("/admin/dashboard")
      .then(res => setData(res.data))
      .catch(err => console.error(err));
  }, []);

  const formatMoney = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND"
    }).format(value || 0);
  };

  const stats = [
    {
      label: "Total Parts",
      value: data.totalParts,
      color: "#3f51b5",
      icon: <Build fontSize="large" />
    },
    {
      label: "Low Stock",
      value: data.lowStockParts,
      color: "#f50057",
      icon: <Warning fontSize="large" />
    },
    {
      label: "Services",
      value: data.totalServices,
      color: "#009688",
      icon: <MiscellaneousServices fontSize="large" />
    },
    {
      label: "Employees",
      value: data.totalEmployees,
      color: "#ff9800",
      icon: <People fontSize="large" />
    },
    {
      label: "Users",
      value: data.totalUsers,
      color: "#673ab7",
      icon: <Person fontSize="large" />
    },
    {
      label: "Customers",
      value: data.totalCustomers,
      color: "#2196f3",
      icon: <People fontSize="large" />
    },
    {
      label: "Categories",
      value: data.totalCategories,
      color: "#795548",
      icon: <Category fontSize="large" />
    },
    {
      label: "Revenue",
      value: formatMoney(data.totalRevenue),
      color: "#4caf50",
      icon: <AttachMoney fontSize="large" />
    }
  ];

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold" }}>
        Dashboard
      </Typography>

      <Grid container spacing={3}>
        {stats.map((s) => (
          <Grid item xs={12} sm={6} md={3} key={s.label}>
            <Paper
              elevation={4}
              sx={{
                padding: 3,
                borderRadius: 3,
                position: "relative",
                overflow: "hidden",
                transition: "0.3s",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: 8
                }
              }}
            >
              {/* Icon góc */}
              <Box
                sx={{
                  position: "absolute",
                  top: 10,
                  right: 10,
                  color: s.color,
                  opacity: 0.2
                }}
              >
                {s.icon}
              </Box>

              <Typography variant="subtitle2" color="textSecondary">
                {s.label}
              </Typography>

              <Typography
                variant="h4"
                sx={{
                  fontWeight: "bold",
                  color: s.color,
                  mt: 1
                }}
              >
                {s.value || 0}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default Dashboard;