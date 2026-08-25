import express from "express";

import firebaseAuth from "../middleware/firebaseAuth.js";

import {
    submitPilotEvaluation,
    getPilotEvaluation
} from "../controllers/pilotEvaluationController.js";

const router = express.Router();

router.post(
    "/:pilotId",
    firebaseAuth,
    submitPilotEvaluation
);

router.get(
    "/:pilotId",
    firebaseAuth,
    getPilotEvaluation
);

export default router;