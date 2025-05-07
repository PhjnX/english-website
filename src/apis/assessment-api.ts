import axios from "axios";

const BASE_URL = "http://localhost:8080";

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

// ===== PART =====

export const createPart = async (assessmentId: number, data: any) => {
  const res = await axios.post(`${BASE_URL}/assessment/${assessmentId}/parts`, data, headers());
  return res.data;
};

export const updatePart = async (partId: number, data: any) => {
  const res = await axios.put(`${BASE_URL}/assessment/parts/${partId}`, data, headers());
  return res.data;
};

export const deletePart = async (partId: number) => {
  const res = await axios.delete(`${BASE_URL}/assessment/parts/${partId}`, headers());
  return res.data;
};

// ===== GROUP =====

export const createGroup = async (partId: number, data: any) => {
  const res = await axios.post(`${BASE_URL}/assessment/parts/${partId}/groups`, data, headers());
  return res.data;
};

export const updateGroup = async (groupId: number, data: any) => {
  const res = await axios.put(`${BASE_URL}/assessment/groups/${groupId}`, data, headers());
  return res.data;
};

export const deleteGroup = async (groupId: number) => {
  const res = await axios.delete(`${BASE_URL}/assessment/groups/${groupId}`, headers());
  return res.data;
};

// ===== QUESTION =====

export const createQuestion = async (groupId: number, data: any) => {
  const res = await axios.post(`${BASE_URL}/assessment/groups/${groupId}/questions`, data, headers());
  return res.data;
};

export const updateQuestion = async (questionId: number, data: any) => {
  const res = await axios.put(`${BASE_URL}/assessment/questions/${questionId}`, data, headers());
  return res.data;
};

export const deleteQuestion = async (questionId: number) => {
  const res = await axios.delete(`${BASE_URL}/assessment/questions/${questionId}`, headers());
  return res.data;
};
