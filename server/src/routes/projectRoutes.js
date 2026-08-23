import express from 'express';
import { getProjects, getProjectById, createProject } from '../controllers/projectController.js';
import { firebaseAuth } from '../middleware/firebaseAuth.js';

const router = express.Router();

router.get('/', getProjects);
router.get('/:id', getProjectById);
router.post('/', firebaseAuth, createProject);

export default router;
