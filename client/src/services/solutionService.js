import api from './api';

export const solutionService = {
  async getSolutions(params = {}) {
    return await api.get('/solutions', { params });
  },

  async getSolutionById(id) {
    return await api.get(`/solutions/${id}`);
  },

  async createSolution(solutionData) {
    return await api.post('/solutions', solutionData);
  },

  async getRecommendedIndustrySponsors(id) {
    return await api.get(`/solutions/${id}/match-industry`);
  },
};

export default solutionService;
