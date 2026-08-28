export const ROLES = {
  CITIZEN: 'Citizen',
  UNIVERSITY: 'University',
  INDUSTRY: 'Industry',
};

// Roles that can self-register via the public registration page.
// Government Body and Government Officer are NOT included.
export const SELF_REGISTRATION_ROLES = [
  ROLES.CITIZEN,
  ROLES.UNIVERSITY,
  ROLES.INDUSTRY,
];

export const ROUTES = {
  LANDING: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  CITIZEN: '/citizen',
};

export const DASHBOARD_ROUTES = {
  Citizen: '/citizen',
  University: '/university',
  Industry: '/industry',
};

export const STATUS_COLORS = {
  Submitted: 'blue',
  Verified: 'green',
  Rejected: 'red',
  Duplicate: 'gray',
  'In-Progress': 'amber',
  Resolved: 'green',
};
