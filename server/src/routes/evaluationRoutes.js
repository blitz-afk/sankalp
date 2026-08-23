import express from 'express';
import { getEvaluations, submitEvaluation } from '../controllers/evaluationController.js';
import { firebaseAuth } from '../middleware/firebaseAuth.js';
import { requireRole } from '../middleware/roleMiddleware.js';
import { ROLES } from '../utils/constants.js';

const router = express.Router();

router.get('/', getEvaluations);
router.post('/', firebaseAuth, requireRole(ROLES.EVALUATOR, ROLES.ADMIN), submitEvaluation);

export default router;
