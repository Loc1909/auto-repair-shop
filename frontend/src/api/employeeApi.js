import { api } from "./axiosClient";

export const employeeAPI = {
    getSchedule: (employeeId) => api.get(`/staff/${employeeId}/schedule`),
    getParts: () => api.get(`/employee/parts`),
    getServices: () => api.get(`/employee/services`),
};
