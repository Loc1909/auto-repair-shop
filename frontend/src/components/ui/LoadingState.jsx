import { C } from "../../constants/colors";

export default function LoadingState() {
  return (
    <div style={{ textAlign: "center", padding: "1rem", color: C.textMuted }}>
      <p>⏳ Đang tải...</p>
    </div>
  );
}