import { Link, useLocation } from "react-router-dom";
import {
  Box, List, ListItem, ListItemButton,
  ListItemText, Typography
} from "@mui/material";

const menuItems = [
  { label: "Dashboard", path: "/admin" },
  { label: "Services", path: "/admin/services" },
  { label: "Parts", path: "/admin/parts" },
  { label: "Users", path: "/admin/users" },
  { label: "Employees", path: "/admin/employees" }, 
];

function Sidebar() {
  const location = useLocation();

  return (
    <Box
      sx={{
        width: 220,
        bgcolor: "#fff",
        borderRight: "1px solid #e0e0e0",
        minHeight: "100vh",
        px: 2,
        py: 3,
        boxShadow: "2px 0 6px rgba(0,0,0,0.05)"
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
                    "&:hover": {
                      bgcolor: "#303f9f",
                    },
                  },
                }}
              >
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