import { useEffect, useState, useMemo } from "react";
import axiosClient from "../../../api/axiosClient";
import RevenueChart from "./RevenueChart";
import RevenueSummary from "./RevenueSummary";
import RevenueFilter from "./RevenueFilter";

function Revenue() {
  const [data, setData] = useState([]);
  const [type, setType] = useState("day");

  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        const res = await axiosClient.get(`/admin/revenue?type=${type}`);
        setData(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchRevenue();
  }, [type]);

  // tính toán tách riêng
  const stats = useMemo(() => {
    if (data.length === 0) return { total: 0, max: 0, min: 0 };

    const revenues = data.map(d => d.revenue);

    return {
      total: revenues.reduce((a, b) => a + b, 0),
      max: Math.max(...revenues),
      min: Math.min(...revenues)
    };
  }, [data]);

  return (
    <div style={{ width: "100%", height: 450, padding: 20 }}>
      <h2 style={{ fontWeight: "bold" }}>Biểu đồ doanh thu</h2>

      <RevenueFilter type={type} setType={setType} />

      <RevenueSummary stats={stats} />

      <RevenueChart data={data} max={stats.max} />
    </div>
  );
}

export default Revenue;