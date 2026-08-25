import express from "express";
import firebaseAuth from "../middleware/firebaseAuth.js";

import {
    getMyPilots,
    startPilot,
    completePilot
} from "../controllers/pilotController.js";

const router = express.Router();

router.get(
    "/my",
    firebaseAuth,
    getMyPilots
);

router.patch(
    "/:pilotId/start",
    firebaseAuth,
    startPilot
);

router.patch(
    "/:pilotId/complete",
    firebaseAuth,
    completePilot
);

export default router;