import { useState } from "react";
import { useNavigate } from "react-router-dom";
import bg from '/src/assets/login_bg.jpeg';
import { login } from "../../api/authApi";

export default function Login() {

    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [emailOrUsername, setEmailOrUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

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

            const { token, user } = res.data;

            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("refreshToken", data.refreshToken);
            localStorage.setItem("user", JSON.stringify({
                id: data.user.id,
                username: data.user.username,
                role: data.user.role
            }));
            // navigate("/");

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
        <>
            <div
                className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${bg})` }} >
                {/* Glassmorphism Card */}
                <form
                    onSubmit={handleSubmit}
                    className="w-105 px-11 py-10 rounded-2xl border border-white/10 shadow-2xl"
                    style={{
                        background: "rgba(30, 27, 75, 0.55)",
                        backdropFilter: "blur(18px)",
                    }} >
                    {/* Logo */}
                    <div className="flex items-center gap-2 mb-2">
                        <svg width="26" height="26" viewBox="0 0 28 28" fill="none">
                            <path
                                d="M4 8C4 5.79 5.79 4 8 4h12c2.21 0 4 1.79 4 4v12c0 2.21-1.79 4-4 4H8c-2.21 0-4-1.79-4-4V8z"
                                fill="url(#logoGrad)"
                            />
                            <defs>
                                <linearGradient id="logoGrad" x1="4" y1="4" x2="24" y2="24" gradientUnits="userSpaceOnUse">
                                    <stop stopColor="#a78bfa" />
                                    <stop offset="1" stopColor="#ec4899" />
                                </linearGradient>
                            </defs>
                        </svg>
                        <span className="text-sm text-white/70 font-normal tracking-wide">Your logo</span>
                    </div>

                    <h1 className="text-[32px] font-bold text-white mb-7 tracking-tight">Login</h1>

                    {/* Email */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-white/85 mb-1.5">Email Or Username</label>
                        <input
                            type="text"
                            placeholder="username@gmail.com"
                            value={emailOrUsername}
                            onChange={(e) => setEmailOrUsername(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl bg-white/95 text-gray-800 text-sm placeholder-gray-400 outline-none border-2 border-transparent focus:border-rose-600 transition-all"
                        />
                    </div>

                    {/* Password */}
                    <div className="mb-4">
                        <label className="text-sm text-white">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-2.5 pr-10 rounded-xl bg-white text-gray-800"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2"
                            >
                                👁
                            </button>
                        </div>
                    </div>
                    <a href="#" className="block text-xs text-white/50 mt-1.5 hover:text-white/90 transition-colors">
                        Forgot Password?
                    </a>
                    {/* Error */}
                    {error && (
                        <p className="text-red-400 text-sm mb-3">{error}</p>
                    )}


                    {/* Sign In Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 rounded-xl text-white font-semibold text-sm tracking-wide bg-rose-700 hover:bg-rose-600 hover:-translate-y-px active:translate-y-0 transition-all shadow-lg"
                    >
                        {loading ? "Signing in..." : "Sign in"}
                    </button>

                    {/* <div className="flex items-center gap-3 my-5">
                        <div className="flex-1 h-px bg-white/15" />
                        <span className="text-xs text-white/45 whitespace-nowrap">or continue with</span>
                        <div className="flex-1 h-px bg-white/15" />
                    </div>
                    <div className="flex gap-3 mb-5">
                        <button
                            type="button"
                            className="flex-1 flex items-center justify-center py-2.5 rounded-xl bg-white/10 border border-white/15 hover:bg-white/20 hover:border-white/30 hover:-translate-y-px transition-all"
                        >
                            <svg width="22" height="22" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                        </button>
                    </div> */}

                    {/* Register */}
                    <p className="text-center text-xs text-white/50">
                        Don't have an account yet?{" "}
                        <a href="#" className="text-white font-semibold hover:text-rose-300 transition-colors">
                            Register for free
                        </a>
                    </p>
                </form >
            </div >
        </>
    );
}