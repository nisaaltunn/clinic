const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

export const API_ENDPOINTS = {
  DENTISTS: `${API_BASE_URL}/dentists`,
  DENTIST_BY_ID: (id) => `${API_BASE_URL}/dentists/${id}`,
  DENTISTS_BY_SPECIALTY: (specialty) => `${API_BASE_URL}/dentists/specialty/${encodeURIComponent(specialty)}`,
};

export default API_BASE_URL;
