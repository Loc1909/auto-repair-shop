import { api } from "./axiosClient";

export const repairOrderAPI = {
    getMine: () => api.get("/repair-orders/mine"),
    getMineById: (id) => api.get(`/repair-orders/mine/${id}`),
};