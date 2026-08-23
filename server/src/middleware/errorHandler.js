import { sendError } from '../utils/responseHandler.js';
import { ENV } from '../config/env.js';

export const errorHandler = (err, req, res, next) => {
  console.error('[Error Handler]', err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  return sendError(
    res,
    statusCode,
    message,
    ENV.NODE_ENV === 'development' ? err.stack : undefined
  );
};
