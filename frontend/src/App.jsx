import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import AdminLayout from "./components/AdminLayout";
<<<<<<< HEAD
import Dashboard from "./pages/admin/dashboard/Dashboard";
import Services from "./pages/admin/service/Services";
import Parts from "./pages/admin/part/Parts";
import Users from "./pages/admin/user/Users";
import Employees from "./pages/admin/employee/Employees";
import Customers from "./pages/admin/customer/Customers";
import ServiceCategories from "./pages/admin/service-category/ServiceCategories";
import Revenue from "./pages/admin/revenue/Revenue";
import NotificationConfig from "./pages/admin/notification-config/NotificationConfig";

import { listenForegroundMessages } from "./firebase";
=======
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
>>>>>>> 7c693ffb1ac67701f26fb341e96c025c154ee47e

function App() {

  useEffect(() => {
    
    listenForegroundMessages();
  }, []);

  return (
    <BrowserRouter>
      <Routes>

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

      </Routes>
    </BrowserRouter>
  );
}

export default App;