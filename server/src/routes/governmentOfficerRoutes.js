import express from "express";

import firebaseAuth from "../middleware/firebaseAuth.js";
import createGovernmentOfficer from "../controllers/governmentOfficerController.js";

const router = express.Router();

router.post(
    "/register",
    firebaseAuth,
    createGovernmentOfficer
);

export default router;