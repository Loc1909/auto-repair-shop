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
            const getLatestQuotation = (quotations) => {
                if (!quotations || quotations.length === 0) return null;

                return quotations.reduce((latest, current) => {
                    return new Date(current.createdAt) > new Date(latest.createdAt)
                        ? current
                        : latest;
                });
            };
            const fetchData = async () => {
                setLoading(true);
                try {
                    const [progressRes, quotationRes] = await Promise.all([
                        repairProgressAPI.getProgressById(id),
                        quotationAPI.getQuotationById(id),
                    ]);

                    setRepairProgress(progressRes.data);

                    const latest = getLatestQuotation(quotationRes.data);
                    setQuotation(latest);
                } catch (error) {
                    console.error(error);
                } finally {
                    setLoading(false);
                }
            };

            fetchData();
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
