import express from 'express';
import {
  getUniversities,
  getUniversityProfile,
  updateUniversityProfile,
} from '../controllers/universityController.js';
import { firebaseAuth } from '../middleware/firebaseAuth.js';
import { requireRole } from '../middleware/roleMiddleware.js';
import { ROLES } from '../utils/constants.js';

const router = express.Router();

router.get('/', getUniversities);
router.get('/:id', getUniversityProfile);
router.put('/', firebaseAuth, requireRole(ROLES.UNIVERSITY, ROLES.ADMIN), updateUniversityProfile);

export default router;
