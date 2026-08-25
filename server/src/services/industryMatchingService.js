import Industry from "../models/Industry.js";
import Solution from "../models/Solution.js";
import Challenge from "../models/Challenge.js";

const getRecommendedSolutions = async (industryId) => {
    try {

        // 1. Find the industry

        const industry = await Industry.findOne({
            _id: industryId,
            isActive: true
        });

        if (!industry) {
            throw new Error("Industry not found");
        }

        // 2. Get solutions that are available
        // for industry participation

        const solutions = await Solution.find({
            status: {
                $in: ["Submitted", "Under Review"]
            }
        });

        const recommendations = [];

        // 3. Normalize industry domains

        const industryDomains = (industry.domains || [])
            .map(domain =>
                domain.toLowerCase().trim()
            );

        // 4. Evaluate every solution

        for (const solution of solutions) {

            // Find the challenge associated with solution

            const challenge = await Challenge.findById(
                solution.challengeId
            );

            if (!challenge) {
                continue;
            }

            // Normalize solution technologies

            const solutionTechnologies =
                (solution.technologies || [])
                    .map(technology =>
                        technology.toLowerCase().trim()
                    );

            // Normalize challenge required domains

            const requiredDomains =
                (challenge.requiredDomains || [])
                    .map(domain =>
                        domain.toLowerCase().trim()
                    );

            // 5. Match industry domains
            // with solution technologies

            const matchedTechnologies =
                solutionTechnologies.filter(
                    technology =>
                        industryDomains.includes(technology)
                );

            // 6. Match industry domains
            // with challenge required domains

            const matchedRequiredDomains =
                requiredDomains.filter(
                    domain =>
                        industryDomains.includes(domain)
                );

            // 7. Calculate technology score
            // Weight = 50%

            const technologyScore =
                solutionTechnologies.length === 0
                    ? 0
                    : (
                        matchedTechnologies.length /
                        solutionTechnologies.length
                    ) * 50;

            // 8. Calculate challenge domain score
            // Weight = 50%

            const domainScore =
                requiredDomains.length === 0
                    ? 0
                    : (
                        matchedRequiredDomains.length /
                        requiredDomains.length
                    ) * 50;

            // 9. Final score

            const matchScore = Math.round(
                technologyScore + domainScore
            );

            // 10. Add recommendation

            recommendations.push({
                solutionId: solution._id,
                challengeId: challenge._id,

                universityId: solution.universityId,

                title: solution.title,

                description: solution.description,

                technologies: solution.technologies,

                requiredDomains: challenge.requiredDomains,

                matchScore,

                matchedTechnologies,

                matchedRequiredDomains
            });
        }

        // 11. Highest match first

        recommendations.sort(
            (a, b) =>
                b.matchScore - a.matchScore
        );

        return recommendations;

    } catch (error) {

        console.error(
            "INDUSTRY SOLUTION MATCHING ERROR:",
            error.message
        );

        throw error;
    }
};

export default getRecommendedSolutions;