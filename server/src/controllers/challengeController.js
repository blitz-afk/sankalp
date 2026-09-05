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
const getChallengeById = async (req, res) => {
    try {
        const { id } = req.params;

        const challenge = await Challenge.findById(id).lean();

        if (!challenge) {
            return res.status(404).json({
                success: false,
                message: "Challenge not found"
            });
        }

        return res.status(200).json({
            success: true,
            challenge
        });

    } catch (error) {
        console.error(
            "GET CHALLENGE ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to fetch challenge"
        });
    }
};

export {
    getOpenChallenges,
    getChallengeById
};