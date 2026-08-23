import api from './api';

export const evaluationService = {
  async getEvaluations(params = {}) {
    return await api.get('/evaluations', { params });
  },

  async submitEvaluation(evaluationData) {
    return await api.post('/evaluations', evaluationData);
  },
};

export default evaluationService;
