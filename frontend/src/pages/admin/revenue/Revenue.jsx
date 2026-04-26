import { useEffect, useState, useMemo, useRef } from "react";
import axiosClient from "../../../api/axiosClient";
import RevenueChart from "./RevenueChart";
import RevenueSummary from "./RevenueSummary";
import RevenueFilter from "./RevenueFilter";
import "./revenue.css";

/**
 * Revenue Component - Hiển thị biểu đồ doanh thu theo các khoảng thời gian khác nhau
 */
function Revenue() {
  const [data, setData] = useState([]);
  const [type, setType] = useState("day");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const cacheRef = useRef({});

  // Fetch dữ liệu doanh thu
  useEffect(() => {
    const fetchRevenue = async () => {
      // Kiểm tra cache trước
      if (cacheRef.current[type]) {
        setData(cacheRef.current[type]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const res = await axiosClient.get(`/admin/revenue?type=${type}`);

        // Chuẩn hóa dữ liệu
        const normalized = (res.data || []).map(d => ({
          label: d.label,
          value: Number(d.value || 0)
        }));

        cacheRef.current[type] = normalized;
        setData(normalized);
      } catch (err) {
        console.error("Error fetching revenue:", err);
        setError("Không thể tải dữ liệu doanh thu. Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    };

    fetchRevenue();
  }, [type]);

  // Tính toán thống kê
  const stats = useMemo(() => {
    if (!data.length) return { total: 0, max: 0, min: 0 };

    const values = data.map(d => d.value);

    return {
      total: values.reduce((a, b) => a + b, 0),
      max: Math.max(...values),
      min: Math.min(...values)
    };
  }, [data]);

  return (
    <div className="revenue-container">
      {/* Header */}
      <div className="revenue-header">
        <h2 className="revenue-title">Biểu đồ doanh thu</h2>
        <RevenueFilter type={type} setType={setType} />
      </div>

      {/* Error State */}
      {error && <div className="revenue-error">{error}</div>}

      {/* Summary Stats */}
      <RevenueSummary stats={stats} />

      {/* Chart */}
      <div className="revenue-chart-container">
        {loading ? (
          <div className="revenue-chart-loading">Đang tải dữ liệu...</div>
        ) : (
          <RevenueChart data={data} max={stats.max} />
        )}
      </div>
    </div>
  );
}

export default Revenue;