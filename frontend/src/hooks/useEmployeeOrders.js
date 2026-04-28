import { useState, useEffect } from "react";
import { repairOrderAPI } from "../api/repairOrderApi";
import { getAllAppointments } from "../api/appointmentApi";
import { getCurrentEmployeeId } from "../utils/auth";

export const useEmployeeOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    // Dialog Tiếp nhận xe
    const [receiveOpen, setReceiveOpen] = useState(false);
    const [confirmedAppointments, setConfirmedAppointments] = useState([]);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [receiveNotes, setReceiveNotes] = useState("");

    // Dialog Hoàn thành
    const [completeOpen, setCompleteOpen] = useState(false);
    const [completeId, setCompleteId] = useState(null);
    const [completeNotes, setCompleteNotes] = useState("");

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        const employeeId = getCurrentEmployeeId();

        if (!employeeId) {
            console.error("Không tìm thấy Employee ID");
            setLoading(false);
            return;
        }

        try {
            const response = await repairOrderAPI.getByEmployee(employeeId);
            setOrders(response.data);
        } catch (error) {
            console.error("Lỗi khi tải phiếu sửa chữa", error);
        } finally {
            setLoading(false);
        }
    };

    const openReceiveDialog = async () => {
        try {
            const response = await getAllAppointments();
            const confirmed = response.data.filter((apt) => apt.status === "CONFIRMED");
            setConfirmedAppointments(confirmed);
        } catch (error) {
            console.error("Lỗi khi tải danh sách lịch hẹn", error);
        }
        setSelectedAppointment(null);
        setReceiveNotes("");
        setReceiveOpen(true);
    };

    const handleReceiveVehicle = async () => {
        if (!selectedAppointment) {
            alert("Vui lòng chọn lịch hẹn");
            return;
        }
        try {
            const employeeId = getCurrentEmployeeId();

            await repairOrderAPI.receiveVehicle({
                appointmentId: selectedAppointment.id,
                employeeId: employeeId,
                notes: receiveNotes
            });
            setReceiveOpen(false);
            setSelectedAppointment(null);
            setReceiveNotes("");
            fetchOrders();
        } catch (error) {
            console.error("Lỗi khi tiếp nhận xe", error);
            alert("Tiếp nhận xe thất bại!");
        }
    };

    const openCompleteDialog = (id) => {
        setCompleteId(id);
        setCompleteNotes("");
        setCompleteOpen(true);
    };

    const handleCompleteOrder = async () => {
        try {
            await repairOrderAPI.completeRepair(completeId, {
                notes: completeNotes
            });
            setCompleteOpen(false);
            fetchOrders();
        } catch (error) {
            console.error("Lỗi khi hoàn thành phiếu", error);
            alert("Hoàn thành thất bại!");
        }
    };

    return {
        orders,
        loading,
        receiveOpen,
        confirmedAppointments,
        selectedAppointment,
        receiveNotes,
        completeOpen,
        completeNotes,
        setReceiveOpen,
        setSelectedAppointment,
        setReceiveNotes,
        setCompleteOpen,
        setCompleteNotes,
        openReceiveDialog,
        handleReceiveVehicle,
        openCompleteDialog,
        handleCompleteOrder
    };
};
