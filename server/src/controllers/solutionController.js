import Solution from "../models/Solution.js";
import University from "../models/University.js";
import Challenge from "../models/Challenge.js";

const createSolution = async (req, res) => {

    try {

        const {
            challengeId,
            title,
            description,
            proposedSolution,
            technologies,
            expectedImpact,
            proposalDocumentUrl,
            demoVideoUrl,
            githubRepoUrl
        } = req.body;

        // 1. Validate required fields

        if (!challengeId) {
            return res.status(400).json({
                success: false,
                message: "Challenge ID is required"
            });
        }

        if (!title || title.trim().length < 5) {
            return res.status(400).json({
                success: false,
                message: "Solution title must be at least 5 characters"
            });
        }

        if (!description || description.trim().length < 20) {
            return res.status(400).json({
                success: false,
                message: "Description must be at least 20 characters"
            });
        }

        if (
            !proposedSolution ||
            proposedSolution.trim().length < 50
        ) {
            return res.status(400).json({
                success: false,
                message: "Proposed solution must be at least 50 characters"
            });
        }

        if (!expectedImpact || expectedImpact.trim().length < 10) {
            return res.status(400).json({
                success: false,
                message: "Expected impact is required"
            });
        }
        if (!proposalDocumentUrl || proposalDocumentUrl.trim().length === 0) {
            return res.status(400).json({
                success: false,
                message: "Proposal document link is required"
            });
        }

        // 2. Find university using Firebase UID

        const university = await University.findOne({
            firebaseUid: req.user.uid,
            isActive: true
        });

        if (!university) {
            return res.status(403).json({
                success: false,
                message: "University profile not found"
            });
        }

        // 3. Check whether challenge exists

        const challenge = await Challenge.findById(challengeId);

        if (!challenge) {
            return res.status(404).json({
                success: false,
                message: "Challenge not found"
            });
        }

        // 4. Only allow solutions for open challenges

        if (challenge.status !== "Open") {
            return res.status(400).json({
                success: false,
                message: "This challenge is not accepting solutions"
            });
        }

        // 5. Check whether university already submitted

        const existingSolution = await Solution.findOne({
            universityId: university._id,
            challengeId: challenge._id
        });

        if (existingSolution) {
            return res.status(409).json({
                success: false,
                message: "Your university has already submitted a solution for this challenge"
            });
        }

        // 6. Create solution

        const solution = await Solution.create({
            universityId: university._id,
            challengeId: challenge._id,
            title: title.trim(),
            description: description.trim(),
            proposedSolution: proposedSolution.trim(),
            technologies: Array.isArray(technologies)
                ? technologies
                : [],
            expectedImpact: expectedImpact.trim(),
            proposalDocumentUrl: proposalDocumentUrl.trim(),
            demoVideoUrl: demoVideoUrl?.trim(),
            githubRepoUrl: githubRepoUrl?.trim(),
            status: "Submitted"
        });

        // 7. Return result

        res.status(201).json({
            success: true,
            message: "Solution submitted successfully",
            solution
        });

    } catch (error) {

        // Handle MongoDB duplicate index just in case
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "Your university has already submitted a solution for this challenge"
            });
        }

        console.error(
            "CREATE SOLUTION ERROR:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to submit solution"
        });
    }
};

export default createSolution;