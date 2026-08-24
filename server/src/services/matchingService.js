import University from "../models/University.js";

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

export default getUniversityMatches;