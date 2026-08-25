import { createUniversity, getAllUniversities, getMyUniversity, getUniversityById, getMyRecommendations } from "../controllers/universityController.js";
import firebaseAuth from "../middleware/firebaseAuth.js";
import { Router } from "express";

const router = Router();

router.post('/', firebaseAuth, createUniversity);
router.get('/my', firebaseAuth, getMyUniversity);
router.get('/', firebaseAuth, getAllUniversities);
router.get('/recommendations', firebaseAuth, getMyRecommendations);
router.get('/:id', firebaseAuth, getUniversityById);


export default router;