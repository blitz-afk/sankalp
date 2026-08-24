import Challenge from "../models/Challenge.js";
import Problem from "../models/Problem.js";
import generateChallenge from "./ai/challengeGenerator.js";

const createChallengeIfNeeded = async (category) => {

    // Check if a challenge already exists for this category
    const existingChallenge = await Challenge.findOne({
        category,
        status: {
            $in: ["Open", "In-Progress"]
        }
    });

    if (existingChallenge) {
        return existingChallenge;
    }

    // Get all valid problems belonging to this category
    const problems = await Problem.find({
        "aiAnalysis.isValid": true,
        "aiAnalysis.category": category
    }).select(
        "title description location aiAnalysis.severity aiAnalysis.summary"
    );

    if (problems.length === 0) {
        return null;
    }

    // Generate a challenge from the collected reports
    const challengeData = await generateChallenge({
        category,
        problems
    });

    // Save challenge
    const challenge = await Challenge.create({
        category,
        requiredDomains: generated.requiredDomains,
        title: challengeData.title,
        problemStatement: challengeData.problemStatement,
        objective: challengeData.objective,
        expectedOutcome: challengeData.expectedOutcome,
        reportCount: problems.length
    });

    return challenge;
};

export default createChallengeIfNeeded;