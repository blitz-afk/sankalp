import { Router } from "express";
import firebaseAuth from "../middleware/firebaseAuth.js";
import upload from "../middleware/uploadMiddleware.js";

import {
    createProblem,
    getProblemsByChallenge
} from "../controllers/problemController.js";

import getCitizenProblems from "../controllers/getCitizenProblemsController.js";

const router = Router();

router.post(
    "/",
    firebaseAuth,
    upload.single("media"),
    createProblem
);

router.get(
    "/my",
    firebaseAuth,
    getCitizenProblems
);

router.get(
    "/challenge/:challengeId",
    firebaseAuth,
    getProblemsByChallenge
);

export default router;