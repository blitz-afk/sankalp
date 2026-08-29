import Challenge from "../models/Challenge.js";
import Problem from "../models/Problem.js";
import generateChallenge from "./ai/generateChallenge.js";

const createChallengeIfNeeded = async (category) => {
    const existingChallenge = await Challenge.findOne({
        category,
        status: {
            $in: ["Open", "In-Progress"]
        }
    });

    if (existingChallenge) {
        return existingChallenge;
    }

    const problems = await Problem.find({
        "aiAnalysis.isValid": true,
        "aiAnalysis.category": category
    }).select(
        "title description location aiAnalysis.severity aiAnalysis.summary"
    );

    if (problems.length === 0) {
        return null;
    }

    const challengeData = await generateChallenge({
        category,
        problems
    });

    const challenge = await Challenge.create({
        category,
        requiredDomains: challengeData.requiredDomains,
        title: challengeData.title,
        problemStatement: challengeData.problemStatement,
        objective: challengeData.objective,
        expectedOutcome: challengeData.expectedOutcome,
        reportCount: problems.length
    });

    return challenge;
};

export default createChallengeIfNeeded;