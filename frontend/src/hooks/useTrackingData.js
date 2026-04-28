import { useEffect, useState } from "react";
import { repairOrderAPI } from "../api/repairOrderApi";
import { repairProgressAPI } from "../api/repairProgressApi";
import { quotationAPI } from "../api/quotationApi";
import { socket, connectSocket, disconnectSocket } from "../api/socket";

// hooks/useTrackingData.js
export const useTrackingData = (id, initialOrder) => {
    const [order, setOrder] = useState(initialOrder || null);
    const [repairProgress, setRepairProgress] = useState([]);
    const [quotation, setQuotation] = useState(null);
    const [loading, setLoading] = useState(!initialOrder);

    // Fetch order nếu không có initialOrder
    useEffect(() => {
        if (!initialOrder) {
            const fetchOrder = async () => {
                try {
                    const response = await repairOrderAPI.getMineById(id);
                    setOrder(response.data);
                } catch (error) {
                    console.error("Lỗi khi lấy dữ liệu đơn sửa chữa:", error);
                }
            };
            fetchOrder();
        }
    }, [id, initialOrder]);

    // Fetch progress + quotation
    useEffect(() => {
        if (!id) return;

        if (id) {
            const fetchRepairProgress = async () => {
                try {
                    const response = await repairProgressAPI.getProgressById(id);
                    setRepairProgress(response.data);
                } catch (error) {
                    console.error("Lỗi khi lấy tiến độ sửa chữa:", error);
                } finally {
                    setLoading(false);
                }
            };

            const fetchQuotation = async () => {
                try {
                    const response = await quotationAPI.getQuotationById(id);
                    const quotations = response.data;
                    const latest = quotations?.[0];
                    setQuotation(latest);
                } catch (error) {
                    console.error("Không có dữ liệu báo giá:", error);
                } finally {
                    setLoading(false);
                }
            };

            fetchRepairProgress();
            fetchQuotation();
        }
    }, [id]);

    // Kết nối Socket.io để nhận cập nhật real-time
    useEffect(() => {
        if (!id) return;

        connectSocket();

        socket.on("repair_progress_updated", (newProgress) => {
            if (String(newProgress.repairOrderId) === String(id)) {
                setRepairProgress((prev) => {
                    // Tránh trùng lặp nếu socket gửi lại event đã có
                    if (prev.find((p) => p.id === newProgress.id)) return prev;
                    return [...prev, newProgress];
                });
            }
        });

        return () => {
            socket.off("repair_progress_updated");
            disconnectSocket();
        };
    }, [id]);

    return { order, repairProgress, quotation, loading, setQuotation };
};
