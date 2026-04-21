import { api } from "./axiosClient";

export const login = (data) => {
  return api.post("/auth/login", data);
};

export const register = (data) => {
  return api.post("/auth/register", data);
};

export const storeLoginToken = (loginData) => {
  localStorage.setItem("accessToken", loginData.accessToken);
  localStorage.setItem("refreshToken", loginData.refreshToken);
  localStorage.setItem("user", JSON.stringify({
    id: loginData.user.id,
    username: loginData.user.username,
    email: loginData.user.email,
    role: loginData.user.role
  }));
};

export const logout = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
};