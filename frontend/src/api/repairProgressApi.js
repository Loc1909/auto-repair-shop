import { api } from "./axiosClient";

export const repairProgressAPI = {
    getProgressById: (id) => api.get(`/repair-progress/by-order/${id}`),
};