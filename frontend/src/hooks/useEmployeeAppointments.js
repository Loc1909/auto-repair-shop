import { useState, useEffect } from "react";
import { getAllAppointments, confirmAppointmentByEmployee, cancelAppointmentByEmployee } from "../api/appointmentApi";

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
            const user = JSON.parse(localStorage.getItem("user"));
            const employeeId = user?.employeeId;
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
