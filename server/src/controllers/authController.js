import User from "../models/User.js";

const registerCitizen = async (req, res) => {
    try {
        const firebaseUid = req.user.uid;

        // Check if this Firebase account already has a platform profile
        const existingUser = await User.findOne({ firebaseUid });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "User profile already exists"
            });
        }

        const user = await User.create({
            firebaseUid,
            role: "Citizen"
        });

        return res.status(201).json({
            success: true,
            message: "Citizen registered successfully",
            user
        });

    } catch (error) {
        console.error("REGISTER CITIZEN ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to register citizen"
        });
    }
};

const getMe = async (req, res) => {
    try {
        const firebaseUid = req.user.uid;

        const user = await User.findOne({ firebaseUid });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User profile not found"
            });
        }

        return res.status(200).json({
            success: true,
            user
        });

    } catch (error) {
        console.error("GET ME ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch user profile"
        });
    }
};

export {
    registerCitizen,
    getMe
};