import axios from "axios";
import {
  mapBackendDataToFrontend,
  findReadingTestByLevelAndNumber,
} from "../pages/client-users/ReadingPracticePage/reading";

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

// Lấy chi tiết bài reading luyện tập theo level và số bài đọc (ví dụ readingNum là 1, 2, 3,...)
export const getReadingTestByLevelAndNumber = async (
  level: number | string,
  readingNum: number | string
) => {
  const token = localStorage.getItem("token");

  // Lấy tất cả reading tests từ endpoint /reading
  const res = await http.get("/reading", {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  const allTests = res.data;
  console.log("All tests from API:", allTests);

  // Tìm test theo level và reading number
  const targetTest = findReadingTestByLevelAndNumber(
    allTests,
    level,
    readingNum
  );

  if (!targetTest) {
    throw new Error(
      `Không tìm thấy bài reading Level ${level} - Reading ${readingNum}`
    );
  }
  // Map dữ liệu từ backend sang frontend format
  return mapBackendDataToFrontend(targetTest);
};

// Lấy chi tiết 1 bài reading theo ID (dạng luyện tập)
export const getReadingTestById = async (id: number | string) => {
  const token = localStorage.getItem("token");
  const res = await axios.get(`${BASE_URL}/reading/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
