import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:8080/api",
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