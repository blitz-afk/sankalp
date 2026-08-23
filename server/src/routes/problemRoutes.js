import express from 'express';
import {
  getProblems,
  getProblemById,
  createProblem,
  upvoteProblem,
  analyzeProblemWithAI,
} from '../controllers/problemController.js';
import { firebaseAuth } from '../middleware/firebaseAuth.js';

const router = express.Router();

// Public: View problems
router.get('/', getProblems);
router.get('/:id', getProblemById);

// Protected: Submit, upvote, or analyze problem
router.post('/', firebaseAuth, createProblem);
router.post('/:id/upvote', firebaseAuth, upvoteProblem);
router.post('/:id/analyze', firebaseAuth, analyzeProblemWithAI);

export default router;
