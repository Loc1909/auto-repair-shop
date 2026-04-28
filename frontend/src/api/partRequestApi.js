import { api } from "./axiosClient";

export const getPendingPartRequests = (search = "") => {
    let url = `/part-requests?status=PENDING`;
    if (search) {
        url += `&search=${search}`;
    }
    return api.get(url);
};

export const getAllPartRequests = (status = "") => {
    let url = `/part-requests`;
    if (status) {
        url += `?status=${status}`;
    }
    return api.get(url);
};

export const getByRepairOrder = (repairOrderId) => {
    return api.get(`/part-requests/by-order/${repairOrderId}`);
};

export const approvePartRequest = (id) => {
    return api.patch(`/part-requests/${id}/approve`);
};

export const rejectPartRequest = (id) => {
    return api.patch(`/part-requests/${id}/reject`);
};

export const createPartRequest = (data) => {
    return api.post("/part-requests", data);
};

export const getPartRequestById = (id) => {
    return api.get(`/part-requests/${id}`);
};
