import admin from "../config/firebase.js";

const firebaseAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                message: "Authentication required"
            });
        }

        const token = authHeader.split("Bearer ")[1];

        const decodedToken = await admin.auth().verifyIdToken(token);

        req.user = decodedToken;

        next();

    } catch (error) {
        console.error("Firebase authentication failed:", error.message);

        return res.status(401).json({
            message: "Invalid or expired token"
        });
    }
};

export default firebaseAuth;