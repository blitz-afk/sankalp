import Problem from "../models/Problem.js";
import uploadToCloudinary from "../services/cloudinaryService.js";
import createChallengeIfNeeded from "../services/challengeService.js";
import Challenge from "../models/Challenge.js";

const createProblem = async (req, res) => {
    try {
        const { description, analysis } = req.body;

        // -----------------------------
        // IMAGE VALIDATION
        // -----------------------------

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "At least one image is required"
            });
        }

        // -----------------------------
        // DESCRIPTION VALIDATION
        // -----------------------------

        if (!description || description.trim().length < 10) {
            return res.status(400).json({
                success: false,
                message: "Description must be at least 10 characters"
            });
        }

        // -----------------------------
        // ANALYSIS VALIDATION
        // -----------------------------

        if (!analysis) {
            return res.status(400).json({
                success: false,
                message: "Report analysis is required"
            });
        }

        let aiAnalysis;

        try {
            aiAnalysis =
                typeof analysis === "string"
                    ? JSON.parse(analysis)
                    : analysis;
        } catch {
            return res.status(400).json({
                success: false,
                message: "Invalid analysis format"
            });
        }

        if (!aiAnalysis?.isValid) {
            return res.status(422).json({
                success: false,
                message:
                    "The report did not pass AI verification."
            });
        }

        // -----------------------------
        // LOCATION
        // -----------------------------

        let location;

        try {
            location = JSON.parse(req.body.location);
        } catch {
            return res.status(400).json({
                success: false,
                message: "Invalid location format"
            });
        }

        // -----------------------------
        // LOCATION VALIDATION
        // -----------------------------

        if (
            typeof location.latitude !== "number" ||
            typeof location.longitude !== "number" ||
            location.latitude < -90 ||
            location.latitude > 90 ||
            location.longitude < -180 ||
            location.longitude > 180
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid latitude or longitude"
            });
        }

        // -----------------------------
        // CLOUDINARY
        // -----------------------------

        const result = await uploadToCloudinary(
            req.file.buffer
        );

        const media = [result.secure_url];

        // -----------------------------
        // CREATE PROBLEM
        // -----------------------------

        const problem = await Problem.create({
            submittedBy: req.user.uid,

            // Gemini-generated title
            title: aiAnalysis.title,

            // Citizen's original description
            description: description.trim(),

            media,

            // Location already reverse-geocoded
            // during /api/problems/analyze
            location: {
                latitude: location.latitude,
                longitude: location.longitude,
                address:
                    location.address || "",
                city:
                    location.city || "",
                state:
                    location.state || "",
                country:
                    location.country || ""
            },

            // Reuse the analysis confirmed by
            // the citizen instead of running Gemini again.
            aiAnalysis,

            status: "Submitted"
        });

        // -----------------------------
        // CREATE CHALLENGE
        // -----------------------------

        try {
            await createChallengeIfNeeded(
                aiAnalysis.category,
                aiAnalysis.problemType
            );
        } catch (error) {
            console.error(
                "Challenge generation failed:",
                error.message
            );
        }

        // -----------------------------
        // RESPONSE
        // -----------------------------

        return res.status(201).json({
            success: true,
            message: "Problem created successfully",
            problem
        });

    } catch (error) {
        console.error(
            "Problem creation failed:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to submit problem"
        });
    }
};
const getProblemsByChallenge = async (req, res) => {
    try {
        const { challengeId } = req.params;

        const challenge = await Challenge.findById(challengeId).lean();

        if (!challenge) {
            return res.status(404).json({
                success: false,
                message: "Challenge not found"
            });
        }

        // First try problems explicitly linked to this challenge
        let problems = await Problem.find({
            challengeId,
            "aiAnalysis.isValid": true
        })
            .select(
                "_id title description location aiAnalysis status createdAt"
            )
            .sort({ createdAt: -1 })
            .lean();

        // Existing problems created before challengeId was added
        // may not be linked yet. Recover them using the challenge category.
        if (problems.length === 0) {
            problems = await Problem.find({
                challengeId: null,
                "aiAnalysis.isValid": true,
                "aiAnalysis.category": challenge.category
            })
                .select(
                    "_id title description location aiAnalysis status createdAt"
                )
                .sort({ createdAt: -1 })
                .lean();

            // Attach recovered problems to this challenge
            if (problems.length > 0) {
                await Problem.updateMany(
                    {
                        _id: {
                            $in: problems.map((problem) => problem._id)
                        }
                    },
                    {
                        $set: {
                            challengeId: challenge._id
                        }
                    }
                );
            }
        }

        return res.status(200).json({
            success: true,
            count: problems.length,
            problems
        });

    } catch (error) {
        console.error(
            "GET PROBLEMS BY CHALLENGE ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to fetch challenge problems"
        });
    }
};

export {
    createProblem,
    getProblemsByChallenge
};