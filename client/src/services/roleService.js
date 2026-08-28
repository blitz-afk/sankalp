import api from './api';

export const getIndustryProfile = async () => (await api.get('/industry/me')).data;
export const getIndustryRecommendations = async () => (await api.get('/industries/recommendations')).data;
export const getUniversityProfile = async () => (await api.get('/university/my')).data;
export const getUniversityRecommendations = async () => (await api.get('/universities/recommendations')).data;
export const getGovernmentBody = async () => (await api.get('/government-bodies/me')).data;
export const getGovernmentBodies = async () => (await api.get('/government-bodies')).data;
export const getMyPilotRequests = async () => (await api.get('/pilot-requests/my')).data;
export const getMyPilots = async () => (await api.get('/pilots/my')).data;
