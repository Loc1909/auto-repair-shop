import { useEffect, useState } from "react";
import { repairOrderAPI } from "../api/repairOrderApi";
import { repairProgressAPI } from "../api/repairProgressApi";
import { quotationAPI } from "../api/quotationApi";

// hooks/useTrackingData.js
export const useTrackingData = (id, initialOrder) => {
    const [order, setOrder] = useState(initialOrder || null);
    const [repairProgress, setRepairProgress] = useState([]);
    const [quotation, setQuotation] = useState(null);
    const [loading, setLoading] = useState(!initialOrder);

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

    useEffect(() => {
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

    return { order, repairProgress, quotation, loading, setQuotation };
};