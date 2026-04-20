import { useState } from "react";
import Logo from "../../components/common/Logo";
import BackgroundOrbs from "../../components/effects/BackgroundOrbs";
import AuthNav from "../../components/layout/AuthNav";
import "../../styles/auth.css";

export default function ForgotPasswordPage({ setPage, showToast }) {
    const [step, setStep] = useState(0);
    const [phone, setPhone] = useState("");
    const [newPass, setNewPass] = useState("");
    const handleSend = () => { if (!phone) { showToast("Nhập SĐT", "error"); return; } showToast("Đã gửi OTP", "info"); setStep(1); };
    const handleReset = () => { showToast("Đặt lại mật khẩu thành công!", "success"); setPage("login"); };
    return (
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "6rem 1rem", position: "relative" }}>
            <BackgroundOrbs />
            <div style={{ width: "100%", maxWidth: 420, position: "relative", zIndex: 1, animation: "fadeUp .6s ease" }}>
                <div style={{ textAlign: "center", marginBottom: "2rem" }}><Logo onClick={() => setPage("landing")} /><h1 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "1.7rem", letterSpacing: "-1px", marginTop: "2rem", marginBottom: ".4rem" }}>Quên Mật Khẩu</h1><p style={{ color: C.textSub, fontSize: ".88rem" }}>Chúng tôi sẽ gửi mã xác thực về điện thoại</p></div>
                <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 24, padding: "2.5rem" }}>
                    {step === 0 && (<><div className="input-wrap"><label>Số điện thoại đã đăng ký</label><input placeholder="0901 234 567" value={phone} onChange={e => setPhone(e.target.value)} /></div><button className="btn-p" onClick={handleSend} style={{ width: "100%", padding: "1rem" }}>Gửi Mã OTP →</button></>)}
                    {step === 1 && (<><p style={{ color: C.textSub, fontSize: ".85rem", marginBottom: "1.5rem", textAlign: "center" }}>Nhập OTP đã gửi đến <strong style={{ color: C.text }}>{phone}</strong></p><div className="input-wrap"><label>Mã OTP</label><input placeholder="_ _ _ _ _ _" style={{ textAlign: "center", fontSize: "1.2rem", letterSpacing: "8px" }} /></div><div className="input-wrap"><label>Mật khẩu mới</label><input type="password" placeholder="Tối thiểu 8 ký tự" value={newPass} onChange={e => setNewPass(e.target.value)} /></div><div className="input-wrap"><label>Xác nhận mật khẩu mới</label><input type="password" placeholder="Nhập lại" /></div><button className="btn-p" onClick={handleReset} style={{ width: "100%", padding: "1rem" }}>Đặt Lại Mật Khẩu ✓</button></>)}
                </div>
                <p style={{ textAlign: "center", marginTop: "1.5rem", color: C.textMuted, fontSize: ".85rem" }}><button onClick={() => setPage("login")} style={{ background: "none", border: "none", color: C.orangeLight, cursor: "pointer", fontSize: ".85rem" }}>← Quay lại đăng nhập</button></p>
            </div>
        </div>
    );
}