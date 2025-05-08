// src/apis/auth-api.ts
import axios from "axios";

const BASE_URL = "http://localhost:8080";

// 🟢 Login dùng cho cả user và admin
export const loginApi = async (identifier: string, password: string) => {
  const res = await axios.post(`${BASE_URL}/auth/login`, {
    identifier,
    password,
  });
  return res.data;
};

// 🟢 Đăng ký chỉ dùng cho user
// 🟢 Đăng ký
export const signupApi = async (data: {
  email: string;
  password: string;
  user_name: string;
  full_name?: string;
  phone_number?: string;
  role?: string;
}) => {
  const res = await axios.post(`${BASE_URL}/auth/signup`, data);
  return res.data;
};


// 🟢 Lấy thông tin người dùng qua token
export const getUserInfo = async (token: string) => {
  const res = await axios.get(`${BASE_URL}/auth/get-info`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

// 🟡 Logout
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user_name");
};
