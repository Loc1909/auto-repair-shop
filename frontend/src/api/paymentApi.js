import { api } from "./axiosClient";

export const paymentAPI = {
    createPayment: (data) => api.post("/payments", data),
};