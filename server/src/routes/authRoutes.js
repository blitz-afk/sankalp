import express from 'express';
import { syncUser, getCurrentUser, updateProfile } from '../controllers/userController.js';
import { firebaseAuth } from '../middleware/firebaseAuth.js';

const router = express.Router();

// Synchronize Firebase user with MongoDB profile
router.post('/sync', firebaseAuth, syncUser);

// Get current authenticated user
router.get('/me', firebaseAuth, getCurrentUser);

// Update user profile
router.put('/profile', firebaseAuth, updateProfile);

export default router;
