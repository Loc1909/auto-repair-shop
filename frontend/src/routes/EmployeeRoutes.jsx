import { Routes, Route } from "react-router-dom";
import EmployeeLayout from "../components/layout/EmployeeLayout";

// ===== EMPLOYEE PAGES =====
import EmployeeDashboard from "../pages/employee/EmployeeDashboard";
import EmployeeSchedule from "../pages/employee/EmployeeSchedule";
import EmployeeAppointments from "../pages/employee/EmployeeAppointments";
import EmployeeRepairOrders from "../pages/employee/EmployeeRepairOrders";
import EmployeeRepairProgress from "../pages/employee/EmployeeRepairProgress";

export default function EmployeeRoutes() {
  return (
    <Routes>
      <Route element={<EmployeeLayout />}>
        <Route index element={<EmployeeDashboard />} />
        <Route path="schedule" element={<EmployeeSchedule />} />
        <Route path="appointments" element={<EmployeeAppointments />} />
        <Route path="repair-orders" element={<EmployeeRepairOrders />} />
        <Route path="repair-orders/:id" element={<EmployeeRepairProgress />} />
      </Route>
    </Routes>
  );
}
