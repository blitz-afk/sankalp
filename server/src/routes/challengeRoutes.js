import express from "express";
import { getOpenChallenges } from "../controllers/challengeController.js";
import firebaseAuth from "../middleware/firebaseAuth.js";

const router = express.Router();

router.get("/", firebaseAuth, getOpenChallenges);

export default router;