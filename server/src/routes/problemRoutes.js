import createProblem, { getMyProblems } from "../controllers/problemController.js";
import { Router } from "express";
import firebaseAuth from "../middleware/firebaseAuth.js";
import upload from "../middleware/uploadMiddleware.js";

const router = Router();

router.get("/me", firebaseAuth, getMyProblems);
router.post("/", firebaseAuth, upload.single("media"), createProblem);
export default router;  
