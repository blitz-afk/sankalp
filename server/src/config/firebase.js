import admin from 'firebase-admin';
import { ENV } from './env.js';

let firebaseApp = null;

export const initFirebase = () => {
  if (firebaseApp) return firebaseApp;

  try {
    if (ENV.FIREBASE.PROJECT_ID && ENV.FIREBASE.CLIENT_EMAIL && ENV.FIREBASE.PRIVATE_KEY) {
      firebaseApp = admin.initializeApp({
        credential: admin.credential.cert({
          projectId: ENV.FIREBASE.PROJECT_ID,
          clientEmail: ENV.FIREBASE.CLIENT_EMAIL,
          privateKey: ENV.FIREBASE.PRIVATE_KEY,
        }),
      });
      console.log('[Firebase Admin] Initialized with Service Account credentials');
    } else {
      // In development when credentials are not yet configured
      console.warn('[Firebase Admin] Credentials missing. Running in mock/development mode.');
    }
  } catch (error) {
    console.error(`[Firebase Admin] Initialization failed: ${error.message}`);
  }

  return firebaseApp;
};

export const getFirebaseAuth = () => {
  if (!admin.apps.length) {
    initFirebase();
  }
  return admin.apps.length ? admin.auth() : null;
};
