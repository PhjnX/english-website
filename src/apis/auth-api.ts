// src/apis/auth.api.ts
import axios from "axios";

const BASE_URL = "http://localhost:8080";

export const loginApi = async (data: { identifier: string; password: string }) => {
  const res = await axios.post(`${BASE_URL}/auth/login`, data);
  return res.data;
};


export const getUserInfo = async (token: string) => {
  const res = await axios.get(`${BASE_URL}/auth/get-info`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};
