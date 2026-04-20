const formatMoney = (value) =>
  new Intl.NumberFormat("vi-VN").format(value);

function RevenueSummary({ stats }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <b>Tổng:</b> {formatMoney(stats.total)} VND |{" "}
      <b>Cao nhất:</b> {formatMoney(stats.max)} |{" "}
      <b>Thấp nhất:</b> {formatMoney(stats.min)}
    </div>
  );
}

export default RevenueSummary;