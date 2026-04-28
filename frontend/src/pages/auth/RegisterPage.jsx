import { useState, useRef } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import Logo from "../../components/common/Logo";
import BackgroundOrbs from "../../components/effects/BackgroundOrbs";
import "../../styles/auth.css";
import "../../styles/global.css"
import { FiEye, FiEyeOff } from "react-icons/fi";
import { login, register, storeLoginToken } from "../../api/authApi";
import { createVehicle } from "../../api/vehicleApi";
import { getCustomerByUserId } from "../../api/customerApi";
import RegisterForm from "../../components/auth/RegisterForm";
import OtpVerification from "../../components/auth/OtpVerification";
import VehicleRegistration from "../../components/auth/VehicleRegistration";
import RegistrationSuccess from "../../components/auth/RegistrationSuccess";

const C = {
  bg: "#0D0D14", bgCard: "rgba(255,255,255,0.04)",
  border: "rgba(255,255,255,0.07)",
  orange: "#FF6B2B", orangeLight: "#FF8C5A",
  text: "#F0F0F8", textSub: "#A0A0B8", textMuted: "#5A5A7A",
  green: "#4ADAA0",
};

export default function RegisterPage() {
  const navigate = useNavigate();
  const { setUser, showToast } = useOutletContext();

  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    username: "", email: "",
    name: "", phone: "", address: "",
    password: "", confirm: ""
  });
  const [vehicleForm, setVehicleForm] = useState({
    plate: "", brand: "", model: "", year: "", customerId: ""
  });
  const [userId, setUserId] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const otpRefs = useRef([]);

  const upd = k => e => setForm(f => ({ ...f, [k]: e.target.value }));
  const updateVehicleFrom = k => e => setVehicleForm(f => ({ ...f, [k]: e.target.value }));

  const steps = ["Thông tin", "Xác thực OTP", "Thêm xe", "Hoàn tất"];

  const handleOtp = (i, v) => {
    if (!/^\d?$/.test(v)) return;
    const n = [...otp]; n[i] = v; setOtp(n);
    if (v && i < 5) otpRefs.current[i + 1]?.focus();
  };
  const validateForm = () => {
    if (!form.name.trim()) {
      showToast('Họ và Tên không được để trống', "error");
      return false;
    }
    if (form.name.trim().length < 4) {
      showToast('Tên không hợp lệ', "error");
      return false;
    }
    if (!form.username.trim()) {
      showToast('Username không được để trống', "error");
      return false;
    }
    if (form.username.includes(' ')) {
      showToast('Username không được có khoảng trống', "error");
      return false;
    }
    if (!form.email.trim()) {
      showToast('Email không được để trống', "error");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      showToast('Vui lòng nhập đúng định dạng email', "error");
      return false;
    }
    if (form.password.length < 8) {
      showToast('Mật khẩu tối thiểu phải 8 ký tự', "error");
      return false;
    }
    if (form.password !== form.confirm) {
      showToast('Mật khẩu không khớp', "error");
      return false;
    }
    return true;
  };

  const validateVehicleForm = () => {
    if (!vehicleForm.plate?.trim()) {
      showToast("Biển số xe không được để trống", "error");
      return false;
    }
    const plateRegex = /^[0-9]{2}[A-Z]-?[0-9]{4,5}$/;
    if (!plateRegex.test(vehicleForm.plate.trim())) {
      showToast("Biển số xe không hợp lệ (VD: 59A-12345)", "error");
      return false;
    }
    if (!vehicleForm.brand?.trim()) {
      showToast("Hãng xe không được để trống", "error");
      return false;
    }
    if (!vehicleForm.model?.trim()) {
      showToast("Model không được để trống", "error");
      return false;
    }

    if (!vehicleForm.year) {
      showToast("Năm sản xuất không được để trống", "error");
      return false;
    }

    const currentYear = new Date().getFullYear();
    if (isNaN(vehicleForm.year) || vehicleForm.year < 1950 || vehicleForm.year > currentYear) {
      showToast(`Năm sản xuất phải từ 1950 đến ${currentYear}`, "error");
      return false;
    }
    return true;
  };
  const isVehicleFormEmpty = () => {
    return !vehicleForm.plate.trim() &&
      !vehicleForm.brand.trim() &&
      !vehicleForm.model.trim() &&
      !vehicleForm.year;
  };
  const next = async () => {
    if (step === 0) {
      if (!validateForm()) {
        return;
      }
      try {
        await handleRegister();
        setTimeout(() => {
          setLoading(false);
          setStep(1);
          showToast("Đã gửi OTP đến " + form.phone, "info");
        }, 1000);
      } catch (err) {
        showToast("Lỗi tạo tài khoản", "error");
      } finally {
        setLoading(false);
      }
    } else if (step === 1) {
      if (otp.join("").length < 6) {
        showToast("Nhập đủ 6 chữ số OTP", "error"); return;
      }
      try {
        setLoading(true);
        const res = await login({ emailOrUsername: form.username, password: form.password });
        setUser(res.data.user);
        storeLoginToken(res.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
        setStep(2);
      }
    } else if (step === 2) {
      if (isVehicleFormEmpty()) {
        setStep(3);
        return;
      }
      if (!validateVehicleForm()) return;
      try {
        await handleVehicleRegister();
        setStep(3);
      } catch (err) {
        showToast("Lỗi khi đăng ký xe", "error");
      } finally {
        setLoading(false);
      }
    }
  };

  const finish = () => {
    setLoading(true);
    setTimeout(() => {
      showToast("Đăng ký thành công! Chào mừng đến AutoPro 🎉", "success");
      navigate("/dashboard");
    }, 1500);
  };

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleRegister = async () => {
    setLoading(true);
    try {
      const res = await register({
        username: form.username,
        email: form.email,
        password: form.password,
        customer: {
          name: form?.username || "",
          phone: form?.phone || "",
          address: form?.address || "",
        }
      });
      setUserId(res.data.id);
      showToast("Đăng ký thành công!", "success");
    } catch (err) {
      showToast("Đăng ký thất bại", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleVehicleRegister = async () => {
    setLoading(true);

    try {
      const customerRes = await getCustomerByUserId(userId);
      const res = await createVehicle({
        licensePlate: vehicleForm.plate,
        brand: vehicleForm.brand,
        model: vehicleForm.model,
        year: vehicleForm.year,
        customerId: customerRes.data.id
      });
      setVehicleForm({
        plate: "", brand: "",
        model: "", year: "", customerId: ""
      });
    } catch (err) {
      showToast("Đăng ký xe thất bại", "error");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div style={{ backgroundColor: "rgba(13,13,20,.92)", minHeight: "100vh", padding: "6rem 1rem 3rem", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
      <BackgroundOrbs />
      <div style={{ width: "100%", maxWidth: 500, position: "relative", zIndex: 1, animation: "fadeUp .6s ease" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h1 className="gradient-text-white" style={{ fontFamily: "'Kanit',sans-serif", fontWeight: 800, fontSize: "1.8rem", letterSpacing: "-1px", marginTop: "2rem", marginBottom: ".4rem" }}>
            Tạo Tài Khoản
          </h1>
          <p style={{ color: C.textSub, fontSize: ".88rem", fontWeight: 300 }}>
            {steps[step]} — Bước {step + 1}/{steps.length}
          </p>
        </div>

        {/* Step indicators */}
        <div style={{ display: "flex", gap: ".5rem", marginBottom: "2rem", justifyContent: "center" }}>
          {steps.map((s, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: ".4rem" }}>
              <div style={{
                width: 32, height: 32, borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: ".8rem", fontWeight: 700,
                background: i < step ? "linear-gradient(135deg,#FF6B2B,#FF3B00)" : i === step ? "rgba(255,107,43,.2)" : "rgba(255,255,255,.06)",
                border: i === step ? "1.5px solid rgba(255,107,43,.5)" : "1.5px solid transparent",
                color: i < step ? "#fff" : i === step ? C.orange : C.textMuted,
                transition: "all .4s"
              }}>
                {i < step ? "✓" : (i + 1)}
              </div>
              {i < steps.length - 1 && (
                <div style={{ width: 30, height: 2, background: i < step ? "#FF6B2B" : "rgba(255,255,255,.08)", borderRadius: 1, transition: "background .4s" }} />
              )}
            </div>
          ))}
        </div>

        {/* Card */}
        <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 24, padding: "2.5rem", backdropFilter: "blur(20px)" }}>

          {/* Step 0: Thông tin */}
          {step === 0 && <RegisterForm form={form} setForm={setForm} upd={upd} toggleShowPassword={toggleShowPassword} showPassword={showPassword} />}
          {/* Step 1: OTP */}
          {step === 1 && <OtpVerification otp={otp} handleOtp={handleOtp} otpRefs={otpRefs} />}
          {/* Step 2: Thêm xe */}
          {step === 2 && <VehicleRegistration vehicleForm={vehicleForm} setVehicleForm={setVehicleForm} updateVehicleFrom={updateVehicleFrom} />}
          {/* Step 3: Hoàn tất */}
          {step === 3 && <RegistrationSuccess form={form} finish={finish} loading={loading} />}

          {step < 3 && (
            <button className="btn-p" onClick={next} disabled={loading}
              style={{ width: "100%", marginTop: "1.5rem", padding: "1rem" }}>
              {loading ? "Đang xử lý..." : step === 2 ? "Bỏ qua & Hoàn tất →" : "Tiếp Theo →"}
            </button>
          )}
        </div>

        {/* Footer link */}
        {step === 0 && (
          <p style={{ textAlign: "center", marginTop: "1.5rem", color: C.textMuted, fontSize: ".88rem" }}>
            Đã có tài khoản?{" "}
            <button onClick={() => navigate("/login")}
              style={{ background: "none", border: "none", color: C.orangeLight, cursor: "pointer", fontWeight: 500, fontSize: ".88rem" }}>
              Đăng nhập
            </button>
          </p>
        )}
      </div>
    </div>
  );
}