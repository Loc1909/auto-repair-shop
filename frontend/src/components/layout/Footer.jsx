export default function Footer(){
    return(
        <footer style={{ borderTop: "1px solid rgba(255,255,255,0.05)", padding: "3rem 5%", background: "rgba(0,0,0,0.3)" }}>
          <div style={{ maxWidth: 1300, margin: "0 auto", display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: "3rem" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1rem" }}>
                <div style={{ width: 32, height: 32, background: "linear-gradient(135deg, #FF6B2B, #FF3B00)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.9rem" }}>🔧</div>
                <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "1.1rem" }}>Auto<span style={{ color: "#FF6B2B" }}>Pro</span></span>
              </div>
              <p style={{ color: "#5A5A7A", fontSize: "0.85rem", lineHeight: 1.8, maxWidth: 280, fontWeight: 300 }}>
                Hệ thống quản lý garage ô tô thông minh — minh bạch, tiện lợi, đáng tin cậy.
              </p>
              <p style={{ color: "#4A4A6A", fontSize: "0.8rem", marginTop: "1rem" }}>📍 123 Lý Thường Kiệt, Q.10, TP.HCM</p>
            </div>
            {[
              { title: "Dịch Vụ", links: ["Bảo dưỡng định kỳ", "Sửa chữa điện", "Điều hòa xe", "Lốp & Phanh"] },
              { title: "Tài Khoản", links: ["Đặt lịch", "Theo dõi xe", "Lịch sử bảo dưỡng", "Thanh toán"] },
              { title: "Hỗ Trợ", links: ["Hotline 1800 6789", "Chính sách bảo hành", "FAQ", "Liên hệ"] },
            ].map(col => (
              <div key={col.title}>
                <h5 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, marginBottom: "1rem", fontSize: "0.9rem" }}>{col.title}</h5>
                {col.links.map(l => <p key={l} style={{ color: "#5A5A7A", fontSize: "0.83rem", marginBottom: "0.5rem", cursor: "pointer", transition: "color 0.2s" }}>{l}</p>)}
              </div>
            ))}
          </div>
          <div style={{ maxWidth: 1300, margin: "2rem auto 0", paddingTop: "2rem", borderTop: "1px solid rgba(255,255,255,0.04)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <p style={{ color: "#3A3A5A", fontSize: "0.78rem" }}>© 2025 AutoPro Garage. All rights reserved.</p>
            <p style={{ color: "#3A3A5A", fontSize: "0.78rem" }}>Thiết kế với ❤️ cho chủ xe Việt Nam</p>
          </div>
        </footer>
    )
}