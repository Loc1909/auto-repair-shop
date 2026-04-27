import { Routes, Route, Navigate } from "react-router-dom";
import CustomerLayout from "../components/layout/CustomerLayout";

// Auth
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage";

// Customer
import DashboardPage from "../pages/customer/DashboardPage";
import BookingPage from "../pages/customer/BookingPage";
import TrackingPage from "../pages/customer/TrackingPage";
import QuotesPage from "../pages/customer/QuotesPage";
import HistoryPage from "../pages/customer/HistoryPage";
import PaymentPage from "../pages/customer/PaymentPage";
import ReviewPage from "../pages/customer/ReviewPage";
import ProfilePage from "../pages/customer/ProfilePage";
import VehicleTrackingPage from "../pages/customer/VehicleTrackingPage";
import VehiclePage from "../pages/customer/VehiclePage";

export default function CustomerRoutes() {
  return (
    <Routes>
      <Route element={<CustomerLayout />}>
        {/* Auth */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot" element={<ForgotPasswordPage />} />

        {/* Customer */}
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/tracking" element={<VehicleTrackingPage />} />
        <Route path="/quotes" element={<QuotesPage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/review" element={<ReviewPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/mycars" element={<VehiclePage />} />

        <Route path="/tracking/:id" element={<TrackingPage />} />

        {/* fallback */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Route>
    </Routes>
  );
}