import { useNavigate } from "react-router-dom";
import { useOutletContext } from "react-router-dom";
import BackgroundOrbs from "../../components/effects/BackgroundOrbs";
import { C } from "../../constants/colors";
import "../../styles/customer.css";
import "../../styles/global.css";
import {
  FiCalendar, FiActivity,
  FiFileText, FiClock,
  FiCreditCard, FiStar,
  FiTruck, FiClipboard,
  FiDollarSign
} from "react-icons/fi";

import { FaStar, FaCalendarAlt } from "react-icons/fa";

import { useEffect, useState } from "react";
import { getCurrentUserVehicle } from "../../api/vehicleApi";
import { getCurrentUserAppointments } from "../../api/appointmentApi";
import { reviewAPI } from "../../api/reviewApi";
import { quotationAPI } from "../../api/quotationApi";
import { formatPrice, formatDateTime, formatDate } from "../../utils/utils";
import { getCurrentCustomerInfo } from "../../api/customerApi";
import DashBoardAppointmentList from "../../components/customer/dashboard/DashBoardAppointmentList";

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useOutletContext();

  const [loading, setLoading] = useState(true);
  const [vehicleLength, setVehicleLength] = useState(0);
  const [appointments, setAppointments] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [customer, setCustomer] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [appointmentsRes, vehiclesRes, reviewsRes, quoteRes, customerRes] =
          await Promise.all([
            getCurrentUserAppointments(),
            getCurrentUserVehicle(),
            reviewAPI.getMyReviews(),
            quotationAPI.getMyQuotations(),
            getCurrentCustomerInfo(),
          ]);

        setVehicleLength(vehiclesRes.data.length);
        setAppointments(appointmentsRes.data);
        setReviews(reviewsRes.data);
        setQuotes(quoteRes.data);
        setCustomer(customerRes.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const QUICK_ACTIONS = [
    [<FiCalendar />, "Đặt lịch", "/booking", "Bảo dưỡng, sửa chữa"],
    [<FiActivity />, "Theo dõi tiến độ", "/tracking", "Xe đang trong xưởng"],
    [<FiFileText />, "Báo giá", "/quotes", "Duyệt báo giá online"],
    [<FiClock />, "Lịch sử xe", "/history", "Xem toàn bộ lịch sử"],
  ];

  const averageRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : "0";

  const spendings =
    quotes.length > 0
      ? quotes
        .filter((q) => q.status === "APPROVED")
        .reduce((sum, q) => sum + q.totalPrice, 0)
      : 0;

  return (
    <div style={{ minHeight: "100vh", padding: "6rem 5% 3rem", position: "relative" }}>
      <BackgroundOrbs />

      <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative", zIndex: 1 }}>
        {/* Welcome */}
        <div style={{ marginBottom: "2.5rem", animation: "fadeUp .6s ease" }}>
          <p style={{ color: C.textMuted, fontSize: ".85rem", marginBottom: ".3rem" }}>
            Xin chào trở lại 👋
          </p>
          <h1 className="gradient-text-white" style={{ fontFamily: "'Kanit',sans-serif", fontWeight: 800, fontSize: "2rem", letterSpacing: "-1px" }}>
            {customer?.name || user?.username || "Khách hàng"}
          </h1>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "1rem", marginBottom: "2rem" }}>
          {[
            [<FiTruck />, "Xe đã đăng ký", `${vehicleLength} xe`],
            [<FiClipboard />, "Lịch hẹn", `${appointments.length} lần`],
            [<FiStar />, "Đánh giá dịch vụ", `${averageRating}/5`],
            [<FiDollarSign />, "Tổng chi tiêu", `${formatPrice(spendings)}`],
          ].map(([ic, lb, v]) => (
            <div
              key={lb}
              style={{
                background: C.bgCard, border: `1px solid ${C.border}`,
                borderRadius: 18, padding: "1.3rem",
                animation: "fadeUp .6s ease", transition: "all .25s"
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.borderColor = "rgba(255,107,43,.25)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.borderColor = C.border;
              }}
            >
              {/* ICON */}
              <div
                style={{
                  fontSize: "1.3rem", marginBottom: ".5rem",
                  color: C.orange, alignItems: "center"
                }}
              >
                {ic}
              </div>

              <p style={{
                fontSize: ".75rem", color: C.textMuted,
                marginBottom: ".2rem", textTransform: "uppercase", letterSpacing: "1px"
              }}>
                {lb}
              </p>

              <p style={{
                fontFamily: "'Kanit',sans-serif", fontWeight: 800,
                fontSize: "1.3rem", color: C.orange
              }}>
                {v}
              </p>
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1.5rem" }}>
          <DashBoardAppointmentList appointments={appointments} />
          <div>
            <h2 className="gradient-text-white" style={{
              fontFamily: "'Kanit',sans-serif", fontWeight: 700,
              fontSize: "1.1rem", marginBottom: "1rem"
            }}>
              Truy Cập Nhanh
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: ".7rem" }}>
              {QUICK_ACTIONS.map(([ic, lb, path, desc]) => (
                <button
                  key={path}
                  onClick={() => navigate(path)}
                  style={{
                    display: "flex", alignItems: "center",
                    fontFamily: "'Kanit',sans-serif", gap: "1rem",
                    padding: "1rem", background: C.bgCard,
                    border: `1px solid ${C.border}`, borderRadius: 14,
                    cursor: "pointer", transition: "all .3s",
                    textAlign: "left", width: "100%",
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = "rgba(255,107,43,.3)";
                    e.currentTarget.style.background = "rgba(255,107,43,.05)";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = C.border;
                    e.currentTarget.style.background = C.bgCard;
                  }}
                >
                  {/* ICON FIX */}
                  <span
                    style={{
                      fontSize: "1.2rem",
                      width: 28,
                      height: 28,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: C.orange
                    }}
                  >
                    {ic}
                  </span>

                  <div>
                    <p style={{ fontWeight: 500, fontSize: ".88rem", marginBottom: ".1rem", color: C.text }}>
                      {lb}
                    </p>
                    <p style={{ fontSize: ".75rem", color: C.textMuted }}>
                      {desc}
                    </p>
                  </div>

                  <span style={{ marginLeft: "auto", color: C.textMuted, fontSize: ".8rem" }}>
                    →
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}