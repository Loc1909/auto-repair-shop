import { api } from "./axiosClient";

export const repairOrderAPI = {
    getMine: () => api.get("/repair-orders/mine"),
    getMineById: (id) => api.get(`/repair-orders/mine/${id}`),
    getRepairOrderByAppointmentId: (id) => api.get(`/repair-orders/by-appointment/${id}`),
    getByEmployee: (employeeId) => api.get(`/repair-orders/employee/${employeeId}`),
    receiveVehicle: (data) => api.post("/repair-orders/receive", data),
    completeRepair: (id, data) => api.put(`/repair-orders/${id}/complete`, data)
};