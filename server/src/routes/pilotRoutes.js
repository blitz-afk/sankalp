import express from 'express';
import {
  getPilots,
  getPilotById,
  createPilot,
  updatePilotStatus,
} from '../controllers/pilotController.js';
import { firebaseAuth } from '../middleware/firebaseAuth.js';
import { requireRole } from '../middleware/roleMiddleware.js';
import { ROLES } from '../utils/constants.js';

const router = express.Router();

router.get('/', getPilots);
router.get('/:id', getPilotById);
router.post('/', firebaseAuth, requireRole(ROLES.GOVERNMENT, ROLES.ADMIN), createPilot);
router.put('/:id/status', firebaseAuth, requireRole(ROLES.GOVERNMENT, ROLES.ADMIN, ROLES.EVALUATOR), updatePilotStatus);

export default router;
