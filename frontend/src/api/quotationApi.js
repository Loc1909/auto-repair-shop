import { api } from "./axiosClient";

export const quotationAPI = {
    getQuotationById: (id) => api.get(`/quotations/by-order/${id}`),
    confirmQuotation: (id,action) =>api.put(`/quotations/repair-order/${id}?action=${action}`),
    approveQuotation: (id) =>api.put(`/quotations/repair-order/${id}?action=APPROVE`),
    rejectQuotation: (id) =>api.put(`/quotations/repair-order/${id}?action=REJECT`),
    getMyQuotations: () => api.get(`/quotations/me`),
    createQuotation: (data) => api.post("/quotations", data),
};