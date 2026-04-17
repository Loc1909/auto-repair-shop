import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminLayout from "./components/AdminLayout";
import Dashboard from "./pages/Dashboard";
import Services from "./pages/Services";
import Parts from "./pages/Parts";
import Users from "./pages/Users";
import Employees from "./pages/Employees";
import Customers from "./pages/Customers";
import ServiceCategories from "./pages/ServiceCategories";
import Revenue from "./pages/Revenue";
import NotificationConfig from "./pages/NotificationConfig";

import EmployeeLayout from "./components/EmployeeLayout";
import EmployeeDashboard from "./pages/employee/EmployeeDashboard";
import EmployeeSchedule from "./pages/employee/EmployeeSchedule";
import EmployeeAppointments from "./pages/employee/EmployeeAppointments";
import EmployeeRepairOrders from "./pages/employee/EmployeeRepairOrders";
import EmployeeRepairProgress from "./pages/employee/EmployeeRepairProgress";


import Login from "./pages/auth/Login.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Admin Layout */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="services" element={<Services />} />
          <Route path="parts" element={<Parts />} />
          <Route path="users" element={<Users />} />
          <Route path="employees" element={<Employees />} />
          <Route path="customers" element={<Customers />} />
          <Route path="service-categories" element={<ServiceCategories />} />
          <Route path="revenue" element={<Revenue />} />
          <Route path="notification-config" element={<NotificationConfig />} />
        </Route>

        {/* Employee Layout */}
        <Route path="/employee" element={<EmployeeLayout />}>
          <Route index element={<EmployeeDashboard />} />
          <Route path="schedule" element={<EmployeeSchedule />} />
          <Route path="appointments" element={<EmployeeAppointments />} />
          <Route path="repair-orders" element={<EmployeeRepairOrders />} />
          <Route path="repair-orders/:id" element={<EmployeeRepairProgress />} />
        </Route>

        <Route path="/login" element={<Login />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;