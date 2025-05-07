// src/apis/user-api.ts
import axios from "axios";

const BASE_URL = "http://localhost:8080";

// 🟢 Lấy danh sách toàn bộ người dùng
export const getAllUsers = async () => {
  const token = localStorage.getItem("token");
  const response = await axios.get(`${BASE_URL}/user`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// 🟢 Thêm người dùng mới (chỉ dành cho Admin)
export const createUserApi = async (data: any) => {
  const token = localStorage.getItem("token");
  return await axios.post(`${BASE_URL}/user`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// 🟡 Cập nhật người dùng theo ID
export const updateUserApi = async (id: number, data: any) => {
  const token = localStorage.getItem("token");
  return await axios.put(`${BASE_URL}/user/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// 🔴 Xoá người dùng theo ID
export const deleteUserApi = async (userId: number) => {
  const token = localStorage.getItem("token");
  return await axios.delete(`${BASE_URL}/user/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
