// src/pages/customer/DashboardPage.jsx
import { useNavigate } from "react-router-dom";
import { useOutletContext } from "react-router-dom";
import BackgroundOrbs from "../../components/effects/BackgroundOrbs";
import { C } from "../../constants/colors";
import "../../styles/customer.css";
import "../../styles/global.css";
import {
  FiCalendar,
  FiActivity,
  FiFileText,
  FiClock,
  FiCreditCard,
  FiStar
} from "react-icons/fi";
import {
  FiTruck,
  FiClipboard,
  FiDollarSign
} from "react-icons/fi";


export default function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useOutletContext();

  const appointments = [
    {
      id: "APG-847",
      car: "Toyota Fortuner 51F-123.45",
      service: "Bảo dưỡng định kỳ",
      date: "20/04/2025",
      time: "09:00",
      status: "inprogress",
      step: 4,
      total: 7,
      price: "675.000đ",
    },
    {
      id: "APG-812",
      car: "Toyota Fortuner 51F-123.45",
      service: "Thay lốp xe",
      date: "15/03/2025",
      time: "14:00",
      status: "done",
      price: "1.200.000đ",
    },
  ];

  const statusConfig = {
    inprogress: { label: "Đang sửa", color: C.amber, bg: C.amberDim },
    pending: { label: "Chờ xác nhận", color: C.blue, bg: C.blueDim },
    done: { label: "Hoàn thành", color: C.green, bg: C.greenDim },
    cancelled: { label: "Đã hủy", color: C.red, bg: C.redDim },
  };

  const QUICK_ACTIONS = [
    [<FiCalendar />, "Đặt lịch", "/booking", "Bảo dưỡng, sửa chữa"],
    [<FiActivity />, "Theo dõi tiến độ", "/tracking", "Xe đang trong xưởng"],
    [<FiFileText />, "Báo giá", "/quotes", "Duyệt báo giá online"],
    [<FiClock />, "Lịch sử xe", "/history", "Xem toàn bộ lịch sử"],
    [<FiCreditCard />, "Thanh toán", "/payment", "Thanh toán hóa đơn"],
    [<FiStar />, "Đánh giá", "/review", "Đánh giá dịch vụ"],
  ];

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
            {user?.name || "Khách hàng"}
          </h1>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "1rem", marginBottom: "2rem" }}>
          {[
            [<FiTruck />, "Xe đã đăng ký", "1 xe"],
            [<FiClipboard />, "Lịch hẹn", "8 lần"],
            [<FiStar />, "Đánh giá TB", "4.9/5"],
            [<FiDollarSign />, "Tổng chi tiêu", "4.2tr đ"],
          ].map(([ic, lb, v]) => (
            <div
              key={lb}
              style={{
                background: C.bgCard,
                border: `1px solid ${C.border}`,
                borderRadius: 18,
                padding: "1.3rem",
                animation: "fadeUp .6s ease",
                transition: "all .25s"
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
                  fontSize: "1.3rem",
                  marginBottom: ".5rem",
                  color: C.orange,
                  alignItems: "center"
                }}
              >
                {ic}
              </div>

              <p style={{
                fontSize: ".75rem",
                color: C.textMuted,
                marginBottom: ".2rem",
                textTransform: "uppercase",
                letterSpacing: "1px"
              }}>
                {lb}
              </p>

              <p style={{
                fontFamily: "'Kanit',sans-serif",
                fontWeight: 800,
                fontSize: "1.3rem",
                color: C.orange
              }}>
                {v}
              </p>
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1.5rem" }}>

          {/* Appointments */}
          <div>
            <h2 className="gradient-text-white" style={{ fontFamily: "'Kanit',sans-serif", fontWeight: 700, fontSize: "1.1rem", marginBottom: "1rem" }}>
              Lịch Hẹn Của Tôi
            </h2>

            {appointments.map(a => (
              <div
                key={a.id}
                className="card"
                style={{ marginBottom: "1rem", padding: "1.5rem", cursor: "pointer" }}
                onClick={() => navigate(a.status === "inprogress" ? "/tracking" : "/history")}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                  <div>
                    <p style={{ fontFamily: "'Kanit',sans-serif", fontWeight: 700, fontSize: "1rem", marginBottom: ".2rem" }}>
                      {a.service}
                    </p>
                    <p style={{ fontSize: ".82rem", color: C.textSub }}>{a.car}</p>
                  </div>
                  <span
                    className="status-badge"
                    style={{ background: statusConfig[a.status].bg, color: statusConfig[a.status].color }}
                  >
                    {a.status === "inprogress" && (
                      <span className="notif-dot" style={{ width: 6, height: 6 }} />
                    )}
                    {statusConfig[a.status].label}
                  </span>
                </div>

                {a.status === "inprogress" && (
                  <div style={{ marginBottom: "1rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: ".78rem", color: C.textMuted, marginBottom: ".4rem" }}>
                      <span>Tiến độ</span>
                      <span>{a.step}/{a.total} bước</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${(a.step / a.total) * 100}%` }} />
                    </div>
                  </div>
                )}

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", gap: "1rem" }}>
                    <span style={{ fontSize: ".8rem", color: C.textMuted }}>📅 {a.date}</span>
                    <span style={{ fontSize: ".8rem", color: C.textMuted }}>🕐 {a.time}</span>
                  </div>
                  <span style={{ fontFamily: "'Kanit',sans-serif", fontWeight: 700, color: C.orange, fontSize: ".9rem" }}>
                    {a.price}
                  </span>
                </div>
              </div>
            ))}

            <button
              className="btn-p"
              onClick={() => navigate("/booking")}
              style={{ width: "100%", padding: ".85rem" }}
            >
              + Đặt Lịch Mới
            </button>
          </div>

          {/* Quick actions */}
          <div>
            <h2 className="gradient-text-white" style={{ fontFamily: "'Kanit',sans-serif", fontWeight: 700, fontSize: "1.1rem", marginBottom: "1rem" }}>
              Truy Cập Nhanh
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: ".7rem" }}>
              {QUICK_ACTIONS.map(([ic, lb, path, desc]) => (
                <button
                  key={path}
                  onClick={() => navigate(path)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    fontFamily: "'Kanit',sans-serif",
                    gap: "1rem",
                    padding: "1rem",
                    background: C.bgCard,
                    border: `1px solid ${C.border}`,
                    borderRadius: 14,
                    cursor: "pointer",
                    transition: "all .3s",
                    textAlign: "left",
                    width: "100%",
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