import express from "express";

import firebaseAuth from "../middleware/firebaseAuth.js";

import {
    createIndustry,
    getMyIndustry,
    getAllIndustries,
    getIndustryById,
    getMyRecommendations
} from "../controllers/industryController.js";

const router = express.Router();

router.post(
    "/register",
    firebaseAuth,
    createIndustry
);

router.get(
    "/me",
    firebaseAuth,
    getMyIndustry
);

router.get(
    "/",
    firebaseAuth,
    getAllIndustries
);
router.get(
    "/recommendations",
    firebaseAuth,
    getMyRecommendations
);
router.get(
    "/:id",
    firebaseAuth,
    getIndustryById
);

export default router;