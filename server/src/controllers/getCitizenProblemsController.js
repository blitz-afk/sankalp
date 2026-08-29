import Problem from "../models/Problem.js";

const getCitizenProblems = async (req, res) => {
    try {
        const problems = await Problem.find({
            submittedBy: req.user.uid
        })
            .sort({ createdAt: -1 })
            .lean();

        return res.status(200).json({
            success: true,
            problems
        });

    } catch (error) {
        console.error(
            "Failed to fetch citizen reports:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to fetch your reports"
        });
    }
};

export default getCitizenProblems;