import { getFirebaseAuth } from '../config/firebase.js';
import { User } from '../models/User.js';
import { sendError } from '../utils/responseHandler.js';
import { ENV } from '../config/env.js';

export const firebaseAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendError(res, 401, 'Unauthorized: No token provided');
    }

    const token = authHeader.split(' ')[1];
    const auth = getFirebaseAuth();

    let decodedToken = null;

    if (auth) {
      try {
        decodedToken = await auth.verifyIdToken(token);
      } catch (verifyError) {
        return sendError(res, 401, `Unauthorized: Invalid token (${verifyError.message})`);
      }
    } else {
      // In local development without configured Firebase service account credentials
      if (ENV.NODE_ENV === 'development') {
        console.warn('[firebaseAuth] Bypassing Firebase verification in development mode');
        decodedToken = {
          uid: 'dev-user-uid',
          email: req.headers['x-dev-email'] || 'dev@sankalp.local',
          name: 'Development User',
        };
      } else {
        return sendError(res, 500, 'Firebase Auth is not properly initialized on the server');
      }
    }

    if (!decodedToken) {
      return sendError(res, 401, 'Unauthorized: Failed to authenticate token');
    }

    // Attach decoded Firebase token
    req.firebaseUser = decodedToken;

    // Look up or sync user in MongoDB
    let user = await User.findOne({ firebaseUid: decodedToken.uid });

    if (!user && decodedToken.email) {
      // If user exists by email, update uid
      user = await User.findOne({ email: decodedToken.email.toLowerCase() });
      if (user) {
        user.firebaseUid = decodedToken.uid;
        await user.save();
      }
    }

    // Attach MongoDB user document if found
    req.user = user || null;

    next();
  } catch (error) {
    console.error(`[firebaseAuth] Authentication error: ${error.message}`);
    return sendError(res, 500, 'Authentication error occurred', error.message);
  }
};
