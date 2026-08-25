import Pilot from "../models/Pilot.js";
import PilotEvaluation from "../models/PilotEvaluation.js";
import GovernmentBody from "../models/GovernmentBody.js";
import Challenge from "../models/Challenge.js";
import Problem from "../models/Problem.js";

const getGovernmentBodyPilots = async (req, res) => {
    try {
        // 1. Find logged-in government body

        const governmentBody = await GovernmentBody.findOne({
            firebaseUid: req.user.uid,
            isActive: true
        });

        if (!governmentBody) {
            return res.status(403).json({
                success: false,
                message: "Government body profile not found"
            });
        }

        // 2. Get pilots belonging to this government body

        const pilots = await Pilot.find({
            governmentBodyId: governmentBody._id,
            status: "Completed"
        })
            .populate({
                path: "solutionId",
                select: "title description technologies"
            })
            .populate({
                path: "problemIds",
                select: "title description location aiAnalysis"
            })
            .populate({
                path: "industryId",
                select: "name description domains capabilities resources"
            })
            .populate({
                path: "universityId",
                select: "name description"
            })
            .populate({
                path: "governmentOfficerId",
                select: "name designation email"
            })
            .sort({
                createdAt: -1
            });

        // 3. Get evaluations for these pilots

        const pilotIds = pilots.map(
            pilot => pilot._id
        );

        const evaluations =
            await PilotEvaluation.find({
                pilotId: {
                    $in: pilotIds
                }
            })
                .populate({
                    path: "governmentOfficerId",
                    select: "name designation email"
                });

        // 4. Combine pilot + evaluation

        const result = pilots.map(pilot => ({
            pilot,
            evaluation:
                evaluations.find(
                    evaluation =>
                        evaluation.pilotId.toString() ===
                        pilot._id.toString()
                ) || null
        }));

        return res.status(200).json({
            success: true,
            count: result.length,
            pilots: result
        });

    } catch (error) {

        console.error(
            "GET GOVERNMENT BODY PILOTS ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to fetch pilots for government body"
        });
    }
};


const verifyPilot = async (req, res) => {
    try {
        const { pilotId } = req.params;

        const {
            decision,
            remarks
        } = req.body;

        // 1. Validate decision

        if (
            !["Verified", "Rejected"].includes(
                decision
            )
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Decision must be Verified or Rejected"
            });
        }

        // 2. Find logged-in government body

        const governmentBody =
            await GovernmentBody.findOne({
                firebaseUid: req.user.uid,
                isActive: true
            });

        if (!governmentBody) {
            return res.status(403).json({
                success: false,
                message:
                    "Government body profile not found"
            });
        }

        // 3. Find pilot belonging to this body

        const pilot = await Pilot.findOne({
            _id: pilotId,
            governmentBodyId:
                governmentBody._id
        });

        if (!pilot) {
            return res.status(404).json({
                success: false,
                message:
                    "Pilot not found or does not belong to your government body"
            });
        }

        // 4. Pilot must be completed

        if (pilot.status !== "Completed") {
            return res.status(400).json({
                success: false,
                message:
                    "Only completed pilots can be verified"
            });
        }

        // 5. Find evaluation

        const evaluation =
            await PilotEvaluation.findOne({
                pilotId: pilot._id
            });

        if (!evaluation) {
            return res.status(400).json({
                success: false,
                message:
                    "Government officer evaluation is required before verification"
            });
        }

        // 6. Evaluation must be submitted

        if (evaluation.status !== "Submitted") {
            return res.status(400).json({
                success: false,
                message:
                    "This evaluation has already been reviewed"
            });
        }

        // 7. Save government body decision

        evaluation.status =
            decision === "Verified"
                ? "Approved"
                : "Rejected";

        evaluation.governmentBodyRemarks =
            remarks?.trim() || "";

        await evaluation.save();

        // 8. Update pilot status

        pilot.status = decision;

        await pilot.save();

        return res.status(200).json({
            success: true,
            message:
                decision === "Verified"
                    ? "Pilot verified successfully"
                    : "Pilot rejected successfully",
            pilot,
            evaluation
        });

        // 9. If pilot is verified, complete related challenges

        if (decision === "Verified") {

            const problems = await Problem.find({
                _id: {
                    $in: pilot.problemIds
                }
            }).select("challengeId");

            const challengeIds = [
                ...new Set(
                    problems
                        .map(problem => problem.challengeId?.toString())
                        .filter(Boolean)
                )
            ];

            if (challengeIds.length > 0) {
                await Challenge.updateMany(
                    {
                        _id: {
                            $in: challengeIds
                        }
                    },
                    {
                        $set: {
                            status: "Completed"
                        }
                    }
                );
            }
        }

    } catch (error) {

        console.error(
            "VERIFY PILOT ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to verify pilot"
        });
    }
};


export {
    getGovernmentBodyPilots,
    verifyPilot
};