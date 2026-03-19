import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminLayout from "./components/AdminLayout";
import Dashboard from "./pages/Dashboard";
import Services from "./pages/Services";
import Parts from "./pages/Parts";
import Employees from "./pages/Employees";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Admin Layout */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="services" element={<Services />} />
          <Route path="parts" element={<Parts />} />
          <Route path="employees" element={<Employees />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;