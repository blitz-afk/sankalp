import express from "express";

import firebaseAuth from "../middleware/firebaseAuth.js";

import {
  createGovernmentBody,
  getMyGovernmentBody,
  getAllGovernmentBodies,
  getGovernmentBodyById,
  getCompletedPilots,
  verifyPilot,
  rejectPilot,
} from "../controllers/governmentBodyController.js";

const router = express.Router();

router.post("/register", firebaseAuth, createGovernmentBody);

router.get("/me", firebaseAuth, getMyGovernmentBody);

router.get("/", firebaseAuth, getAllGovernmentBodies);

// Government Body pilot verification
router.get("/pilots/completed", firebaseAuth, getCompletedPilots);

router.patch("/pilots/:pilotId/verify", firebaseAuth, verifyPilot);

router.patch("/pilots/:pilotId/reject", firebaseAuth, rejectPilot);

// Keep this LAST
router.get("/:id", firebaseAuth, getGovernmentBodyById);

export default router;
