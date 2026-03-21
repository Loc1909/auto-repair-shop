import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import { Grid, Paper, Typography, Box } from "@mui/material";

function Dashboard() {
  const [data, setData] = useState({});

  useEffect(() => {
    axiosClient.get("/admin/dashboard")
      .then(res => setData(res.data))
      .catch(err => console.error(err));
  }, []);

  const stats = [
    { label: "Total Parts", value: data.totalParts, color: "#3f51b5" },
    { label: "Low Stock Parts", value: data.lowStockParts, color: "#f50057" },
    { label: "Total Services", value: data.totalServices, color: "#009688" },
    { label: "Total Employees", value: data.totalEmployees, color: "#ff9800" },
    { label: "Total Revenue", value: `$${data.totalRevenue?.toLocaleString() || 0}`, color: "#4caf50" },
  ];

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Dashboard
      </Typography>

      <Grid container spacing={3}>
        {stats.map((s) => (
          <Grid item xs={12} sm={6} md={4} key={s.label}>
            <Paper
              elevation={3}
              sx={{
                padding: 2,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                borderTop: `5px solid ${s.color}`,
              }}
            >
              <Typography variant="h6" sx={{ mb: 1 }}>
                {s.label}
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: "bold", color: s.color }}>
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