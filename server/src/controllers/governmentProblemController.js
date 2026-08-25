import Problem from "../models/Problem.js";
import GovernmentBody from "../models/GovernmentBody.js";
import GovernmentOfficer from "../models/GovernmentOfficer.js";

const assignOfficerToProblem = async (req, res) => {
    try {
        const { problemId } = req.params;
        const { governmentOfficerId } = req.body;

        // 1. Validate officer ID

        if (!governmentOfficerId) {
            return res.status(400).json({
                success: false,
                message: "Government officer ID is required"
            });
        }

        // 2. Find logged-in government body

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

        // 3. Find problem

        const problem = await Problem.findById(problemId);

        if (!problem) {
            return res.status(404).json({
                success: false,
                message: "Problem not found"
            });
        }

        // 4. Find officer

        const officer = await GovernmentOfficer.findOne({
            _id: governmentOfficerId,
            governmentBodyId: governmentBody._id,
            isActive: true
        });

        if (!officer) {
            return res.status(404).json({
                success: false,
                message:
                    "Government officer not found or does not belong to your government body"
            });
        }

        // 5. Assign government body + officer

        problem.governmentBodyId = governmentBody._id;
        problem.governmentOfficerId = officer._id;

        await problem.save();

        return res.status(200).json({
            success: true,
            message: "Government officer assigned to problem successfully",
            problem
        });

    } catch (error) {

        console.error(
            "ASSIGN OFFICER TO PROBLEM ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to assign government officer to problem"
        });
    }
};

export default assignOfficerToProblem;