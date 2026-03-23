import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import {
  LineChart,
  Line,
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

  return (
    <div style={{ width: "100%", height: 400 }}>
      <h2>Biểu đồ doanh thu</h2>

      {/* 🔥 SELECT TYPE */}
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

      <ResponsiveContainer>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="label" />

          <YAxis tickFormatter={formatMoney} />

          <Tooltip
            formatter={(value) => formatMoney(value) + " VND"}
          />

          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#8884d8"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default Revenue;