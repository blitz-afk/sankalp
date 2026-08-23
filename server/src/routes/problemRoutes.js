import createProblem from "../controllers/problemController.js";
import { Router } from "express";
import firebaseAuth from "../middleware/firebaseAuth.js";
import upload from "../middleware/uploadMiddleware.js";

const router = Router();

router.post("/", firebaseAuth, upload.single("media"), createProblem);
export default router;  
