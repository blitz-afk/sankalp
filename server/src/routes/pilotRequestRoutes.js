import express from "express";

import firebaseAuth from "../middleware/firebaseAuth.js";

import { createPilotRequest, getMyPilotRequests, acceptPilotRequest, rejectPilotRequest, convertPilotRequestToPilot } from "../controllers/pilotRequestController.js";

const router = express.Router();

router.post(
    "/",
    firebaseAuth,
    createPilotRequest
);
router.get(
    "/my",
    firebaseAuth,
    getMyPilotRequests
);

router.patch(
    "/:pilotRequestId/accept",
    firebaseAuth,
    acceptPilotRequest
);

router.patch(
    "/:pilotRequestId/reject",
    firebaseAuth,
    rejectPilotRequest
);
router.patch("/:pilotRequestId/convert", firebaseAuth, convertPilotRequestToPilot);

export default router;