import { useState } from "react";
import Logo from "../../components/common/Logo";
import BackgroundOrbs from "../../components/effects/BackgroundOrbs";
import AuthNav from "../../components/layout/AuthNav";
import { useNavigate, useOutletContext } from "react-router-dom";
import "../../styles/auth.css";
import { FaFacebook, FaGoogle } from "react-icons/fa";
import { FiLock, FiEye, FiEyeOff, FiUser } from "react-icons/fi";
import { login, storeLoginToken } from "../../api/authApi";


export default function LoginPage() {
    const navigate = useNavigate();
    const { setUser, showToast } = useOutletContext();

    const [error, setError] = useState("");
    const [emailOrUsername, setEmailOrUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const C = {
        bg: "#0D0D14", bgCard: "rgba(255,255,255,0.04)", bgCard2: "rgba(255,255,255,0.02)",
        border: "rgba(255,255,255,0.07)", borderHover: "rgba(255,107,43,0.3)",
        orange: "#FF6B2B", orangeLight: "#FF8C5A", orangeDim: "rgba(255,107,43,0.15)",
        text: "#F0F0F8", textSub: "#A0A0B8", textMuted: "#5A5A7A",
        green: "#4ADAA0", greenDim: "rgba(74,218,160,0.12)",
        red: "#FF5B6B", redDim: "rgba(255,91,107,0.12)",
        amber: "#FFB84D", amberDim: "rgba(255,184,77,0.12)",
        blue: "#5B9EFF", blueDim: "rgba(91,158,255,0.12)",
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        if (!emailOrUsername || !password) {
            setError("Vui lòng nhập đầy đủ thông tin");
            return;
        }
        try {
            setLoading(true);
            const res = await login({
                emailOrUsername,
                password
            });
            setUser(res.data.user);
            storeLoginToken(res.data);

            setTimeout(() => {
                showToast("Đăng nhập thành công! Chào mừng trở lại 🎉", "success");
                navigate("/dashboard");
                setLoading(false);
            }, 1000);

        } catch (err) {
            console.log(err);
            setError(
                err.response?.data?.message || "Đăng nhập thất bại"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ backgroundColor: "rgba(13,13,20,.92)", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "6rem 1rem 2rem", position: "relative" }}>
            <BackgroundOrbs />
            <div style={{ width: "100%", maxWidth: 440, position: "relative", zIndex: 1, animation: "fadeUp .6s ease" }}>
                <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>

                    <h1 className="gradient-text-white" style={{ fontWeight: 800, fontSize: "1.9rem", letterSpacing: "-1px", marginTop: "2rem", marginBottom: ".5rem" }}>
                        Chào Mừng Trở Lại
                    </h1>
                    <p style={{ color: C.textSub, fontSize: ".9rem", fontWeight: 300 }}>
                        Đăng nhập để quản lý xe của bạn
                    </p>
                </div>

                <form onSubmit={handleSubmit}
                    style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 24, padding: "2.5rem", backdropFilter: "blur(20px)" }}>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".8rem", marginBottom: "1.8rem" }}>
                        {[
                            { icon: <FaFacebook />, label: "Facebook", color: "#1877F2" },
                            { icon: <FaGoogle />, label: "Google", color: "#EA4335" }
                        ].map(({ icon, label, color }) => (
                            <button
                                key={label}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: ".5rem",
                                    padding: ".75rem",
                                    background: "rgba(255,255,255,.04)",
                                    border: "1px solid rgba(255,255,255,.08)",
                                    borderRadius: 12,
                                    color: C.textSub,
                                    fontSize: ".85rem",
                                    cursor: "pointer",
                                    transition: "all .3s"
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.background = "rgba(255,255,255,.07)";
                                    e.currentTarget.style.color = C.text;
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.background = "rgba(255,255,255,.04)";
                                    e.currentTarget.style.color = C.textSub;
                                }}
                            >
                                <span style={{ color, fontSize: "1rem" }}>{icon}</span>
                                {label}
                            </button>
                        ))}
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.8rem" }}>
                        <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,.07)" }} />
                        <span style={{ fontSize: ".78rem", color: C.textMuted }}>hoặc đăng nhập với</span>
                        <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,.07)" }} />
                    </div>

                    {/* Email */}
                    <div className="input-wrap">
                        <label>Email hoặc tên đăng nhập</label>
                        <div style={{ position: "relative" }}>

                            <FiUser
                                style={{
                                    position: "absolute",
                                    left: "1rem",
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    color: C.textMuted,
                                    fontSize: "1rem"
                                }}
                            />

                            <input
                                style={{ paddingLeft: "2.5rem" }}
                                placeholder="example@email.com hoặc username"
                                value={emailOrUsername}
                                onChange={(e) => setEmailOrUsername(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* PASSWORD */}
                    <div className="input-wrap">
                        <label>Mật khẩu</label>
                        <div style={{ position: "relative" }}>

                            <FiLock
                                style={{
                                    position: "absolute",
                                    left: "1rem",
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    color: C.textMuted,
                                    fontSize: "1rem"
                                }}
                            />

                            <input
                                style={{ paddingLeft: "2.5rem", paddingRight: "3rem" }}
                                type={showPassword ? "text" : "password"}
                                placeholder="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onKeyDown={e => e.key === "Enter" && handleSubmit(e)}
                            />

                            <button
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    position: "absolute",
                                    right: "1rem",
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    background: "none",
                                    border: "none",
                                    color: C.textMuted,
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center"
                                }}
                            >
                                {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                            </button>

                        </div>
                    </div>

                    <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "-.5rem", marginBottom: "1.5rem" }}>


                        <button className="btn-ghost" onClick={() => navigate("/forgot")} style={{ color: C.orangeLight, padding: 0 }}>
                            Quên mật khẩu?
                        </button>
                    </div>

                    <button className="btn-p"
                        type="submit"
                        disabled={loading}
                        style={{ width: "100%", padding: "1rem", fontSize: ".95rem", opacity: loading ? .7 : 1 }}>
                        {loading ? <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: ".6rem" }}>
                            <span style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin .8s linear infinite", display: "inline-block" }} />
                            Đang đăng nhập...
                        </span> : "Đăng Nhập →"}
                    </button>
                </form>

                <p style={{ textAlign: "center", marginTop: "1.5rem", color: C.textMuted, fontSize: ".88rem" }}>
                    Chưa có tài khoản?{" "}
                    <button onClick={() => navigate("/register")} style={{ background: "none", border: "none", color: C.orangeLight, cursor: "pointer", fontWeight: 500, fontSize: ".88rem" }}>
                        Đăng ký ngay
                    </button>
                </p>
            </div>
        </div>
    );
}