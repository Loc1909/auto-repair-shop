import { Outlet } from "react-router-dom";
import EmployeeSidebar from "./EmployeeSidebar";
import { Box } from "@mui/material";

function EmployeeLayout() {
  return (
    <Box sx={{ display: "flex", minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
      
      {/* Sidebar */}
      <EmployeeSidebar />

      {/* Nội dung chính */}
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Outlet />
      </Box>

    </Box>
  );
}

export default EmployeeLayout;
