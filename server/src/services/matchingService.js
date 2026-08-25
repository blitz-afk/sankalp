import University from "../models/University.js";
import Challenge from "../models/Challenge.js";

const getUniversityMatches = async (challenge) => {

    try {

        const universities = await University.find({
            isActive: true
        });

        const requiredDomains = (challenge.requiredDomains || [])
            .map(domain => domain.toLowerCase().trim());

        const matches = universities.map((university) => {

            const universityDomains = university.domains.map(
                domain => domain.toLowerCase().trim()
            );

            const matchedDomains = requiredDomains.filter(
                domain => universityDomains.includes(domain)
            );

            const matchScore =
                requiredDomains.length === 0
                    ? 0
                    : Math.round(
                        (matchedDomains.length / requiredDomains.length) * 100
                    );

            return {
                universityId: university._id,
                name: university.name,
                matchScore,
                matchedDomains
            };
        });

        matches.sort(
            (a, b) => b.matchScore - a.matchScore
        );

        return matches;

    } catch (error) {

        console.error(
            "UNIVERSITY MATCHING ERROR:",
            error.message
        );

        throw error;
    }
};
const getRecommendedChallenges = async (universityId) => {

    try {

        const university = await University.findById(universityId);

        if (!university) {
            throw new Error("University not found");
        }

        const challenges = await Challenge.find({
            status: "Open",
            requiredDomains: {
                $exists: true,
                $ne: []
            }
        });

        const universityDomains = university.domains.map(
            domain => domain.toLowerCase().trim()
        );

        const recommendations = challenges.map((challenge) => {

            const requiredDomains = challenge.requiredDomains.map(
                domain => domain.toLowerCase().trim()
            );

            const matchedDomains = requiredDomains.filter(
                domain => universityDomains.includes(domain)
            );

            const matchScore =
                requiredDomains.length === 0
                    ? 0
                    : Math.round(
                        (matchedDomains.length / requiredDomains.length) * 100
                    );

            return {
                challengeId: challenge._id,
                title: challenge.title,
                category: challenge.category,
                problemStatement: challenge.problemStatement,
                objective: challenge.objective,
                expectedOutcome: challenge.expectedOutcome,
                matchScore,
                matchedDomains
            };
        });

        recommendations.sort(
            (a, b) => b.matchScore - a.matchScore
        );

        return recommendations;

    } catch (error) {

        console.error(
            "CHALLENGE RECOMMENDATION ERROR:",
            error.message
        );

        throw error;
    }
};


export {
    getUniversityMatches,
    getRecommendedChallenges
};
