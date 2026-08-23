import createProblem from "../controllers/problemController.js";
import { Router } from "express";

const router = Router();

router.post("/create", createProblem);
export default router;
