import Problem from "../models/Problem.js";
import uploadToCloudinary from "../services/cloudinaryService.js";
import createChallengeIfNeeded from "../services/challengeService.js";

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

export default createProblem;