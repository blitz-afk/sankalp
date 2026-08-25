import express from "express";

import firebaseAuth from "../middleware/firebaseAuth.js";

import assignOfficerToProblem from "../controllers/governmentProblemController.js";

const router = express.Router();

router.patch(
    "/:problemId/assign-officer",
    firebaseAuth,
    assignOfficerToProblem
);

export default router;