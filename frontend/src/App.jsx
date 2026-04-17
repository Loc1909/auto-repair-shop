import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import AdminLayout from "./components/AdminLayout";
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

      </Routes>
    </BrowserRouter>
  );
}

export default App;