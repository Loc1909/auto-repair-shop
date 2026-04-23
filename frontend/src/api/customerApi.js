import { api } from "./axiosClient";

export const getCurrentCustomerInfo = () => {
  return api.get("/customers/me");
};

export const getCustomerByUserId = (id) => {
  return api.get(`/customers/user/${id}`);
};