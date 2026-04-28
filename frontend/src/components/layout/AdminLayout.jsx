// AdminLayout.jsx
import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  Divider,
  IconButton,
} from "@mui/material";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import HomeIcon from "@mui/icons-material/Home";
import LogoutIcon from "@mui/icons-material/Logout";

function AdminLayout() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleHome = () => {
    handleMenuClose();
    navigate("/");
  };

  const handleLogout = () => {
    handleMenuClose();
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
      {/* Header */}
      <AppBar
        position="fixed"
        sx={{
          width: "100%",
          backgroundColor: "#ffffff",
          color: "#1e1e2d",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          zIndex: 100,
        }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between", px: 3 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              fontSize: "1.2rem",
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <AdminPanelSettingsIcon sx={{ color: "#3f51b5" }} />
            Trang Quản Lý
          </Typography>

          {/* Admin Info Dropdown */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <IconButton
              onClick={handleMenuOpen}
              size="small"
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                padding: "6px 12px",
                borderRadius: 2,
                backgroundColor: "rgba(63, 81, 181, 0.05)",
                border: "1px solid rgba(63, 81, 181, 0.2)",
                transition: "all 0.2s",
                "&:hover": {
                  backgroundColor: "rgba(63, 81, 181, 0.1)",
                },
              }}
            >
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  backgroundColor: "#3f51b5",
                  fontSize: "0.9rem",
                  fontWeight: 600,
                }}
              >
                {user?.username?.charAt(0)?.toUpperCase() ?? "A"}
              </Avatar>
              <Box sx={{ textAlign: "left", display: "flex", flexDirection: "column" }}>
                <Typography sx={{ fontSize: "0.85rem", fontWeight: 600, color: "#1e1e2d" }}>
                  {user?.username ?? "Admin"}
                </Typography>
                <Typography sx={{ fontSize: "0.75rem", color: "#999", fontWeight: 500 }}>
                  Admin
                </Typography>
              </Box>
            </IconButton>
          </Box>

          {/* Dropdown Menu */}
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleMenuClose}
            PaperProps={{
              sx: {
                backgroundColor: "#ffffff",
                boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
                borderRadius: 2,
                mt: 1,
              },
            }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            <MenuItem
              onClick={handleHome}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                fontSize: "0.9rem",
                color: "#1e1e2d",
                "&:hover": {
                  backgroundColor: "rgba(63, 81, 181, 0.1)",
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 32 }}>
                <HomeIcon sx={{ fontSize: "1.2rem", color: "#3f51b5" }} />
              </ListItemIcon>
              Trang Chủ
            </MenuItem>

            <Divider sx={{ my: 0.5 }} />

            <MenuItem
              onClick={handleLogout}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                fontSize: "0.9rem",
                color: "#d32f2f",
                "&:hover": {
                  backgroundColor: "rgba(211, 47, 47, 0.1)",
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 32 }}>
                <LogoutIcon sx={{ fontSize: "1.2rem", color: "#d32f2f" }} />
              </ListItemIcon>
              Đăng Xuất
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Sidebar />

      {/* Nội dung chính */}
      <Box sx={{ flexGrow: 1, p: 3, mt: 8 }}>
        <Outlet />
      </Box>
    </Box>
  );
}

export default AdminLayout;