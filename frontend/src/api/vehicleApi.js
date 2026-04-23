import { api } from "./axiosClient";

export const getVehicle = (id) => {
  return api.get(`/vehicles/${id}`);
};

export const createVehicle = (data) => {
  return api.post(`/vehicles`,data);
};

export const getCurrentUserVehicle = () => {
  return api.get("/vehicles/my-vehicles");
};