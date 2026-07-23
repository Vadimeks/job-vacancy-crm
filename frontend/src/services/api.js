// frontend/src/services/api.js
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : "http://localhost:3000/api";

const api = axios.create({
  baseURL: API_URL,
});

// --- ВАКАНСІІ (v3.7 - Падтримка фільтрацыі па датах і параметрах) ---
export const getVacancies = (params) => {
  // Калі перададзены проста радок (старая логіка), трансфармуем у аб'ект
  const queryParams = typeof params === "string" ? { status: params } : params;
  return api.get("/vacancies", { params: queryParams });
};
export const createVacancy = (data) => api.post("/vacancies", data);

// Дадалі messageId для аўтаматычнай ачысткі інбокса
export const createVacancyAuto = (rawText, messageId) =>
  api.post("/vacancies/auto", { rawText, messageId });

// Дадалі messageId для аўтаматычнай ачысткі інбокса
export const createVacancyFromTemplate = (templateId, rawText, messageId) =>
  api.post(`/vacancies/from-template/${templateId}`, { rawText, messageId });

export const updateVacancy = (id, data) => api.put(`/vacancies/${id}`, data);
export const deleteVacancy = (id) => api.delete(`/vacancies/${id}`);

// Дадалі messageId для аўтаматычнай ачысткі інбокса пры абнаўленні
export const aiUpdateVacancy = (id, rawText, messageId) =>
  api.patch(`/vacancies/${id}/ai-update`, { rawText, messageId });
// Пераключэнне "зорачкі" (абранае)
export const toggleFavoriteVacancy = (id) =>
  api.patch(`/vacancies/${id}/favorite`);
// 👈 ДАДАДЗЕНА: Пераключэнне статусу "Паказати на головній" (v8.0)
export const toggleFeaturedVacancy = (id) =>
  api.patch(`/vacancies/${id}/featured`);
export const bulkDeleteVacancies = (ids) =>
  api.post("/vacancies/bulk-delete", { ids });
export const reparseVacancy = (id) => api.post(`/vacancies/${id}/reparse`);
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
// 👈 ДАДАДЗЕНА: Адпраўка анкеты з Telegram Mini App (v7.8.0)
export const createTmaApply = (data) => api.post("/apply/tma", data);
export const submitApplication = (data) => api.post("/apply", data);
export const matchCandidatesForVacancy = (id) =>
  api.get(`/vacancies/${id}/match-candidates`);

// --- УВАХОДНЫЯ (Viber/Telegram) ---
export const getInboxMessages = (params) => api.get("/inbox", { params });
export const getInboxStats = () => api.get("/inbox/stats");
export const deleteInboxMessage = (id) => api.delete(`/inbox/${id}`);
export const bulkDeleteInbox = (data) => api.delete("/inbox/bulk", { data });
export const markInboxProcessed = (id) => api.patch(`/inbox/${id}/process`);
// Генерацыя прэв'ю для рэдактара
export const generateVacancyPreview = (id) => api.post(`/vacancies/${id}/generate-preview`);

// Публікацыя ў Telegram
export const publishVacancy = (id, data) => api.post(`/vacancies/${id}/publish`, data);
// Масавая генерацыя дайджэста
export const generateBulkPreview = (ids) => api.post("/vacancies/bulk-preview", { ids });

// Масавая публікацыя дайджэста
export const publishBulk = (data) => api.post("/vacancies/bulk-publish", data);
// 👈 ДАДАДЗЕНА: ручны запуск сканавання па агенцыі
export const syncAgency = (agencyName) => api.post("/sync/agency", { agencyName });
export const getSyncProgress = () => api.get("/sync/progress");
export const stopSync = () => api.post("/sync/stop");
export default api;
