import {
  AreaChart, Area, XAxis, YAxis,
  Tooltip, CartesianGrid, ResponsiveContainer
} from "recharts";

const CHART_CONFIG = {
  gradient: "#4f46e5",
  maxPointColor: "#ef4444",
  normalPointRadius: 3,
  maxPointRadius: 6,
  strokeWidth: 3
};

/**
 * Format tiền đầy đủ (tooltip)
 */
const formatMoney = (value) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0
  }).format(value || 0);

/**
 * Format rút gọn (trục Y)
 */
const formatShortMoney = (value) => {
  if (value >= 1_000_000_000) return (value / 1_000_000_000).toFixed(1) + "B";
  if (value >= 1_000_000) return (value / 1_000_000).toFixed(1) + "M";
  if (value >= 1_000) return (value / 1_000).toFixed(1) + "K";
  return value;
};

/**
 * Custom Tooltip
 */
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;

  return (
    <div style={{
      background: "rgba(255,255,255,0.95)",
      padding: "10px 14px",
      borderRadius: 10,
      border: "1px solid #eee",
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
    }}>
      <div style={{ fontWeight: 600, marginBottom: 4,color: "black" }}>
        {label}
      </div>
      <div style={{ color: "#4f46e5", fontWeight: 600 }}>
        {formatMoney(payload[0].value)}
      </div>
    </div>
  );
};

/**
 * Dot highlight max
 */
const renderDot = (max) => ({ cx, cy, payload }) => {
  const isMax = payload.value === max;

  return (
    <circle
      cx={cx}
      cy={cy}
      r={isMax ? CHART_CONFIG.maxPointRadius : CHART_CONFIG.normalPointRadius}
      fill={isMax ? CHART_CONFIG.maxPointColor : CHART_CONFIG.gradient}
    />
  );
};

/**
 * RevenueChart Component
 */
function RevenueChart({ data, max }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
      >
        {/* Gradient */}
        <defs>
          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={CHART_CONFIG.gradient} stopOpacity={0.8} />
            <stop offset="95%" stopColor={CHART_CONFIG.gradient} stopOpacity={0} />
          </linearGradient>
        </defs>

        {/* Grid */}
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />

        {/* X Axis */}
        <XAxis
          dataKey="label"
          stroke="#6b7280"
          tick={{ fontSize: 12 }}
        />

        {/* Y Axis */}
        <YAxis
          tickFormatter={formatShortMoney}
          stroke="#6b7280"
          width={80}
        />

        {/* Tooltip */}
        <Tooltip content={<CustomTooltip />} />

        {/* Area */}
        <Area
          type="monotone"
          dataKey="value"
          stroke={CHART_CONFIG.gradient}
          strokeWidth={CHART_CONFIG.strokeWidth}
          fill="url(#colorRevenue)"
          animationDuration={800}
          dot={renderDot(max)}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export default RevenueChart;