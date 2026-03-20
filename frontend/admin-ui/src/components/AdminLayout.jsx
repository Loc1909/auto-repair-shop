import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

function AdminLayout() {
  return (
    <div style={{ display: "flex" }}>
      
      {/* Sidebar */}
      <Sidebar />

      {/* Nội dung */}
      <div style={{ marginLeft: "20px", padding: "20px", width: "100%" }}>
        <Outlet />
      </div>

    </div>
  );
}

export default AdminLayout;