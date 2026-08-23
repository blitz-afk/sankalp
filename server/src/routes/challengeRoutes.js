import express from 'express';
import {
  getChallenges,
  getChallengeById,
  createChallenge,
  getRecommendedUniversities,
} from '../controllers/challengeController.js';
import { firebaseAuth } from '../middleware/firebaseAuth.js';
import { requireRole } from '../middleware/roleMiddleware.js';
import { ROLES } from '../utils/constants.js';

const router = express.Router();

// Public: View challenges
router.get('/', getChallenges);
router.get('/:id', getChallengeById);

// Protected: Create challenges (Admin / Evaluator / Government)
router.post('/', firebaseAuth, requireRole(ROLES.ADMIN, ROLES.GOVERNMENT, ROLES.EVALUATOR), createChallenge);

// Protected: AI Matchmaking for challenges to universities
router.get('/:id/match-universities', firebaseAuth, getRecommendedUniversities);

export default router;
