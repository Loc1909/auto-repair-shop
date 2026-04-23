import { api } from "./axiosClient";

export const makeAppointment = (data) => {
    return api.post(`/appointments`, data);
};