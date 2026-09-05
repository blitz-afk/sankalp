import express from "express";

import firebaseAuth from "../middleware/firebaseAuth.js";

import {
    createSolution,
    getMySolutions
} from "../controllers/solutionController.js";

const router = express.Router();

router.get(
    "/my",
    firebaseAuth,
    getMySolutions
);

router.post(
    "/",
    firebaseAuth,
    createSolution
);

export default router;