import { Router } from "express";

import firebaseAuth from "../middleware/firebaseAuth.js";
import upload from "../middleware/uploadMiddleware.js";
import analyzeProblemPreview from "../controllers/problemAnalysisController.js";

const router = Router();

router.post(
    "/",
    firebaseAuth,
    upload.single("media"),
    analyzeProblemPreview
);

export default router;