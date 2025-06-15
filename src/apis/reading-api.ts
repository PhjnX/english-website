import axios from "axios";

// Nếu cần, chỉnh lại baseURL cho API của bạn
const BASE_URL = "https://nestjs-english-website-production.up.railway.app"; // Sửa thành endpoint backend của bạn nếu khác

// Helper function cho mọi request
const http = axios.create({
  baseURL: BASE_URL,
});

// Reading Test
export const getAllReadingTests = async () => {
  const res = await http.get("/reading");
  return res.data;
};

export const createReadingTest = async (data: any) => {
  const res = await http.post("/reading", data);
  return res.data;
};

export const updateReadingTest = async (id: number, data: any) => {
  const res = await http.put(`/reading/${id}`, data);
  return res.data;
};

export const deleteReadingTest = async (id: number) => {
  const res = await http.delete(`/reading/${id}`);
  return res.data;
};

// Reading Part
export const createReadingPart = async (readingTestId: number, data: any) => {
  const res = await http.post(`/reading/${readingTestId}/parts`, data);
  return res.data;
};

export const updateReadingPart = async (partId: number, data: any) => {
  const res = await http.put(`/reading/parts/${partId}`, data);
  return res.data;
};

export const deleteReadingPart = async (partId: number) => {
  const res = await http.delete(`/reading/parts/${partId}`);
  return res.data;
};

// Reading Group
export const createReadingGroup = async (partId: number, data: any) => {
  const res = await http.post(`/reading/parts/${partId}/groups`, data);
  return res.data;
};

export const updateReadingGroup = async (groupId: number, data: any) => {
  const res = await http.put(`/reading/groups/${groupId}`, data);
  return res.data;
};

export const deleteReadingGroup = async (groupId: number) => {
  const res = await http.delete(`/reading/groups/${groupId}`);
  return res.data;
};

// Reading Question
export const createReadingQuestion = async (groupId: number, data: any) => {
  const res = await http.post(`/reading/groups/${groupId}/questions`, data);
  return res.data;
};

export const updateReadingQuestion = async (questionId: number, data: any) => {
  const res = await http.put(`/reading/questions/${questionId}`, data);
  return res.data;
};

export const deleteReadingQuestion = async (questionId: number) => {
  const res = await http.delete(`/reading/questions/${questionId}`);
  return res.data;
};
