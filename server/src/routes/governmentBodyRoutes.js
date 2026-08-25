import express from "express";

import firebaseAuth from "../middleware/firebaseAuth.js";

import {
    createGovernmentBody,
    getMyGovernmentBody,
    getAllGovernmentBodies,
    getGovernmentBodyById
} from "../controllers/governmentBodyController.js";

const router = express.Router();

router.post(
    "/register",
    firebaseAuth,
    createGovernmentBody
);

router.get(
    "/me",
    firebaseAuth,
    getMyGovernmentBody
);

router.get(
    "/",
    firebaseAuth,
    getAllGovernmentBodies
);

router.get(
    "/:id",
    firebaseAuth,
    getGovernmentBodyById
);

export default router;