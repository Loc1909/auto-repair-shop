import { api } from "./axiosClient";

export const makeAppointment = (data) => {
    return api.post(`/appointments`, data);
};

export const getCurrentUserAppointments = () => {
    return api.get(`/appointments/me`);
};