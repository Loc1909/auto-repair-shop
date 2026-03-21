// AdminLayout.jsx
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { Box } from "@mui/material";

function AdminLayout() {
  return (
    <Box sx={{ display: "flex", minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
      
      {/* Sidebar */}
      <Sidebar />

      {/* Nội dung chính */}
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Outlet />
      </Box>

    </Box>
  );
}

export default AdminLayout;