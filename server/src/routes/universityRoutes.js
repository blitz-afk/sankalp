import express from "express";

import firebaseAuth from "../middleware/firebaseAuth.js";

import {
    createUniversity,
    getMyUniversity,
    getAllUniversities,
    getUniversityById,
    getMyRecommendations
} from "../controllers/universityController.js";

const router = express.Router();

router.post(
    "/register",
    firebaseAuth,
    createUniversity
);

router.get(
    "/me",
    firebaseAuth,
    getMyUniversity
);

router.get(
    "/recommendations",
    firebaseAuth,
    getMyRecommendations
);

router.get(
    "/",
    firebaseAuth,
    getAllUniversities
);

router.get(
    "/:id",
    firebaseAuth,
    getUniversityById
);

export default router;