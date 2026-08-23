import api from './api';

export const pilotService = {
  async getPilots(params = {}) {
    return await api.get('/pilots', { params });
  },

  async getPilotById(id) {
    return await api.get(`/pilots/${id}`);
  },

  async createPilot(pilotData) {
    return await api.post('/pilots', pilotData);
  },

  async updatePilotStatus(id, updateData) {
    return await api.put(`/pilots/${id}/status`, updateData);
  },
};

export default pilotService;
