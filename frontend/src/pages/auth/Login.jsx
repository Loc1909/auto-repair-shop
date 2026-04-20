import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
            const loginData = res.data;
            const { token, user } = loginData;

            localStorage.setItem("accessToken", loginData.accessToken);
            localStorage.setItem("refreshToken", loginData.refreshToken);
            localStorage.setItem("user", JSON.stringify({
                id: loginData.user.id,
                username: loginData.user.username,
                role: loginData.user.role
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
                        <span className="text-sm text-white/70 font-normal tracking-wide">Logo</span>
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
                                placeholder="password"
                                type={showPassword ? "text" : "password"}
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl bg-white/95 text-gray-800 text-sm placeholder-gray-400 outline-none border-2 border-transparent focus:border-rose-600 transition-all"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute z-30 text-gray-500 -translate-y-1/2 cursor-pointer right-4 top-1/2 dark:text-gray-400"
                            >{!showPassword ? (
                                <svg
                                    className="fill-current"
                                    width="20"
                                    height="20"
                                    viewBox="0 0 20 20"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M10.0002 13.8619C7.23361 13.8619 4.86803 12.1372 3.92328 9.70241C4.86804 7.26761 7.23361 5.54297 10.0002 5.54297C12.7667 5.54297 15.1323 7.26762 16.0771 9.70243C15.1323 12.1372 12.7667 13.8619 10.0002 13.8619ZM10.0002 4.04297C6.48191 4.04297 3.49489 6.30917 2.4155 9.4593C2.3615 9.61687 2.3615 9.78794 2.41549 9.94552C3.49488 13.0957 6.48191 15.3619 10.0002 15.3619C13.5184 15.3619 16.5055 13.0957 17.5849 9.94555C17.6389 9.78797 17.6389 9.6169 17.5849 9.45932C16.5055 6.30919 13.5184 4.04297 10.0002 4.04297ZM9.99151 7.84413C8.96527 7.84413 8.13333 8.67606 8.13333 9.70231C8.13333 10.7286 8.96527 11.5605 9.99151 11.5605H10.0064C11.0326 11.5605 11.8646 10.7286 11.8646 9.70231C11.8646 8.67606 11.0326 7.84413 10.0064 7.84413H9.99151Z"
                                        fill="#98A2B3" />
                                </svg>
                            ) : (
                                <svg
                                    className="fill-current"
                                    width="20"
                                    height="20"
                                    viewBox="0 0 20 20"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg" >
                                    <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M4.63803 3.57709C4.34513 3.2842 3.87026 3.2842 3.57737 3.57709C3.28447 3.86999 3.28447 4.34486 3.57737 4.63775L4.85323 5.91362C3.74609 6.84199 2.89363 8.06395 2.4155 9.45936C2.3615 9.61694 2.3615 9.78801 2.41549 9.94558C3.49488 13.0957 6.48191 15.3619 10.0002 15.3619C11.255 15.3619 12.4422 15.0737 13.4994 14.5598L15.3625 16.4229C15.6554 16.7158 16.1302 16.7158 16.4231 16.4229C16.716 16.13 16.716 15.6551 16.4231 15.3622L4.63803 3.57709ZM12.3608 13.4212L10.4475 11.5079C10.3061 11.5423 10.1584 11.5606 10.0064 11.5606H9.99151C8.96527 11.5606 8.13333 10.7286 8.13333 9.70237C8.13333 9.5461 8.15262 9.39434 8.18895 9.24933L5.91885 6.97923C5.03505 7.69015 4.34057 8.62704 3.92328 9.70247C4.86803 12.1373 7.23361 13.8619 10.0002 13.8619C10.8326 13.8619 11.6287 13.7058 12.3608 13.4212ZM16.0771 9.70249C15.7843 10.4569 15.3552 11.1432 14.8199 11.7311L15.8813 12.7925C16.6329 11.9813 17.2187 11.0143 17.5849 9.94561C17.6389 9.78803 17.6389 9.61696 17.5849 9.45938C16.5055 6.30925 13.5184 4.04303 10.0002 4.04303C9.13525 4.04303 8.30244 4.17999 7.52218 4.43338L8.75139 5.66259C9.1556 5.58413 9.57311 5.54303 10.0002 5.54303C12.7667 5.54303 15.1323 7.26768 16.0771 9.70249Z"
                                        fill="#98A2B3" />
                                </svg>
                            )}
                            </button>
                        </div>
                    </div>
                    <Link className="block text-xs text-white/50 m-1.5 hover:text-white/90 transition-colors">
                        Forgot Password?
                    </Link>
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

                    {/* Login with Orther.... */}
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
                        <Link to="/register" className="text-white font-semibold hover:text-rose-300 transition-colors">
                            Register for free
                        </Link>
                    </p>
                </form >
            </div >
        </>
    );
}