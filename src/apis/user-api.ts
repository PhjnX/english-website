// src/apis/user-api.ts
import axios from "axios";

const BASE_URL = "https://nestjs-english-website-production.up.railway.app";

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

// Gửi band và level cho user
export const updateUserBandLevel = async (
  userId: string | number,
  data: { band: string; level: string }
) => {
  const token = localStorage.getItem("token");
  console.log("DEBUG: Gửi PUT band/level", { userId, data });
  const res = await axios.put(`${BASE_URL}/user/${userId}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  console.log("DEBUG: Response update user:", res.data);
  return res.data;
};

// Lấy thông tin user theo id
export const getUserById = async (userId: string | number) => {
  const token = localStorage.getItem("token");
  const res = await axios.get(`${BASE_URL}/user/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data; // Trả về object user gồm band, level, ...
};
