import express from "express";

import firebaseAuth from "../middleware/firebaseAuth.js";

import createSolution from "../controllers/solutionController.js";

const router = express.Router();

router.post(
    "/",
    firebaseAuth,
    createSolution
);

export default router;