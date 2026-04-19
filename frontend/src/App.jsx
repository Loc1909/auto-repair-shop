import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";

import AdminLayout from "./components/AdminLayout";
import EmployeeLayout from "./components/EmployeeLayout";

// ===== ADMIN PAGES =====
import AdminDashboard from "./pages/admin/dashboard/Dashboard";
import AdminServices from "./pages/admin/service/Services";
import AdminParts from "./pages/admin/part/Parts";
import AdminUsers from "./pages/admin/user/Users";
import AdminEmployees from "./pages/admin/employee/Employees";
import AdminCustomers from "./pages/admin/customer/Customers";
import AdminServiceCategories from "./pages/admin/service-category/ServiceCategories";
import AdminRevenue from "./pages/admin/revenue/Revenue";
import AdminNotificationConfig from "./pages/admin/notification-config/NotificationConfig";

// ===== EMPLOYEE PAGES =====
import EmployeeDashboard from "./pages/employee/EmployeeDashboard";
import EmployeeSchedule from "./pages/employee/EmployeeSchedule";
import EmployeeAppointments from "./pages/employee/EmployeeAppointments";
import EmployeeRepairOrders from "./pages/employee/EmployeeRepairOrders";
import EmployeeRepairProgress from "./pages/employee/EmployeeRepairProgress";


//===== HOME PAGE =====
import HomePage from "./pages/home/HomePage";



import { listenForegroundMessages } from "./firebase";

function App() {
  useEffect(() => {
    listenForegroundMessages();
  }, []);

  return (
    <BrowserRouter>
      <Routes>

        {/* ===== ADMIN ===== */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="services" element={<AdminServices />} />
          <Route path="parts" element={<AdminParts />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="employees" element={<AdminEmployees />} />
          <Route path="customers" element={<AdminCustomers />} />
          <Route path="service-categories" element={<AdminServiceCategories />} />
          <Route path="revenue" element={<AdminRevenue />} />
          <Route path="notification-config" element={<AdminNotificationConfig />} />
        </Route>

        {/* ===== EMPLOYEE ===== */}
        <Route path="/employee" element={<EmployeeLayout />}>
          <Route index element={<EmployeeDashboard />} />
          <Route path="schedule" element={<EmployeeSchedule />} />
          <Route path="appointments" element={<EmployeeAppointments />} />
          <Route path="repair-orders" element={<EmployeeRepairOrders />} />
          <Route path="repair-orders/:id" element={<EmployeeRepairProgress />} />
        </Route>

        {/* ===== HOME ===== */}
        <Route path="/" element={<HomePage />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;