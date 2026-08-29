import Challenge from "../models/Challenge.js";

const getOpenChallenges = async (req, res) => {
    try {
        const challenges = await Challenge.find({
            status: {
                $in: ["Open", "In-Progress"]
            }
        })
            .sort({ createdAt: -1 })
            .lean();

        return res.status(200).json({
            success: true,
            challenges
        });

    } catch (error) {
        console.error(
            "GET OPEN CHALLENGES ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to fetch challenges"
        });
    }
};

export {
    getOpenChallenges
};