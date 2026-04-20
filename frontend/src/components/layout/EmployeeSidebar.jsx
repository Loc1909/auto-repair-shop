import { Link, useLocation } from "react-router-dom";
import {
  Box, List, ListItem, ListItemButton,
  ListItemText, Typography, ListItemIcon
} from "@mui/material";

import {
  Dashboard,
  EventNote,
  AssignmentTurnedIn,
  Build
} from "@mui/icons-material";

const menuItems = [
  { label: "Bảng điều khiển", path: "/employee", icon: <Dashboard /> },
  { label: "Lịch làm việc", path: "/employee/schedule", icon: <EventNote /> },
  { label: "Lịch hẹn", path: "/employee/appointments", icon: <AssignmentTurnedIn /> },
  { label: "Phiếu sửa chữa", path: "/employee/repair-orders", icon: <Build /> }
];

function EmployeeSidebar() {
  const location = useLocation();

  return (
    <Box
      sx={{
        width: 240,
        bgcolor: "#fff",
        borderRight: "1px solid #e0e0e0",
        minHeight: "100vh",
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
          color: "#4caf50",
          textAlign: "center"
        }}
      >
        Nhân viên
      </Typography>

      <List>
        {menuItems.map((item) => {
          const isActive =
            location.pathname === item.path ||
            (item.path !== "/employee" && location.pathname.startsWith(item.path));

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
                    bgcolor: "#e8f5e9",
                  },
                  "&.Mui-selected": {
                    bgcolor: "#4caf50",
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
                    color: isActive ? "#fff" : "#4caf50",
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

export default EmployeeSidebar;
