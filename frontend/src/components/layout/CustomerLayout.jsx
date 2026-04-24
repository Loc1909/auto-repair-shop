import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";

import TopNav from "../../components/layout/TopNav";
import AuthNav from "../../components/layout/AuthNav";
import Toast from "../../components/ui/Toast";
import "../../styles/customer.css";
import { logout } from "../../api/authApi";

export default function CustomerLayout() {
  const [user, setUser] = useState(null);
  const [toast, setToast] = useState(null);

  const location = useLocation();

  const showToast = (msg, type = "success") =>
    setToast({ msg, type, id: Date.now() });

  // xác định đang ở auth hay dashboard
  const isAuthPage = ["/login", "/register", "/forgot"].includes(location.pathname);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);
  return (
    <>
      <div style={{ minHeight: "100vh", background: "#0f172a" }}>
        {toast && (
          <Toast
            key={toast.id}
            msg={toast.msg}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}

        {isAuthPage ? (
          <AuthNav />
        ) : (
          <TopNav user={user} onLogout={() => {setUser(null); logout();}} />
        )}

        {/* render page con */}
        <Outlet context={{ user, setUser, showToast }} />
      </div>
    </>
  );
}