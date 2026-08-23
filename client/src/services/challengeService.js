import api from './api';

export const challengeService = {
  async getChallenges(params = {}) {
    return await api.get('/challenges', { params });
  },

  async getChallengeById(id) {
    return await api.get(`/challenges/${id}`);
  },

  async createChallenge(challengeData) {
    return await api.post('/challenges', challengeData);
  },

  async getRecommendedUniversities(id) {
    return await api.get(`/challenges/${id}/match-universities`);
  },
};

export default challengeService;
