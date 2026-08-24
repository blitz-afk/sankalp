import Problem from "../models/Problem.js";
import uploadToCloudinary from "../services/cloudinaryService.js";
import analyzeProblem from "../services/ai/geminiService.js";
import createChallengeIfNeeded from "../services/challengeService.js";

const createProblem = async (req, res) => {
    try {

        const { title, description } = req.body;
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "At least one image is required"
            });
        }

        if (!title || title.trim().length < 5) {
            return res.status(400).json({
                success: false,
                message: "Title must be at least 5 characters"
            });
        }

        if (!description || description.trim().length < 10) {
            return res.status(400).json({
                success: false,
                message: "Description must be at least 10 characters"
            });
        }
        let location;

        try {
            location = JSON.parse(req.body.location);
        } catch {
            return res.status(400).json({
                success: false,
                message: "Invalid location format"
            });
        }

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

        let aiAnalysis = null;
        try {
            aiAnalysis = await analyzeProblem({
                title: req.body.title,
                description: req.body.description,
                imageBuffer: req.file.buffer,
                mimeType: req.file.mimetype
            });
        } catch (error) {
            console.error("AI analysis failed:", error.message);
        }

        let media = [];
        const result = await uploadToCloudinary(req.file.buffer);
        media.push(result.secure_url);

        const problem = await Problem.create({
            submittedBy: req.user.uid,
            title: title.trim(),
            description: description.trim(),
            media,
            location: {
                latitude: location.latitude,
                longitude: location.longitude
            },
            aiAnalysis: aiAnalysis,
            status: "Submitted"
        })
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



        res.status(201).json({
            success: true,
            message: "Problem created successfully",
            problem
        })
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to submit problem"
        });
    }
}
export default createProblem;