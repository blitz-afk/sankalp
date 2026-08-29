import express from "express";

import {
    registerCitizen,
    getMe
} from "../controllers/authController.js";

import firebaseAuth from "../middleware/firebaseAuth.js";

const router = express.Router();

router.post(
    "/register/citizen",
    firebaseAuth,
    registerCitizen
);

router.get(
    "/me",
    firebaseAuth,
    getMe
);

export default router;  