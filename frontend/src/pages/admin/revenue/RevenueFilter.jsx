function RevenueFilter({ type, setType }) {
  return (
    <select
      value={type}
      onChange={(e) => setType(e.target.value)}
      style={{ marginBottom: 20, padding: 5 }}
    >
      <option value="day">Theo ngày</option>
      <option value="month">Theo tháng</option>
      <option value="quarter">Theo quý</option>
      <option value="year">Theo năm</option>
    </select>
  );
}

export default RevenueFilter;