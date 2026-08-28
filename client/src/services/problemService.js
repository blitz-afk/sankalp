import api from './api';

export async function createProblem({ title, description, imageBlob, location }) {
  const form = new FormData();
  form.append('title', title);
  form.append('description', description);
  form.append('location', JSON.stringify(location));
  form.append('media', imageBlob, 'civic-report.jpg');
  const { data } = await api.post('/problems', form, { headers: { 'Content-Type': 'multipart/form-data' } });
  return data.problem || data;
}

export async function getMyProblems() {
  const { data } = await api.get('/problems/me');
  return data.problems || data;
}

export async function getProblems() {
  const { data } = await api.get('/problems');
  return data.problems || data;
}
