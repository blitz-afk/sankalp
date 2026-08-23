import api from './api';

export const problemService = {
  async getProblems(params = {}) {
    return await api.get('/problems', { params });
  },

  async getProblemById(id) {
    return await api.get(`/problems/${id}`);
  },

  async createProblem(problemData) {
    return await api.post('/problems', problemData);
  },

  async upvoteProblem(id) {
    return await api.post(`/problems/${id}/upvote`);
  },

  async analyzeWithAI(id) {
    return await api.post(`/problems/${id}/analyze`);
  },
};

export default problemService;
