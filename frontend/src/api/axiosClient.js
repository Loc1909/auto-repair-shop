import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:8080/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: 'application/json'
  },
});

// Thêm Interceptor để tự động gắn Token vào mọi request
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken"); 

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Thêm Interceptor để xử lý lỗi Global (ví dụ 401 thì logout)
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn("Token hết hạn hoặc không hợp lệ, vui lòng đăng nhập lại.");
      // Tùy chọn: localStorage.clear(); window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
export const api = axiosClient; // Để các file đang import { api } không bị lỗi