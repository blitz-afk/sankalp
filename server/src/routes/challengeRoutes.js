import express from "express";
import { getOpenChallenges ,getChallengeById} from "../controllers/challengeController.js";
import firebaseAuth from "../middleware/firebaseAuth.js";

const router = express.Router();

router.get("/", firebaseAuth, getOpenChallenges);

router.get("/:id",firebaseAuth,getChallengeById);

export default router;