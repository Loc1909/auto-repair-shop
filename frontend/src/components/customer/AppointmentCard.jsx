import { C } from "../../constants/colors";
import { formatDate, formatPrice } from "../../utils/utils";
import { getAppointmentStatusDisplay } from "../../constants/appointmentStatus";

export default function AppointmentCard({
  appointment,
  index,
  totalItems,
  onReview,
}) {
  const { appointmentId, status, appointmentTime, service, id, employeeName, price, quotationData } = appointment;

  const statusConfig = getAppointmentStatusDisplay(status);
  const statusBg = statusConfig?.bgColor || C.amberDim;
  const statusColor = statusConfig?.color || C.amber;
  const statusLabel = statusConfig?.label || status;

  const isReviewable = status === "RECEIVED" || status === "CONFIRM";

  return (
    <div
      style={{
        display: "flex",
        gap: "1.5rem",
        marginBottom: "1.5rem",
        animation: `fadeUp .5s ease ${index * 0.08}s both`,
      }}
    >
      {/* Timeline dot + line */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          minWidth: 16,
        }}
      >
        <div
          style={{
            width: 14,
            height: 14,
            borderRadius: "50%",
            background: statusColor,
            border: `2px solid ${statusColor}40`,
            flexShrink: 0,
            opacity: 0.8,
          }}
        />
        {index < totalItems - 1 && (
          <div
            style={{
              width: 2,
              flex: 1,
              background: "rgba(255,107,43,.1)",
              margin: ".3rem 0",
            }}
          />
        )}
      </div>

      {/* Card */}
      <div
        className="card"
        style={{
          flex: 1,
          padding: "1.5rem",
          background: statusBg,
          border: `1px solid ${statusColor}30`,
        }}
      >
        {/* Header: Title + Status */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "1rem",
            flexWrap: "wrap",
            gap: ".5rem",
            alignItems: "flex-start",
          }}
        >
          <div style={{ flex: 1, minWidth: "200px" }}>
            <p
              style={{
                fontSize: ".8rem",
                color: C.textMuted,
                marginBottom: ".2rem",
              }}
            >
              {formatDate(appointmentTime)} · APG-{id}
            </p>
            <h3
              style={{
                fontFamily: "'Kanit',sans-serif",
                fontWeight: 700,
                fontSize: "1rem",
                marginBottom: ".3rem",
                color: C.text,
              }}
            >
              {service}
            </h3>
          </div>
          <span
            className="status-badge"
            style={{
              background: statusBg,
              color: statusColor,
              height: "fit-content",
              padding: ".4rem .8rem",
              borderRadius: 20,
              fontSize: ".75rem",
              fontWeight: 600,
              whiteSpace: "nowrap",
            }}
          >
            {statusLabel}
          </span>
        </div>

        {/* Detail Info - Grid layout */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
            gap: "1rem",
            fontSize: ".82rem",
            color: C.textSub,
            marginBottom: "1.2rem",
          }}
        >
          {/* KTV */}
          <div style={{ display: "flex", alignItems: "flex-start", gap: ".4rem" }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p
                style={{
                  fontSize: ".8rem",
                  color: C.textMuted,
                  marginBottom: ".1rem",
                }}
              >
                {employeeName ? "KTV" : "Trạng thái"}
              </p>
              <p
                style={{
                  fontWeight: 600,
                  color: C.text,
                  wordBreak: "break-word",
                }}
              >
                {employeeName || "Lịch hẹn chưa được xử lý"}
              </p>
            </div>
          </div>

          {/* Price */}
          {price && (
            <div style={{ display: "flex", alignItems: "flex-start", gap: ".4rem" }}>
              <span style={{ fontSize: "1rem", marginTop: ".2rem" }}>💰</span>
              <div>
                <p
                  style={{
                    fontSize: ".65rem",
                    color: C.textMuted,
                    marginBottom: ".1rem",
                  }}
                >
                  Giá
                </p>
                <p style={{ fontWeight: 600, color: C.orange }}>
                  {formatPrice(price)}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Quotation Details */}
        {quotationData?.items?.length > 0 && (
          <div
            style={{
              background: `${C.bgCard}80`,
              border: `1px solid ${C.border}`,
              borderRadius: 6,
              padding: ".8rem",
              marginBottom: "1rem",
              fontSize: ".75rem",
            }}
          >
            <p
              style={{
                color: C.textMuted,
                marginBottom: ".4rem",
                fontWeight: 600,
              }}
            >
              📝 Chi tiết dịch vụ:
            </p>
            {quotationData.items.map((item, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  color: C.textSub,
                  marginBottom: ".2rem",
                }}
              >
                <span>{item.name || item.description}</span>
                <span style={{ color: C.orange, fontWeight: 600 }}>
                  {formatPrice((item.price || 0) * (item.quantity || 1))}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Actions based on status */}
        <div
          style={{
            display: "flex",
            gap: ".5rem",
            flexWrap: "wrap",
            justifyContent: "space-between",
          }}
        >
          {/* Status message */}
          {status === "PENDING" && (
            <div style={{ fontSize: ".85rem", marginRight: "auto", color: C.textMuted }}>
              ⏳ Đang chờ xác nhận từ quán
            </div>
          )}
          {status === "CONFIRM" && (
            <div style={{ fontSize: ".85rem", marginRight: "auto", color: C.textMuted }}>
              ✓ Lịch hẹn đã được xác nhận
            </div>
          )}
          {status === "RECEIVED" && (
            <div style={{ fontSize: ".85rem", marginRight: "auto", color: C.textMuted }}>
              🔧 Đang tiến hành sửa chữa
            </div>
          )}
          {status === "CANCELLED" && (
            <div style={{ fontSize: ".85rem", marginRight: "auto", color: "#F44336" }}>
              ✗ Lịch hẹn đã được hủy
            </div>
          )}

          {/* Review button */}
          {isReviewable && (
            <button
              onClick={() => onReview(appointment)}
              style={{
                background: "none",
                border: `1px solid ${C.border}`,
                borderRadius: 8,
                padding: ".5rem 1rem",
                color: C.textSub,
                fontSize: ".78rem",
                cursor: "pointer",
                transition: "all .2s",
                fontWeight: 600,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = C.orange;
                e.currentTarget.style.color = C.orange;
                e.currentTarget.style.background = `${C.orange}10`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = C.border;
                e.currentTarget.style.color = C.textSub;
                e.currentTarget.style.background = "none";
              }}
            >
              ⭐ Đánh giá dịch vụ
            </button>
          )}
        </div>
      </div>
    </div>
  );
}