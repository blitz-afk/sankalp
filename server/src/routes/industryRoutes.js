import express from 'express';
import {
  getIndustries,
  updateIndustryProfile,
  sponsorSolution,
} from '../controllers/industryController.js';
import { firebaseAuth } from '../middleware/firebaseAuth.js';
import { requireRole } from '../middleware/roleMiddleware.js';
import { ROLES } from '../utils/constants.js';

const router = express.Router();

router.get('/', getIndustries);
router.put('/', firebaseAuth, requireRole(ROLES.INDUSTRY, ROLES.ADMIN), updateIndustryProfile);
router.post('/sponsor', firebaseAuth, requireRole(ROLES.INDUSTRY, ROLES.ADMIN), sponsorSolution);

export default router;
