import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useOutletContext } from "react-router-dom";
import BackgroundOrbs from "../../components/effects/BackgroundOrbs";
import { C } from "../../constants/colors";
import { repairOrderAPI } from "../../api/repairOrderApi";
import { quotationAPI } from "../../api/quotationApi";
import { fetchAllQuotations, getStatusConfigByKey } from "../../hooks/useQuotations";
import "../../styles/customer.css";
import QuotesList from "../../components/customer/QuotesList";

export default function QuotesPage() {
  const navigate = useNavigate();
  const { showToast } = useOutletContext();

  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeQuote, setActiveQuote] = useState(null);

  useEffect(() => {
    loadQuotations();
  }, []);

  const loadQuotations = async () => {
    try {
      setLoading(true);
      setError(null);
      const quotations = await fetchAllQuotations();
      setQuotes(quotations);
    } catch (err) {
      console.error("Error loading quotations:", err);
      setError(err.message || "Không thể tải báo giá. Vui lòng thử lại.");
      showToast("Lỗi: " + (err.message || "Không thể tải dữ liệu"), "error");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (quote) => {
    navigate(`/payment/${quote.repairOrderId}`);
  };

  const handleReject = async (quote) => {
    try {
      setLoading(true);
      await quotationAPI.rejectQuotation(quote.repairOrderId);
      showToast("Đã từ chối báo giá " + quote.id, "info");
      setActiveQuote(null);
      // thay bằng websocket
      await loadQuotations();
    } catch (err) {
      showToast("Lỗi từ chối báo giá: " + err.message, "error");
      console.error("Error rejecting quotation:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleQuote = (quote) => {
    setActiveQuote(activeQuote?.id === quote.id ? null : quote);
  };

  return (
    <div style={{ minHeight: "100vh", padding: "6rem 5% 3rem", position: "relative" }}>
      <BackgroundOrbs />
      <div style={{ maxWidth: 780, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <button className="btn-ghost" onClick={() => navigate("/dashboard")}>
          ← Quay lại
        </button>

        <h1
          className="gradient-text-white"
          style={{
            fontFamily: "'Kanit',sans-serif", fontWeight: 800,
            fontSize: "2rem", letterSpacing: "-1px", marginBottom: "2rem",
          }} >
          Duyệt báo giá online
        </h1>

        <QuotesList quotes={quotes} loading={loading}
          error={error} activeQuote={activeQuote}
          onToggle={toggleQuote} onApprove={handleApprove}
          onReject={handleReject} onRetry={loadQuotations} />
      </div>


      <style>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}