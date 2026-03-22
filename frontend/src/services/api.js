// frontend/src/services/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "https://job-vacancy-crm-production.up.railway.app/api",
});

// --- ВАКАНСІІ ---
export const getVacancies = () => api.get("/vacancies");
export const createVacancy = (data) => api.post("/vacancies", data);
export const createVacancyAuto = (rawText) =>
  api.post("/vacancies/auto", { rawText });
export const createVacancyFromTemplate = (templateId, rawText) =>
  api.post(`/vacancies/from-template/${templateId}`, { rawText });
export const updateVacancy = (id, data) => api.put(`/vacancies/${id}`, data);
export const deleteVacancy = (id) => api.delete(`/vacancies/${id}`);

// --- ШАБЛОНЫ ---
export const getTemplates = () => api.get("/templates");
export const createTemplate = (data) => api.post("/templates", data);
export const updateTemplate = (id, data) => api.put(`/templates/${id}`, data);
export const deleteTemplate = (id) => api.delete(`/templates/${id}`);

// --- КАНДЫДАТЫ ---
export const getCandidates = (params) => api.get("/candidates", { params });
export const getCandidate = (id) => api.get(`/candidates/${id}`);
export const createCandidate = (data) => api.post("/candidates", data);
export const updateCandidate = (id, data) => api.put(`/candidates/${id}`, data);
export const deleteCandidate = (id) => api.delete(`/candidates/${id}`);
export const addCandidateHistory = (id, data) =>
  api.post(`/candidates/${id}/history`, data);
export const matchVacanciesForCandidate = (id) =>
  api.get(`/candidates/${id}/match-vacancies`);

// --- ЗАЯЎКІ ---
export const submitApplication = (data) => api.post("/apply", data);
export const matchCandidatesForVacancy = (id) =>
  api.get(`/vacancies/${id}/match-candidates`);

export default api;
