import { useState, useEffect } from "react";
import { C } from "../../constants/colors";
import { reviewAPI } from "../../api/reviewApi";
import ReviewForm from "./ReviewForm";
import LoadingState from "../ui/LoadingState";

export default function ReviewModal({
  appointment, repairOrder, quotation,
  isOpen, onClose, onSuccess, isRepairOrderCompleted,
}) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [duplicateReview, setDuplicateReview] = useState(false);

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!isRepairOrderCompleted) {
      return;
    }
    if (!repairOrder?.id) {
      setError("Không tìm thấy đơn sửa chữa");
      return;
    }
    if (rating === 0) {
      setError("Vui lòng chọn mức đánh giá");
      return;
    }
    if (comment.trim().length === 0) {
      setError("Vui lòng viết nhận xét");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      await reviewAPI.createReview({
        repairOrderId: repairOrder.id,
        rating: rating,
        comment: comment,
      });

      setSuccess(true);
      setSubmitting(false);
      setTimeout(() => {
        handleClose();
        onSuccess?.();
      }, 1300);
    } catch (err) {
      const detail = err.response?.data?.detail || "";
      if (detail.includes("already reviewed")) {
        setError("Bạn đã đánh giá đơn này rồi");
        setDuplicateReview(true);
        setSubmitting(false);
        setTimeout(() => handleClose(), 1300);
      } else {
        setError("Gửi đánh giá thất bại");
      }
      console.error("Lỗi khi gửi đánh giá:", err);
    }
  };

  const handleClose = () => {
    setRating(0);
    setComment("");
    setError(null);
    setSuccess(false);
    setDuplicateReview(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={handleClose}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0,0,0,0.8)",
          zIndex: 999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "1rem",
        }}
      >
        {/* Modal */}
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            background: C.bgCard,
            borderRadius: 12,
            border: `1px solid ${C.border}`,
            maxWidth: 500,
            marginTop: "2rem",
            width: "100%",
            maxHeight: "90vh",
            overflow: "auto",
            boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
            animation: "slideUp 0.3s ease",
          }}
        >
          {/* Content */}
          <div style={{ padding: "2rem" }}>
            {/* Header */}
            <h3
              className="gradient-text-red"
              style={{
                fontFamily: "'Kanit',sans-serif",
                fontWeight: 800,
                fontSize: "1.3rem",
                marginBottom: "1rem",
              }}
            >
              Đánh giá dịch vụ
            </h3>

            {/* Success message */}
            {success && (
              <div
                style={{
                  background: "rgba(76, 175, 80, 0.1)",
                  border: "1px solid #4CAF50",
                  borderRadius: 8,
                  padding: "1rem",
                  textAlign: "center",
                  color: "#4CAF50",
                  marginBottom: "1rem",
                }}
              >
                <p style={{ fontWeight: 600, fontSize: "1.1rem" }}>
                  Cảm ơn bạn đã đánh giá!
                </p>
              </div>
            )}

            {/* Duplicate Review message */}
            {duplicateReview && (
              <div
                style={{
                  background: "rgba(244, 67, 54, 0.1)",
                  border: "1px solid #F44336",
                  borderRadius: 8,
                  padding: "1rem",
                  textAlign: "center",
                  color: "#F44336",
                  marginBottom: "1rem",
                }}
              >
                <p style={{ fontWeight: 600, fontSize: "1.1rem" }}>
                  Bạn đã đánh giá lịch hẹn này rồi!
                </p>
              </div>
            )}

            {/* Error message */}
            {error && !success && !duplicateReview && (
              <div
                style={{
                  background: "rgba(244, 67, 54, 0.1)",
                  border: "1px solid #F44336",
                  borderRadius: 8,
                  padding: ".8rem",
                  color: "#F44336",
                  marginBottom: "1rem",
                  fontSize: ".85rem",
                }}
              >
                <strong>❌</strong> {error}
              </div>
            )}

            {!success && !duplicateReview && (
              <>
                {!repairOrder ? (
                  <LoadingState />
                ) : !isRepairOrderCompleted ? (
                  <div
                    style={{
                      background: "rgba(244, 67, 54, 0.1)",
                      border: "1px solid #F44336",
                      borderRadius: 8,
                      padding: "1rem",
                      textAlign: "center",
                      color: "#F44336",
                    }}
                  >
                    <p style={{ fontWeight: 600, fontSize: "1.1rem" }}>
                      🚫 Không thể đánh giá
                    </p>
                    <p style={{ fontSize: ".9rem" }}>
                      Đơn sửa chữa chưa hoàn thành.
                    </p>
                  </div>
                ) : (
                  <ReviewForm
                    rating={rating}
                    setRating={setRating}
                    hoverRating={hoverRating}
                    setHoverRating={setHoverRating}
                    comment={comment}
                    setComment={setComment}
                    submitting={submitting}
                    appointment={appointment}
                    repairOrder={repairOrder}
                    quotation={quotation}
                    onSubmit={handleSubmitReview}
                    onCancel={handleClose}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <style>{`@keyframes slideUp {
        from {
          opacity: 0;
          transform: translateY(30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }`}</style>
    </>
  );
}