import analyzeProblem from "../services/ai/geminiService.js";
import reverseGeocode from "../services/geocodingService.js";

const analyzeProblemPreview = async (req, res) => {
    try {
        const { description } = req.body;

        // -----------------------------
        // VALIDATE DESCRIPTION
        // -----------------------------

        if (!description || description.trim().length < 10) {
            return res.status(400).json({
                success: false,
                message: "Description must be at least 10 characters"
            });
        }

        // -----------------------------
        // VALIDATE IMAGE
        // -----------------------------

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "A live image is required"
            });
        }

        // -----------------------------
        // PARSE LOCATION
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
        // VALIDATE GPS
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
        // GEMINI ANALYSIS
        // -----------------------------

        let aiAnalysis;

        try {
            aiAnalysis = await analyzeProblem({
                description: description.trim(),
                imageBuffer: req.file.buffer,
                mimeType: req.file.mimetype
            });
        } catch (error) {
            console.error(
                "AI analysis failed:",
                error.message
            );

            return res.status(500).json({
                success: false,
                message: "AI analysis failed"
            });
        }

        // -----------------------------
        // INVALID REPORT
        // -----------------------------

        if (!aiAnalysis?.isValid) {
            return res.status(422).json({
                success: false,
                valid: false,
                message:
                    "The submitted image could not be verified as a valid civic problem.",
                aiAnalysis
            });
        }

        // -----------------------------
        // REVERSE GEOCODING
        // -----------------------------

        let locationDetails;

        try {
            locationDetails = await reverseGeocode(
                location.latitude,
                location.longitude
            );
        } catch (error) {
            console.error(
                "Reverse geocoding failed:",
                error.message
            );

            // We still return coordinates so the frontend
            // knows the GPS capture succeeded.
            locationDetails = {
                address: "",
                city: "",
                state: "",
                country: ""
            };
        }

        // -----------------------------
        // RETURN PREVIEW
        // -----------------------------

        return res.status(200).json({
            success: true,
            valid: true,

            preview: {
                // AI validation
                isValid: aiAnalysis.isValid,

                imageMatchesReport:
                    aiAnalysis.imageMatchesReport,

                confidence:
                    aiAnalysis.confidence,

                // AI-generated title
                title:
                    aiAnalysis.title,

                // Original citizen description
                description:
                    description.trim(),

                // AI classification
                category:
                    aiAnalysis.category,

                problemType:
                    aiAnalysis.problemType,

                severity:
                    aiAnalysis.severity,

                summary:
                    aiAnalysis.summary,

                suggestedDepartment:
                    aiAnalysis.suggestedDepartment,

                possibleAiGeneratedImage:
                    aiAnalysis.possibleAiGeneratedImage,

                // Captured GPS + reverse-geocoded location
                location: {
                    latitude:
                        location.latitude,

                    longitude:
                        location.longitude,

                    address:
                        locationDetails.address || "",

                    city:
                        locationDetails.city || "",

                    state:
                        locationDetails.state || "",

                    country:
                        locationDetails.country || ""
                }
            }
        });

    } catch (error) {
        console.error(
            "Problem preview failed:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to analyze problem"
        });
    }
};

export default analyzeProblemPreview;