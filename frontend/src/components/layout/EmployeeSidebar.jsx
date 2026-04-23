import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Box, List, ListItem, ListItemButton,
  ListItemText, Typography, ListItemIcon,
  Drawer, Avatar, Divider
} from "@mui/material";

import {
  DashboardRounded,
  EventNoteRounded,
  AssignmentTurnedInRounded,
  BuildRounded,
  AccountCircle,
  ExitToApp
} from "@mui/icons-material";

const menuItems = [
  { label: "Bảng điều khiển", path: "/employee", icon: <DashboardRounded /> },
  { label: "Lịch làm việc", path: "/employee/schedule", icon: <EventNoteRounded /> },
  { label: "Lịch hẹn", path: "/employee/appointments", icon: <AssignmentTurnedInRounded /> },
  { label: "Phiếu sửa chữa", path: "/employee/repair-orders", icon: <BuildRounded /> }
];

const drawerWidth = 280;

function EmployeeSidebar({ mobileOpen, handleDrawerToggle, isMobile }) {
  const location = useLocation();
  const navigate = useNavigate();

  const drawerContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', bgcolor: '#1e1e2d', color: '#fff' }}>
      {/* Logo & Tiêu đề */}
      <Box sx={{ p: 4, textAlign: "center", mt: isMobile ? 2 : 0 }}>
        <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: 1, color: "#fff" }}>
          AUTO SHOP
        </Typography>
        <Typography variant="subtitle2" sx={{ color: "#a2a3b7", mt: 0.5 }}>
          Khu vực kỹ thuật viên
        </Typography>
      </Box>

      <Divider sx={{ borderColor: "rgba(255,255,255,0.08)", mb: 2, mx: 2 }} />

      {/* Menu chính */}
      <List sx={{ px: 2, flexGrow: 1 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path || (item.path !== "/employee" && location.pathname.startsWith(item.path));

          return (
            <ListItem key={item.path} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                component={Link}
                to={item.path}
                onClick={isMobile ? handleDrawerToggle : undefined}
                sx={{
                  borderRadius: 2,
                  py: 1.5,
                  transition: "all 0.3s ease",
                  ...(isActive ? {
                    bgcolor: "rgba(255, 255, 255, 0.1)",
                    color: "#fff",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  } : {
                    color: "#a2a3b7",
                    "&:hover": {
                      bgcolor: "rgba(255, 255, 255, 0.05)",
                      color: "#fff",
                    }
                  })
                }}
              >
                <ListItemIcon sx={{ minWidth: 40, color: isActive ? "#4caf50" : "#a2a3b7", transition: "color 0.3s" }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontWeight: isActive ? 600 : 500,
                    fontSize: '0.95rem'
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Box sx={{ flexGrow: 1 }} />

      <List>
        <ListItem disablePadding>
          <ListItemButton 
            onClick={() => {
              localStorage.clear();
              navigate("/login");
            }}
            sx={{ 
              mx: 1, borderRadius: 2, 
              color: "#ff5252",
              '&:hover': { bgcolor: "rgba(255, 82, 82, 0.1)" } 
            }}
          >
            <ListItemIcon sx={{ color: "inherit", minWidth: 40 }}>
              <ExitToApp />
            </ListItemIcon>
            <ListItemText primary="Đăng xuất" primaryTypographyProps={{ fontWeight: 600 }} />
          </ListItemButton>
        </ListItem>
      </List>

      {/* Thông tin User */}
      <Box sx={{ p: 2, m: 2, bgcolor: "rgba(255,255,255,0.05)", borderRadius: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Avatar sx={{ bgcolor: "#4caf50", width: 44, height: 44 }}>
          <AccountCircle />
        </Avatar>
        <Box>
          <Typography variant="subtitle2" fontWeight="bold">
            {JSON.parse(localStorage.getItem("user"))?.username || "Nhân viên"}
          </Typography>
          <Typography variant="caption" sx={{ color: "#a2a3b7" }}>
            ID: #{JSON.parse(localStorage.getItem("user"))?.employeeId || "N/A"}
          </Typography>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth, borderRight: "none", bgcolor: "#1e1e2d" }
        }}
      >
        {drawerContent}
      </Drawer>
      {/* Desktop Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", md: "block" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth, borderRight: "none", bgcolor: "#1e1e2d" }
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
}

export default EmployeeSidebar;
