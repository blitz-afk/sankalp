import Problem from "../models/Problem.js";
import uploadToCloudinary from "../services/cloudinaryService.js";

const createProblem = async (req, res) => {
    try {
        const { title, description } = req.body;
        const location = JSON.parse(req.body.location);
        let media = [];


        if (req.file) {
            const result = await uploadToCloudinary(req.file.buffer);
            media.push(result.secure_url);
        }
        const problem = await Problem.create({
            submittedBy: req.user.uid,
            title,
            description,
            media,
            location: {
                latitude: location.latitude,
                longitude: location.longitude
            },
            status: "Submitted"
        })


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