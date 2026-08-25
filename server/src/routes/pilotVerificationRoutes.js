import express from "express";

import firebaseAuth from "../middleware/firebaseAuth.js";


import {
    getGovernmentBodyPilots,
    verifyPilot
} from "../controllers/pilotVerificationController.js";

const router = express.Router();
router.get("/test", (req, res) => {
    res.json({
        success: true,
        message: "Pilot verification routes are working"
    });
});
router.get(
    "/my",
    firebaseAuth,
    getGovernmentBodyPilots
);

router.patch(
    "/:pilotId",
    firebaseAuth,
    verifyPilot
);

export default router;