import { sendError } from '../utils/responseHandler.js';

export const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return sendError(res, 401, 'User profile not found. Please complete profile registration.');
    }

    if (req.user.role === 'ADMIN') {
      // Admin has universal access
      return next();
    }

    if (!allowedRoles.includes(req.user.role)) {
      return sendError(
        res,
        403,
        `Forbidden: Access restricted to [${allowedRoles.join(', ')}]. Your role is ${req.user.role}.`
      );
    }

    next();
  };
};
