import createProblem from "../controllers/problemController.js";
import { Router } from "express";
import firebaseAuth from "../middleware/firebaseAuth.js";

const router = Router();

router.post("/create", firebaseAuth, createProblem);
export default router;
