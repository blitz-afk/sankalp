import api from './api';

export const projectService = {
  async getProjects(params = {}) {
    return await api.get('/projects', { params });
  },

  async getProjectById(id) {
    return await api.get(`/projects/${id}`);
  },

  async createProject(projectData) {
    return await api.post('/projects', projectData);
  },
};

export default projectService;
