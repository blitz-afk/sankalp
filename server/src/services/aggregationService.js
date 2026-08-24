import Problem from "../models/Problem.js";
import { CHALLENGE_THRESHOLD } from "../config/constants.js";

const getProblemTypeCount = async (category, problemType) => {

    const count = await Problem.countDocuments({
        "aiAnalysis.isValid": true,
        "aiAnalysis.category": category,
        "aiAnalysis.problemType": problemType,
        challengeId: null
    });

    return {
        category,
        problemType,
        count,
        thresholdReached: count >= CHALLENGE_THRESHOLD
    };
};

export default getProblemTypeCount;