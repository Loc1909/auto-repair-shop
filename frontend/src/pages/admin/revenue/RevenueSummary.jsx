/**
 * Format tiền tệ theo định dạng Việt Nam
 */
const formatMoney = (value) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND"
  }).format(value || 0);

/**
 * RevenueSummary Component - Hiển thị tổng kết thống kê doanh thu
 */
function RevenueSummary({ stats }) {
  return (
    <div className="revenue-summary">
      <span className="revenue-summary-item">
        <span className="revenue-summary-label">Tổng:</span>{" "}
        <span className="revenue-summary-value">{formatMoney(stats.total)}</span>
      </span>
      <span className="revenue-summary-item">
        <span className="revenue-summary-label">Cao nhất:</span>{" "}
        <span className="revenue-summary-value">{formatMoney(stats.max)}</span>
      </span>
      <span className="revenue-summary-item">
        <span className="revenue-summary-label">Thấp nhất:</span>{" "}
        <span className="revenue-summary-value">{formatMoney(stats.min)}</span>
      </span>
    </div>
  );
}

export default RevenueSummary;