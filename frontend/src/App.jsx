import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminLayout from "./components/AdminLayout";
import Dashboard from "./pages/Dashboard";
import Services from "./pages/Services";
import Parts from "./pages/Parts";
import Users from "./pages/Users";
import Employees from "./pages/Employees";
import Customers from "./pages/Customers";
import ServiceCategories from "./pages/ServiceCategories";

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
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;