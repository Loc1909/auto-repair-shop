import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BackgroundOrbs from "../../components/effects/BackgroundOrbs";
import { C } from "../../constants/colors";
import "../../styles/customer.css";
import { getCurrentUserAppointments } from "../../api/appointmentApi";
import { getCurrentUserVehicle } from "../../api/vehicleApi";
import { repairOrderAPI } from "../../api/repairOrderApi";
import { quotationAPI } from "../../api/quotationApi";
import FilterTabs from "../../components/customer/FilterTabs";
import AppointmentTimeline from "../../components/customer/AppointmentTimeline";
import ReviewModal from "../../components/customer/ReviewModal";

export default function HistoryPage() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("all");
  const [vehicleData, setVehicleData] = useState([]);
  const [appointmentsData, setAppointmentsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Review Modal states
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [selectedRepairOrder, setSelectedRepairOrder] = useState(null);
  const [selectedQuotation, setSelectedQuotation] = useState(null);

  // Load data on mount
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load appointments & vehicles in parallel
      const [appointmentsRes, vehiclesRes] = await Promise.all([
        getCurrentUserAppointments(),
        getCurrentUserVehicle(),
      ]);

      setAppointmentsData(appointmentsRes.data);
      setVehicleData(vehiclesRes.data);
    } catch (err) {
      setError(err.message || "Không thể tải dữ liệu");
      console.error("Load data error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenReviewModal = async (appointment) => {
    try {
      // Lấy repair order & quotation trước khi mở modal
      const repairOrderRes = await repairOrderAPI.getRepairOrderByAppointmentId(
        appointment.id
      );

      if (!repairOrderRes.data) {
        console.error("Không tìm thấy đơn sửa chữa");
        return;
      }

      setSelectedRepairOrder(repairOrderRes.data);
      setSelectedAppointment(appointment);

      // Lấy quotation nếu có
      try {
        const quotationRes = await quotationAPI.getQuotationById(repairOrderRes.data.id);
        setSelectedQuotation(quotationRes.data[0] || null);
      } catch (err) {
        console.warn("Không tìm thấy báo giá:", err);
        setSelectedQuotation(null);
      }

      setReviewModalOpen(true);
    } catch (err) {
      console.error("Lỗi khi mở modal đánh giá:", err);
    }
  };

  const handleCloseReviewModal = () => {
    setReviewModalOpen(false);
    setSelectedAppointment(null);
    setSelectedRepairOrder(null);
    setSelectedQuotation(null);
  };

  const handleReviewSuccess = () => {
    // Reload data sau khi đánh giá thành công
    loadAllData();
  };

  // Build filter options
  const FILTERS = [
    ["all", "Tất cả"],
    ...vehicleData.map((vehicle) => [
      vehicle.licensePlate,
      `${vehicle.brand} ${vehicle.model} (${vehicle.licensePlate})`,
    ]),
  ];

  // Apply filter
  const filtered =
    filter === "all"
      ? appointmentsData
      : appointmentsData.filter((r) => r.vehicleName === filter);

  return (
    <>
      <div
        style={{
          minHeight: "100vh",
          padding: "6rem 5% 3rem",
          position: "relative",
        }}
      >
        <BackgroundOrbs />
        <div
          style={{
            maxWidth: 900,
            margin: "0 auto",
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* Back button */}
          <button
            className="btn-ghost"
            onClick={() => navigate("/dashboard")}
          >
            ← Quay lại
          </button>

          {/* Header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              marginBottom: "2rem",
              flexWrap: "wrap",
              gap: "1rem",
            }}
          >
            <h1
              className="gradient-text-white"
              style={{
                fontFamily: "'Kanit',sans-serif",
                fontWeight: 800,
                fontSize: "2rem",
                letterSpacing: "-1px",
              }}
            >
              Hồ sơ lịch sử xe
            </h1>

            {/* Filter tabs */}
            <FilterTabs
              filter={filter}
              setFilter={setFilter}
              filters={FILTERS}
            />
          </div>

          {/* Timeline */}
          <AppointmentTimeline
            appointments={filtered}
            loading={loading}
            error={error}
            onReview={handleOpenReviewModal}
            onRetry={loadAllData}
          />
        </div>
      </div>

      {/* Review Modal - dữ liệu được truyền từ parent */}
      <ReviewModal
        appointment={selectedAppointment}
        repairOrder={selectedRepairOrder}
        isRepairOrderCompleted={selectedRepairOrder?.status === "COMPLETED"}
        quotation={selectedQuotation}
        isOpen={reviewModalOpen}
        onClose={handleCloseReviewModal}
        onSuccess={handleReviewSuccess}
      />
    </>
  );
}