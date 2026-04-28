import { C } from "../../constants/colors";
import { formatPrice } from "../../utils/utils";

export default function ReviewForm({
    rating, setRating, hoverRating, setHoverRating, comment, setComment,
    submitting, appointment, repairOrder, quotation, onSubmit, onCancel,
}) {
    return (
        <form onSubmit={onSubmit}>
            {/* Service Info */}
            {appointment && (
                <div
                    style={{
                        background: `${C.orange}10`, border: `1px solid ${C.orange}20`, borderRadius: 8,
                        padding: "1rem", marginBottom: "1.5rem", fontSize: ".85rem",
                    }}
                >
                    <p style={{ color: C.text, fontWeight: 500 }}>
                        Ghi chú lịch hẹn: {appointment.note}
                    </p>
                    {repairOrder?.vehicleId && (
                        <>
                            <p
                                style={{ color: C.text, fontWeight: 500, marginBottom: ".2rem", }}
                            >
                                Ghi chú sửa chữa: {repairOrder.notes}
                            </p>
                            <p style={{ color: C.textSub, fontSize: ".8rem" }}>
                                <strong>
                                    {repairOrder.vehicleBrand} - {repairOrder.vehicleModel} -{" "}
                                    {repairOrder.vehicleLicensePlate}
                                </strong>
                            </p>
                        </>
                    )}
                    {quotation?.totalPrice && (
                        <p style={{ color: C.orange, fontSize: ".8rem", fontWeight: 600 }}>
                            Chi phí sửa chữa: {formatPrice(quotation.totalPrice)}
                        </p>
                    )}
                </div>
            )}

            {/* Star Rating */}
            <div style={{ marginBottom: "1.5rem" }}>
                <label
                    style={{
                        display: "block", marginBottom: ".6rem",
                        fontWeight: 600, color: C.text, fontSize: ".9rem",
                    }}
                >
                    Mức độ hài lòng <span style={{ color: C.orange }}>*</span>
                </label>

                <div
                    style={{
                        display: "flex", gap: ".8rem",
                        fontSize: "2rem", justifyContent: "center",
                    }}
                >
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            style={{
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                color:
                                    (hoverRating || rating) >= star ? C.orange : "#3A3A5A",
                                transition: "all .2s",
                                transform:
                                    (hoverRating || rating) >= star
                                        ? "scale(1.15)"
                                        : "scale(1)",
                            }}
                        >
                            ★
                        </button>
                    ))}
                </div>

                {/* Rating text */}
                <p
                    style={{
                        textAlign: "center", marginTop: ".6rem",
                        fontSize: ".85rem", color: C.textMuted,
                    }}
                >
                    {rating === 0 && "Chưa chọn"}
                    {rating === 1 && "😞 Không hài lòng"}
                    {rating === 2 && "😕 Tạm ổn"}
                    {rating === 3 && "😐 Bình thường"}
                    {rating === 4 && "😊 Tốt"}
                    {rating === 5 && "😍 Rất tốt"}
                </p>
            </div>

            {/* Comment */}
            <div style={{ marginBottom: "1.5rem" }}>
                <label
                    style={{
                        display: "block", marginBottom: ".6rem",
                        fontWeight: 600, color: C.text, fontSize: ".9rem",
                    }}
                >
                    Nhận xét <span style={{ color: C.orange }}>*</span>
                </label>
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value.slice(0, 200))}
                    placeholder="Chia sẻ ý kiến của bạn..."
                    style={{
                        width: "100%", minHeight: "100px",
                        padding: ".8rem", border: `1px solid ${C.border}`,
                        borderRadius: 8, background: C.bgCard,
                        color: C.text, fontFamily: "inherit",
                        fontSize: ".9rem", resize: "vertical",
                        outline: "none", transition: "all .2s",
                    }}
                    onFocus={(e) => {
                        e.target.style.borderColor = C.orange;
                        e.target.style.boxShadow = `0 0 0 3px ${C.orange}20`;
                    }}
                    onBlur={(e) => {
                        e.target.style.borderColor = C.border;
                        e.target.style.boxShadow = "none";
                    }}
                />

                <p style={{ fontSize: ".85rem", color: C.textMuted, marginTop: ".3rem", }} >
                    {comment.length}/200
                </p>
            </div>

            {/* Buttons */}
            <div style={{ display: "flex", gap: ".8rem" }}>
                {/* Submit */}
                <button
                    type="submit"
                    disabled={submitting}
                    style={{
                        flex: 1, padding: ".8rem", background: C.orange,
                        color: "white", border: "none",
                        borderRadius: 8, fontWeight: 700,
                        fontSize: ".9rem", cursor: submitting ? "not-allowed" : "pointer",
                        transition: "all .3s", opacity: submitting ? 0.7 : 1,
                    }}
                    onMouseEnter={(e) => {
                        if (!submitting) {
                            e.target.style.transform = "translateY(-2px)";
                            e.target.style.boxShadow = `0 6px 20px ${C.orange}40`;
                        }
                    }}
                    onMouseLeave={(e) => {
                        if (!submitting) {
                            e.target.style.transform = "translateY(0)";
                            e.target.style.boxShadow = "none";
                        }
                    }}
                >
                    {submitting ? "⏳ Đang gửi..." : "Gửi đánh giá"}
                </button>

                {/* Cancel */}
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={submitting}
                    style={{
                        flex: 1, padding: ".8rem", background: "none",
                        color: C.textMuted, border: `1px solid ${C.border}`,
                        borderRadius: 8, fontWeight: 600,
                        fontSize: ".9rem", cursor: submitting ? "not-allowed" : "pointer",
                        transition: "all .2s", opacity: submitting ? 0.5 : 1,
                    }}
                    onMouseEnter={(e) => {
                        if (!submitting) {
                            e.target.style.color = C.text;
                            e.target.style.borderColor = C.text;
                        }
                    }}
                    onMouseLeave={(e) => {
                        if (!submitting) {
                            e.target.style.color = C.textMuted;
                            e.target.style.borderColor = C.border;
                        }
                    }}
                >
                    Hủy
                </button>
            </div>
        </form>
    );
}