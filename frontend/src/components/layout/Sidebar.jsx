import { Link, useLocation } from "react-router-dom";
import {
  Box, List, ListItem, ListItemButton,
  ListItemText, Typography, ListItemIcon
} from "@mui/material";



import {
  Dashboard,
  MiscellaneousServices,
  Build,
  People,
  Engineering,
  Person,
  Category,
  AttachMoney,
  Notifications
} from "@mui/icons-material";

const menuItems = [
  { label: "Bảng điều khiển", path: "/admin", icon: <Dashboard /> },
  { label: "Dịch vụ", path: "/admin/services", icon: <MiscellaneousServices /> },
  { label: "Phụ tùng", path: "/admin/parts", icon: <Build /> },
  { label: "Người dùng", path: "/admin/users", icon: <People /> },
  { label: "Nhân viên", path: "/admin/employees", icon: <Engineering /> },
  { label: "Khách hàng", path: "/admin/customers", icon: <Person /> },
  { label: "Danh mục dịch vụ", path: "/admin/service-categories", icon: <Category /> },
  { label: "Doanh thu", path: "/admin/revenue", icon: <AttachMoney /> },
  { label: "Cấu hình thông báo", path: "/admin/notification-config", icon: <Notifications /> }
];

function Sidebar() {
  const location = useLocation();

  return (
    <Box
      sx={{
        width: 270,
        flexShrink: 0,
        bgcolor: "#fff",
        borderRight: "1px solid #e0e0e0",
        minHeight: "100vh",
        color: "#3f51b5",
        px: 2,
        py: 3,
        boxShadow: "2px 0 10px rgba(0,0,0,0.05)"
      }}
    >
      <Typography
        variant="h5"
        sx={{
          mb: 4,
          fontWeight: "bold",
          color: "#3f51b5",
          textAlign: "center"
        }}
      >
        Admin Panel
      </Typography>

      <List>
        {menuItems.map((item) => {
          const isActive =
            location.pathname === item.path ||
            (item.path !== "/admin" && location.pathname.startsWith(item.path));

          return (
            <ListItem key={item.path} disablePadding>
              <ListItemButton
                component={Link}
                to={item.path}
                selected={isActive}
                sx={{
                  borderRadius: 2,
                  mb: 1,
                  transition: "0.2s",
                  "&:hover": {
                    bgcolor: "#f0f2ff",
                  },
                  "&.Mui-selected": {
                    bgcolor: "#3f51b5",
                    color: "#fff",
                    fontWeight: "bold",
                    "& .MuiListItemIcon-root": {
                      color: "#fff"
                    }
                  },
                }}
              >
                {/* ICON */}
                <ListItemIcon
                  sx={{
                    color: isActive ? "#fff" : "#3f51b5",
                    minWidth: 35
                  }}
                >
                  {item.icon}
                </ListItemIcon>

                {/* TEXT */}
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
}

export default Sidebar;