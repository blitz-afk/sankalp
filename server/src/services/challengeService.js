import Challenge from "../models/Challenge.js";
import Problem from "../models/Problem.js";

import getProblemTypeCount from "./aggregationService.js";
import generateChallenge from "./ai/generateChallenge.js";

const createChallengeIfNeeded = async (category, problemType) => {

    // 1. Check whether this specific problem type reached the threshold
    const aggregation = await getProblemTypeCount(
        category,
        problemType
    );

    if (!aggregation.thresholdReached) {
        return null;
    }

    // 2. Get the unassigned valid reports for this problem type
    const problems = await Problem.find({
        "aiAnalysis.isValid": true,
        "aiAnalysis.category": category,
        "aiAnalysis.problemType": problemType,
        challengeId: null
    }).select(
        "title description location aiAnalysis.severity aiAnalysis.summary"
    );

    if (problems.length < aggregation.count) {
        return null;
    }

    // 3. Generate a challenge from these reports
    const challengeData = await generateChallenge({
        category,
        problemType,
        problems
    });

    // 4. Create the challenge
    const challenge = await Challenge.create({
        category,
        requiredDomains: challengeData.requiredDomains,
        title: challengeData.title,
        problemStatement: challengeData.problemStatement,
        objective: challengeData.objective,
        expectedOutcome: challengeData.expectedOutcome,
        reportCount: problems.length
    });

    // 5. Link the reports to this challenge
    await Problem.updateMany(
        {
            _id: {
                $in: problems.map(problem => problem._id)
            }
        },
        {
            $set: {
                challengeId: challenge._id
            }
        }
    );

    return challenge;
};

export default createChallengeIfNeeded;