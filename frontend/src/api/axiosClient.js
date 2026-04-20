import axios from "axios";

const axiosClient = axios.create({
  // baseURL: "https://r7c31fdx-8080.asse.devtunnels.ms/api", 
  baseURL: "http://localhost:8080/api", 
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosClient;

export const api = axios.create({
  baseURL: "http://localhost:8080/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: 'application/json'
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken"); 

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);