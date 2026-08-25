import express from "express";

import firebaseAuth from "../middleware/firebaseAuth.js";

import {
    createIndustryInterest,
    getMyIndustryInterests,
    getSolutionInterests,
    acceptIndustryInterest,
    rejectIndustryInterest
} from "../controllers/industryInterestController.js";

const router = express.Router();

router.post(
    "/",
    firebaseAuth,
    createIndustryInterest
);

router.get(
    "/my",
    firebaseAuth,
    getMyIndustryInterests
);
router.get(
    "/received",
    firebaseAuth,
    getSolutionInterests
);
router.patch(
    "/:id/accept",
    firebaseAuth,
    acceptIndustryInterest
);
router.patch(
    "/:id/reject",
    firebaseAuth,
    rejectIndustryInterest
);
export default router;