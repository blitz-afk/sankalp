import Pilot from "../models/Pilot.js";
import GovernmentOfficer from "../models/GovernmentOfficer.js";

const getMyPilots = async (req, res) => {
    try {
        // 1. Find logged-in government officer

        const officer = await GovernmentOfficer.findOne({
            firebaseUid: req.user.uid,
            isActive: true
        });

        if (!officer) {
            return res.status(403).json({
                success: false,
                message: "Government officer profile not found"
            });
        }

        // 2. Get pilots assigned to this officer

        const pilots = await Pilot.find({
            governmentOfficerId: officer._id
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
                path: "governmentBodyId",
                select: "name department description"
            })
            .sort({
                createdAt: -1
            });

        return res.status(200).json({
            success: true,
            count: pilots.length,
            pilots
        });

    } catch (error) {

        console.error(
            "GET MY PILOTS ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to fetch pilots"
        });
    }
};


const startPilot = async (req, res) => {
    try {
        const { pilotId } = req.params;

        // 1. Find logged-in officer

        const officer = await GovernmentOfficer.findOne({
            firebaseUid: req.user.uid,
            isActive: true
        });

        if (!officer) {
            return res.status(403).json({
                success: false,
                message: "Government officer profile not found"
            });
        }

        // 2. Find pilot assigned to officer

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

        // 3. Pilot must be planned

        if (pilot.status !== "Planned") {
            return res.status(400).json({
                success: false,
                message:
                    "Only planned pilots can be started"
            });
        }

        // 4. Start pilot

        pilot.status = "In Progress";

        // Start date becomes actual start date

        pilot.startDate = new Date();

        await pilot.save();

        return res.status(200).json({
            success: true,
            message: "Pilot started successfully",
            pilot
        });

    } catch (error) {

        console.error(
            "START PILOT ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to start pilot"
        });
    }
};


const completePilot = async (req, res) => {
    try {
        const { pilotId } = req.params;
        const { results } = req.body;

        // 1. Results required

        if (!results || results.trim().length < 20) {
            return res.status(400).json({
                success: false,
                message:
                    "Pilot results must be at least 20 characters"
            });
        }

        // 2. Find logged-in officer

        const officer = await GovernmentOfficer.findOne({
            firebaseUid: req.user.uid,
            isActive: true
        });

        if (!officer) {
            return res.status(403).json({
                success: false,
                message: "Government officer profile not found"
            });
        }

        // 3. Find pilot assigned to officer

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

        // 4. Pilot must be in progress

        if (pilot.status !== "In Progress") {
            return res.status(400).json({
                success: false,
                message:
                    "Only pilots in progress can be completed"
            });
        }

        // 5. Save results

        pilot.results = results.trim();

        pilot.status = "Completed";

        // Actual completion date

        pilot.endDate = new Date();

        await pilot.save();

        return res.status(200).json({
            success: true,
            message: "Pilot completed successfully",
            pilot
        });

    } catch (error) {

        console.error(
            "COMPLETE PILOT ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to complete pilot"
        });
    }
};


export {
    getMyPilots,
    startPilot,
    completePilot
};