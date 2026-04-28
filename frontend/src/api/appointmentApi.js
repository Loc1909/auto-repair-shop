import { api } from "./axiosClient";

export const makeAppointment = (data) => {
    return api.post(`/appointments`, data);
};

export const getCurrentUserAppointments = () => {
    return api.get(`/appointments/me`);
};

export const getAllAppointments = () => {
    return api.get(`/appointments`);
};

export const confirmAppointmentByEmployee = (id, employeeId) => {
    return api.patch(`/appointments/${id}/confirm-by-employee?employeeId=${employeeId}`);
};

export const cancelAppointmentByEmployee = (id, data) => {
    return api.patch(`/appointments/${id}/cancel-by-employee`, data);
};