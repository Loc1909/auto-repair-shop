import { useState, useEffect } from "react";
import { getAllAppointments, confirmAppointmentByEmployee, cancelAppointmentByEmployee } from "../api/appointmentApi";
import { getCurrentEmployeeId } from "../utils/auth";

export const useEmployeeAppointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    const [cancelOpen, setCancelOpen] = useState(false);
    const [cancelId, setCancelId] = useState(null);
    const [cancelReason, setCancelReason] = useState("");

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            const response = await getAllAppointments();
            setAppointments(response.data);
        } catch (error) {
            console.error("Lỗi khi tải lịch hẹn", error);
        } finally {
            setLoading(false);
        }
    };

    const handleConfirm = async (id) => {
        try {
            const employeeId = getCurrentEmployeeId();
            await confirmAppointmentByEmployee(id, employeeId);
            fetchAppointments();
        } catch (error) {
            console.error("Lỗi khi xác nhận lịch hẹn", error);
            alert("Xác nhận thất bại!");
        }
    };

    const openCancelDialog = (id) => {
        setCancelId(id);
        setCancelReason("");
        setCancelOpen(true);
    };

    const handleCancelClick = async () => {
        try {
            await cancelAppointmentByEmployee(cancelId, {
                reason: cancelReason,
            });
            setCancelOpen(false);
            fetchAppointments();
        } catch (error) {
            console.error("Lỗi khi hủy lịch hẹn", error);
            alert("Hủy thất bại!");
        }
    };

    return {
        appointments,
        loading,
        cancelOpen,
        cancelReason,
        setCancelOpen,
        setCancelReason,
        handleConfirm,
        openCancelDialog,
        handleCancelClick
    };
};
