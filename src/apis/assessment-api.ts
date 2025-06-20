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
export const createPart = async (assessmentId: number, data: any) => {
  const res = await axios.post(
    `${BASE_URL}/assessment/${assessmentId}/parts`,   // sửa "assessments" -> "assessment"
    data,
    headers()
  );
  return res.data;
};

export const updatePart = async (partId: number, data: any) => {
  const res = await axios.put(
    `${BASE_URL}/assessment/parts/${partId}`,  // sửa
    data,
    headers()
  );
  return res.data;
};

export const deletePart = async (partId: number) => {
  const res = await axios.delete(
    `${BASE_URL}/assessment/parts/${partId}`,  // sửa
    headers()
  );
  return res.data;
};

// ===== GROUP =====
export const createGroup = async (partId: number, data: any) => {
  const res = await axios.post(
    `${BASE_URL}/assessment/parts/${partId}/groups`,  // sửa
    data,
    headers()
  );
  return res.data;
};

export const updateGroup = async (groupId: number, data: any) => {
  const res = await axios.put(
    `${BASE_URL}/assessment/groups/${groupId}`,  // sửa
    data,
    headers()
  );
  return res.data;
};

export const deleteGroup = async (groupId: number) => {
  const res = await axios.delete(
    `${BASE_URL}/assessment/groups/${groupId}`,  // sửa
    headers()
  );
  return res.data;
};

// ===== QUESTION =====
export const createQuestion = async (groupId: number, data: any) => {
  const res = await axios.post(
    `${BASE_URL}/assessment/groups/${groupId}/questions`,  // sửa
    data,
    headers()
  );
  return res.data;
};

export const updateQuestion = async (questionId: number, data: any) => {
  const res = await axios.put(
    `${BASE_URL}/assessment/questions/${questionId}`,  // sửa
    data,
    headers()
  );
  return res.data;
};

export const deleteQuestion = async (questionId: number) => {
  const res = await axios.delete(
    `${BASE_URL}/assessment/questions/${questionId}`,  // sửa
    headers()
  );
  return res.data;
};

