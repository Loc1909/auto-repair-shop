import { useState, useEffect } from "react";
import { employeeAPI } from "../api/employeeApi";

export const useEmployeeSchedule = () => {
    const [scheduleData, setScheduleData] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchSchedule = async () => {
        const user = JSON.parse(localStorage.getItem("user"));
        const employeeId = user?.employeeId;

        if (!employeeId) {
            console.error("Không tìm thấy Employee ID");
            setLoading(false);
            return;
        }

        try {
            const response = await employeeAPI.getSchedule(employeeId);
            setScheduleData(response.data);
        } catch (error) {
            console.error("Lỗi khi tải lịch làm việc", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSchedule();
    }, []);

    return { scheduleData, loading, fetchSchedule };
};
