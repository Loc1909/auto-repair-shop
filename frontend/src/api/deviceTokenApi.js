import { api } from "./axiosClient";

export const deviceTokenAPI = {
  saveToken: (data) => api.post("/device-token", data),
};
