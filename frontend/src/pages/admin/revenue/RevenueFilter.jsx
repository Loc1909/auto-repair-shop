import { FormControl, Select, MenuItem } from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import DateRangeIcon from "@mui/icons-material/DateRange";
import BarChartIcon from "@mui/icons-material/BarChart";
import ShowChartIcon from "@mui/icons-material/ShowChart";

// Cấu hình các option lọc
const FILTER_OPTIONS = [
  { value: "day", label: "Theo ngày", Icon: CalendarTodayIcon },
  { value: "month", label: "Theo tháng", Icon: DateRangeIcon },
  { value: "quarter", label: "Theo quý", Icon: BarChartIcon },
  { value: "year", label: "Theo năm", Icon: ShowChartIcon }
];

// Tạo map cho nhanh
const FILTER_MAP = Object.fromEntries(
  FILTER_OPTIONS.map(opt => [opt.value, opt])
);

/**
 * RevenueFilter Component - Bộ lọc khoảng thời gian doanh thu
 */
function RevenueFilter({ type, setType }) {
  const currentOption = FILTER_MAP[type];
  const CurrentIcon = currentOption?.Icon;

  return (
    <FormControl sx={{ minWidth: 220 }}>
      <Select
        value={type}
        onChange={(e) => setType(e.target.value)}
        renderValue={() =>
          CurrentIcon ? (
            <>
              <CurrentIcon sx={{ mr: 1, verticalAlign: "middle" }} />
              {currentOption.label}
            </>
          ) : null
        }
        sx={{
          borderRadius: 3,
          background: "linear-gradient(135deg, #1e1e2f, #2a2a40)",
          color: "#fff",
          fontWeight: 600,
          "&:hover": {
            background: "linear-gradient(135deg, #2a2a40, #323250)"
          }
        }}
      >
        {FILTER_OPTIONS.map(({ value, label, Icon }) => (
          <MenuItem key={value} value={value}>
            <Icon sx={{ mr: 1 }} />
            {label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default RevenueFilter;