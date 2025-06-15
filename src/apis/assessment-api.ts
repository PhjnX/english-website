import axios from "axios";

const BASE_URL = "https://nestjs-english-website-production.up.railway.app";

const token = () => localStorage.getItem("token");

const headers = () => ({
  headers: { Authorization: `Bearer ${token()}` },
});

// ===== ASSESSMENT =====

export const getAllAssessments = async () => {
  const res = await axios.get(`${BASE_URL}/assessment`, headers());
  return res.data;
};

export const createAssessment = async (data: any) => {
  const res = await axios.post(`${BASE_URL}/assessment`, data, headers());
  return res.data;
};

export const updateAssessment = async (id: number, data: any) => {
  const res = await axios.put(`${BASE_URL}/assessment/${id}`, data, headers());
  return res.data;
};

export const deleteAssessment = async (id: number) => {
  const res = await axios.delete(`${BASE_URL}/assessment/${id}`, headers());
  return res.data;
};

// Only use this for list, not for detail by id
export const getAssessmentById = async (id: number) => {
  // Not supported by API, so get all and filter client-side
  const all = await getAllAssessments();
  return all.find((a: any) => a.id === id || a.id === String(id));
};

// ===== PART =====
// Các hàm dưới đây không dùng nữa nếu chỉ lấy data từ /assessment
export const createPart = async (assessmentId: number, data: any) => {
  const res = await axios.post(
    `${BASE_URL}/assessments/${assessmentId}/parts`,
    data,
    headers()
  );
  return res.data;
};

export const updatePart = async (partId: number, data: any) => {
  const res = await axios.put(
    `${BASE_URL}/assessments/parts/${partId}`,
    data,
    headers()
  );
  return res.data;
};

export const deletePart = async (partId: number) => {
  const res = await axios.delete(
    `${BASE_URL}/assessments/parts/${partId}`,
    headers()
  );
  return res.data;
};

// ===== GROUP =====
// Các hàm dưới đây không dùng nữa nếu chỉ lấy data từ /assessment
export const createGroup = async (partId: number, data: any) => {
  const res = await axios.post(
    `${BASE_URL}/assessments/parts/${partId}/groups`,
    data,
    headers()
  );
  return res.data;
};

export const updateGroup = async (groupId: number, data: any) => {
  const res = await axios.put(
    `${BASE_URL}/assessments/groups/${groupId}`,
    data,
    headers()
  );
  return res.data;
};

export const deleteGroup = async (groupId: number) => {
  const res = await axios.delete(
    `${BASE_URL}/assessments/groups/${groupId}`,
    headers()
  );
  return res.data;
};

// ===== QUESTION =====
// Các hàm dưới đây không dùng nữa nếu chỉ lấy data từ /assessment
export const createQuestion = async (groupId: number, data: any) => {
  const res = await axios.post(
    `${BASE_URL}/assessments/groups/${groupId}/questions`,
    data,
    headers()
  );
  return res.data;
};

export const updateQuestion = async (questionId: number, data: any) => {
  const res = await axios.put(
    `${BASE_URL}/assessments/questions/${questionId}`,
    data,
    headers()
  );
  return res.data;
};

export const deleteQuestion = async (questionId: number) => {
  const res = await axios.delete(
    `${BASE_URL}/assessments/questions/${questionId}`,
    headers()
  );
  return res.data;
};
