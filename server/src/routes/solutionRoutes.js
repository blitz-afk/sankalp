import express from 'express';
import {
  getSolutions,
  getSolutionById,
  createSolution,
  getRecommendedIndustrySponsors,
} from '../controllers/solutionController.js';
import { firebaseAuth } from '../middleware/firebaseAuth.js';
import { requireRole } from '../middleware/roleMiddleware.js';
import { ROLES } from '../utils/constants.js';

const router = express.Router();

// Public: View solutions
router.get('/', getSolutions);
router.get('/:id', getSolutionById);

// Protected: Submit solution (University / Admin)
router.post('/', firebaseAuth, requireRole(ROLES.UNIVERSITY, ROLES.ADMIN), createSolution);

// Protected: Matchmaking with industry sponsors
router.get('/:id/match-industry', firebaseAuth, getRecommendedIndustrySponsors);

export default router;
