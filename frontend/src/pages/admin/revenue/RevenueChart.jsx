import {
  AreaChart, Area, XAxis, YAxis,
  Tooltip, CartesianGrid, ResponsiveContainer
} from "recharts";

const formatMoney = (value) =>
  new Intl.NumberFormat("vi-VN").format(value);

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: "#fff",
        padding: 10,
        border: "1px solid #ccc",
        borderRadius: 8
      }}>
        <p><b>{label}</b></p>
        <p style={{ color: "#2ecc71" }}>
          {formatMoney(payload[0].value)} VND
        </p>
      </div>
    );
  }
  return null;
};

function RevenueChart({ data, max }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={data}
        margin={{ top: 20, right: 30, left: 50, bottom: 30 }}
      >
        <defs>
          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
          </linearGradient>
        </defs>

        <CartesianGrid strokeDasharray="3 3" />

        <XAxis
          dataKey="label"
          tick={{ fontSize: 12 }}
          angle={-20}
          textAnchor="end"
        />

        <YAxis
          tickFormatter={formatMoney}
          width={80}
        />

        <Tooltip content={<CustomTooltip />} />

        <Area
          type="monotone"
          dataKey="revenue"
          stroke="#4f46e5"
          strokeWidth={3}
          fillOpacity={1}
          fill="url(#colorRevenue)"
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
  );
}

export default RevenueChart;