import { useState, useEffect } from "react";
import { socket, connectSocket, disconnectSocket } from "../api/socket";
import { employeeAPI } from "../api/employeeApi";
import { repairProgressAPI } from "../api/repairProgressApi";
import { quotationAPI } from "../api/quotationApi";
import { getByRepairOrder } from "../api/partRequestApi";

export const useEmployeeRepairProgress = (id) => {
    const [progresses, setProgresses] = useState([]);
    const [partRequests, setPartRequests] = useState([]);
    const [parts, setParts] = useState([]);
    const [services, setServices] = useState([]);
    const [quotations, setQuotations] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [progRes, reqRes, partsRes, servicesRes] = await Promise.all([
                repairProgressAPI.getProgressById(id),
                getByRepairOrder(id),
                employeeAPI.getParts(),
                employeeAPI.getServices()
            ]);
            setProgresses(progRes.data);
            setPartRequests(reqRes.data);
            setParts(partsRes.data || []);
            setServices(servicesRes.data || []);

            try {
                const quotRes = await quotationAPI.getQuotationById(id);
                setQuotations(quotRes.data || []);
            } catch {
                setQuotations([]);
            }
        } catch (error) {
            console.error("Lỗi khi tải dữ liệu chi tiết phiếu sửa chữa", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!id) return;

        fetchData();

        connectSocket();

        // Tham gia phòng của đơn hàng này để chỉ nhận sự kiện liên quan
        socket.emit("join_order", String(id));

        socket.on("repair_progress_updated", (newProgress) => {
            setProgresses(prev => {
                if (prev.find(p => p.id === newProgress.id)) return prev;
                return [newProgress, ...prev];
            });
        });

        return () => {
            // Rời phòng và hủy lắng nghe khi rời trang
            socket.emit("leave_order", String(id));
            socket.off("repair_progress_updated");
            disconnectSocket();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    return {
        progresses,
        partRequests,
        parts,
        services,
        quotations,
        loading,
        fetchData
    };
};
