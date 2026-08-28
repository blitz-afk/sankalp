import api from './api';

const unwrap = (response) => response.data;

export const getIndustryProfile = async () => unwrap(await api.get('/industry/me'));
export const getIndustryRecommendations = async () => unwrap(await api.get('/industry/recommendations'));
export const getUniversityProfile = async () => unwrap(await api.get('/university/my'));
export const getUniversityRecommendations = async () => unwrap(await api.get('/university/recommendations'));
export const getGovernmentBody = async () => unwrap(await api.get('/government-bodies/me'));
export const getMyPilots = async () => unwrap(await api.get('/pilots/my'));
export const startPilot = async (pilotId) => unwrap(await api.patch(`/pilots/${pilotId}/start`));
export const completePilot = async (pilotId, results) => unwrap(await api.patch(`/pilots/${pilotId}/complete`, { results }));
export const getMyPilotRequests = async () => unwrap(await api.get('/pilot-requests/my'));
export const getEvaluatorQueue = async () => unwrap(await api.get('/pilot-verifications/my'));
export const verifyPilot = async (pilotId, payload) => unwrap(await api.patch(`/pilot-verifications/${pilotId}`, payload));
export const createPilotRequest = async (payload) => unwrap(await api.post('/pilot-requests', payload));
export const getIndustryInterests = async () => unwrap(await api.get('/industry-interests/my'));
export const getReceivedIndustryInterests = async () => unwrap(await api.get('/industry-interests/received'));
export const acceptIndustryInterest = async (interestId) => unwrap(await api.patch(`/industry-interests/${interestId}/accept`));
export const rejectIndustryInterest = async (interestId) => unwrap(await api.patch(`/industry-interests/${interestId}/reject`));
export const submitPilotEvaluation = async (pilotId, payload) => unwrap(await api.post(`/pilot-evaluations/${pilotId}`, payload));
export const getPilotEvaluation = async (pilotId) => unwrap(await api.get(`/pilot-evaluations/${pilotId}`));

export const getRoleWorkspace = async (role) => {
  if (role === 'Industry') {
    const [profile, recommendations] = await Promise.allSettled([
      getIndustryProfile(),
      getIndustryRecommendations(),
    ]);
    return {
      profile: profile.status === 'fulfilled' ? profile.value.industry || profile.value : null,
      recommendations: recommendations.status === 'fulfilled' ? recommendations.value.recommendations || [] : [],
    };
  }
  if (role === 'University') {
    const [profile, recommendations] = await Promise.allSettled([
      getUniversityProfile(),
      getUniversityRecommendations(),
    ]);
    return {
      profile: profile.status === 'fulfilled' ? profile.value.university || profile.value : null,
      recommendations: recommendations.status === 'fulfilled' ? recommendations.value.recommendations || [] : [],
    };
  }
  if (role === 'Evaluator') {
    const queue = await getEvaluatorQueue();
    return {
      profile: queue.evaluator || queue.profile || null,
      recommendations: queue.evaluations || queue.pilots || queue.items || [],
    };
  }
  if (role === 'Admin') {
    const [profile, pilots] = await Promise.allSettled([getGovernmentBody(), getMyPilots()]);
    return {
      profile: profile.status === 'fulfilled' ? profile.value.governmentBody || profile.value : null,
      pilots: pilots.status === 'fulfilled' ? pilots.value.pilots || [] : [],
    };
  }
  return { profile: null, recommendations: [], pilots: [] };
};

export const getGovernmentBodies = async () => unwrap(await api.get('/government-bodies'));
export const getMyPilotsLegacy = getMyPilots;
