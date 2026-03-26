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
  AttachMoney
} from "@mui/icons-material";

const menuItems = [
  { label: "Dashboard", path: "/admin", icon: <Dashboard /> },
  { label: "Services", path: "/admin/services", icon: <MiscellaneousServices /> },
  { label: "Parts", path: "/admin/parts", icon: <Build /> },
  { label: "Users", path: "/admin/users", icon: <People /> },
  { label: "Employees", path: "/admin/employees", icon: <Engineering /> },
  { label: "Customers", path: "/admin/customers", icon: <Person /> },
  { label: "Service Categories", path: "/admin/service-categories", icon: <Category /> },
  { label: "Revenue", path: "/admin/revenue", icon: <AttachMoney /> }
];

function Sidebar() {
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