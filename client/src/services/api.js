import axios from 'axios';
import { auth } from '../firebase/config';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  timeout: 30000,
});

api.interceptors.request.use(async (config) => {
  const currentUser = auth.currentUser;
  if (currentUser) {
    const token = await currentUser.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || error.response?.data?.error || error.message || 'Request failed';
    return Promise.reject(new Error(message));
  },
);

export default api;
export { api };

export async function validateProblemImage({ title = '', description = '' } = {}) {
  return {
    category: 'Other',
    severity: 'Medium',
    summary: `Your report about ${title || 'this civic issue'} will be analyzed by the civic team.`,
    problemType: description || 'Civic issue',
  };
}
