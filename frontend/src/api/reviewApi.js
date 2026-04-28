import { api } from "./axiosClient";

export const reviewAPI = {
    getReviewById: (id) => api.get(`/reviews/repair-orders/${id}`),
    createReview: (data) => api.post(`/reviews`, data),
    getServiceRating: (id) => api.get(`/reviews/service-rating/${id}`),
    getMyReviews: () => api.get(`/reviews/me`)
};