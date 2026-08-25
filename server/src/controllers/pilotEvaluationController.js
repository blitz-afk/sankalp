import PilotEvaluation from "../models/PilotEvaluation.js";
import Pilot from "../models/Pilot.js";
import GovernmentOfficer from "../models/GovernmentOfficer.js";

const submitPilotEvaluation = async (req, res) => {
    try {
        const { pilotId } = req.params;

        const {
            score,
            technicalAssessment,
            observations,
            recommendation
        } = req.body;

        // 1. Validate score

        if (
            score === undefined ||
            score < 1 ||
            score > 5
        ) {
            return res.status(400).json({
                success: false,
                message: "Score must be between 1 and 5"
            });
        }

        // 2. Validate assessment

        if (
            !technicalAssessment ||
            technicalAssessment.trim().length < 20
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Technical assessment must be at least 20 characters"
            });
        }

        if (
            !observations ||
            observations.trim().length < 20
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Observations must be at least 20 characters"
            });
        }

        const validRecommendations = [
            "Recommended",
            "Recommended with Modifications",
            "Not Recommended"
        ];

        if (
            !validRecommendations.includes(
                recommendation
            )
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid recommendation"
            });
        }

        // 3. Find logged-in government officer

        const officer =
            await GovernmentOfficer.findOne({
                firebaseUid: req.user.uid,
                isActive: true
            });

        if (!officer) {
            return res.status(403).json({
                success: false,
                message:
                    "Government officer profile not found"
            });
        }

        // 4. Find pilot assigned to officer

        const pilot = await Pilot.findOne({
            _id: pilotId,
            governmentOfficerId: officer._id
        });

        if (!pilot) {
            return res.status(404).json({
                success: false,
                message:
                    "Pilot not found or not assigned to you"
            });
        }

        // 5. Pilot must be completed

        if (pilot.status !== "Completed") {
            return res.status(400).json({
                success: false,
                message:
                    "Pilot must be completed before evaluation"
            });
        }

        // 6. Prevent duplicate evaluation

        const existingEvaluation =
            await PilotEvaluation.findOne({
                pilotId: pilot._id
            });

        if (existingEvaluation) {
            return res.status(409).json({
                success: false,
                message:
                    "An evaluation already exists for this pilot"
            });
        }

        // 7. Create evaluation

        const evaluation =
            await PilotEvaluation.create({
                pilotId: pilot._id,

                governmentOfficerId:
                    officer._id,

                score,

                technicalAssessment:
                    technicalAssessment.trim(),

                observations:
                    observations.trim(),

                recommendation,

                status: "Submitted"
            });

        return res.status(201).json({
            success: true,
            message:
                "Pilot evaluation submitted successfully",
            evaluation
        });

    } catch (error) {

        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message:
                    "An evaluation already exists for this pilot"
            });
        }

        console.error(
            "SUBMIT PILOT EVALUATION ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to submit pilot evaluation"
        });
    }
};


const getPilotEvaluation = async (req, res) => {
    try {
        const { pilotId } = req.params;

        // 1. Find logged-in officer

        const officer =
            await GovernmentOfficer.findOne({
                firebaseUid: req.user.uid,
                isActive: true
            });

        if (!officer) {
            return res.status(403).json({
                success: false,
                message:
                    "Government officer profile not found"
            });
        }

        // 2. Verify pilot belongs to officer

        const pilot = await Pilot.findOne({
            _id: pilotId,
            governmentOfficerId: officer._id
        });

        if (!pilot) {
            return res.status(404).json({
                success: false,
                message:
                    "Pilot not found or not assigned to you"
            });
        }

        // 3. Get evaluation

        const evaluation =
            await PilotEvaluation.findOne({
                pilotId: pilot._id
            }).populate({
                path: "governmentOfficerId",
                select:
                    "name designation email"
            });

        if (!evaluation) {
            return res.status(404).json({
                success: false,
                message:
                    "Pilot evaluation not found"
            });
        }

        return res.status(200).json({
            success: true,
            evaluation
        });

    } catch (error) {

        console.error(
            "GET PILOT EVALUATION ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to fetch pilot evaluation"
        });
    }
};


export {
    submitPilotEvaluation,
    getPilotEvaluation
};