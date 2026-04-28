import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";

// ===== ROUTES =====
import EmployeeRoutes from "./routes/EmployeeRoutes";
import CustomerRoutes from "./routes/CustomerRoutes";

import AdminLayout from "./components/layout/AdminLayout";

// ===== ADMIN PAGES =====
import AdminDashboard from "./pages/admin/dashboard/Dashboard";
import AdminServices from "./pages/admin/service/Services";
import AdminParts from "./pages/admin/part/Parts";
import AdminPartRequests from "./pages/admin/part/PartRequests";
import AdminUsers from "./pages/admin/user/Users";
import AdminEmployees from "./pages/admin/employee/Employees";
import AdminCustomers from "./pages/admin/customer/Customers";
import AdminServiceCategories from "./pages/admin/service-category/ServiceCategories";
import AdminRevenue from "./pages/admin/revenue/Revenue";
import AdminNotificationConfig from "./pages/admin/notification-config/NotificationConfig";

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
          <Route path="part-requests" element={<AdminPartRequests />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="employees" element={<AdminEmployees />} />
          <Route path="customers" element={<AdminCustomers />} />
          <Route path="service-categories" element={<AdminServiceCategories />} />
          <Route path="revenue" element={<AdminRevenue />} />
          <Route path="notification-config" element={<AdminNotificationConfig />} />
        </Route>

        {/* ===== EMPLOYEE ===== */}
        <Route path="/employee/*" element={<EmployeeRoutes />} />

        {/* ===== HOME ===== */}
        <Route path="/" element={<HomePage />} />

        {/* ===== CUSTOMER ===== */}
        <Route path="/*" element={<CustomerRoutes />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;