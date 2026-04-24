import { api } from "./axiosClient";

export const quotationAPI = {
    getQuotationById: (id) => api.get(`/quotations/by-order/${id}`),
    confirmQuotation: (id,action) =>api.put(`/quotations/repair-order/${id}?action=${action}`)
};