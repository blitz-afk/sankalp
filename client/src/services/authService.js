import api from './api';

export async function registerCitizen({ name, email }) {
  const { data } = await api.post('/profiles', { name, email, role: 'Citizen' });
  return data.profile || data;
}

export async function getMyProfile() {
  try {
    const { data } = await api.get('/profiles/me');
    return data.profile || data;
  } catch {
    return null;
  }
}
