import { useEffect, useState, useMemo } from "react";
import axiosClient from "../api/axiosClient";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

function Revenue() {
  const [data, setData] = useState([]);
  const [type, setType] = useState("day");

  const formatMoney = (value) => {
    return new Intl.NumberFormat("vi-VN").format(value);
  };

  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        const res = await axiosClient.get(`/admin/revenue?type=${type}`);
        setData(res.data);
      } catch (err) {
        console.error("Error fetching revenue:", err);
      }
    };

    fetchRevenue();
  }, [type]);

  // 👉 Summary
  const { total, max, min } = useMemo(() => {
    if (data.length === 0) return { total: 0, max: 0, min: 0 };

    const revenues = data.map((d) => d.revenue);
    return {
      total: revenues.reduce((a, b) => a + b, 0),
      max: Math.max(...revenues),
      min: Math.min(...revenues),
    };
  }, [data]);

  // 👉 Custom Tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div
          style={{
            background: "#fff",
            padding: 10,
            border: "1px solid #ccc",
            borderRadius: 8,
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          }}
        >
          <p><b>{label}</b></p>
          <p style={{ color: "#2ecc71" }}>
            {formatMoney(payload[0].value)} VND
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ width: "100%", height: 450, padding: 20 }}>
      <h2>Biểu đồ doanh thu</h2>

      {/* 🔥 SELECT */}
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

      {/* 🔥 SUMMARY */}
      <div style={{ marginBottom: 20 }}>
        <b>Tổng:</b> {formatMoney(total)} VND |{" "}
        <b>Cao nhất:</b> {formatMoney(max)} |{" "}
        <b>Thấp nhất:</b> {formatMoney(min)}
      </div>

      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 20, right: 30, left: 50, bottom: 30 }}
        >
          {/* Gradient */}
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" />

          {/* XAxis */}
          <XAxis
            dataKey="label"
            tick={{ fontSize: 12 }}
            angle={-20}
            textAnchor="end"
          />

          {/* YAxis */}
          <YAxis
            tickFormatter={formatMoney}
            width={80}
            domain={["dataMin - 1000", "dataMax + 1000"]}
          />

          {/* Tooltip */}
          <Tooltip
            content={<CustomTooltip />}
            wrapperStyle={{ zIndex: 1000 }}
          />

          {/* Area */}
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#4f46e5"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorRevenue)"
            isAnimationActive={true}
            animationDuration={1000}
            dot={(props) => {
              const { cx, cy, payload } = props;
              if (payload.revenue === max) {
                return <circle cx={cx} cy={cy} r={6} fill="red" />;
              }
              return <circle cx={cx} cy={cy} r={3} fill="#4f46e5" />;
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default Revenue;