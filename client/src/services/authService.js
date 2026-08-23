import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  updateProfile as updateFirebaseProfile,
} from 'firebase/auth';
import { auth } from '../firebase/config';
import api from './api';

const googleProvider = new GoogleAuthProvider();

export const authService = {
  // 1. Firebase Authentication: Sign in with email and password
  async loginWithEmail(email, password) {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    // Sync with backend MongoDB profile
    const syncRes = await api.post('/auth/sync', {
      email: userCredential.user.email,
      displayName: userCredential.user.displayName,
      photoURL: userCredential.user.photoURL,
    });
    return { firebaseUser: userCredential.user, user: syncRes.data };
  },

  // 2. Firebase Authentication: Register new user with email, password & chosen role
  async registerWithEmail({ email, password, displayName, role, organization, phone }) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    if (displayName) {
      await updateFirebaseProfile(userCredential.user, { displayName });
    }
    // Sync with backend MongoDB profile with selected initial role
    const syncRes = await api.post('/auth/sync', {
      email: userCredential.user.email,
      displayName,
      role,
      organization,
      phone,
    });
    return { firebaseUser: userCredential.user, user: syncRes.data };
  },

  // 3. Firebase Authentication: Google Sign In
  async loginWithGoogle(role = 'CITIZEN') {
    const userCredential = await signInWithPopup(auth, googleProvider);
    const syncRes = await api.post('/auth/sync', {
      email: userCredential.user.email,
      displayName: userCredential.user.displayName,
      photoURL: userCredential.user.photoURL,
      role,
    });
    return { firebaseUser: userCredential.user, user: syncRes.data };
  },

  // 4. Fetch current user from MongoDB
  async getProfile() {
    return await api.get('/auth/me');
  },

  // 5. Update user profile in MongoDB
  async updateProfile(profileData) {
    return await api.put('/auth/profile', profileData);
  },

  // 6. Sign out
  async logout() {
    await signOut(auth);
  },
};

export default authService;
