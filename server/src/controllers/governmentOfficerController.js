import GovernmentOfficer from "../models/GovernmentOfficer.js";
import GovernmentBody from "../models/GovernmentBody.js";

const createGovernmentOfficer = async (req, res) => {
    try {
        const {
            governmentBodyId,
            name,
            designation,
            phone
        } = req.body;

        // 1. Validate required fields

        if (!governmentBodyId) {
            return res.status(400).json({
                success: false,
                message: "Government body ID is required"
            });
        }

        if (!name || name.trim().length < 2) {
            return res.status(400).json({
                success: false,
                message: "Officer name is required"
            });
        }

        if (!designation || designation.trim().length < 2) {
            return res.status(400).json({
                success: false,
                message: "Officer designation is required"
            });
        }

        // 2. Get identity from Firebase

        const firebaseUid = req.user.uid;
        const email = req.user.email;

        if (!firebaseUid) {
            return res.status(401).json({
                success: false,
                message: "Firebase user identity not found"
            });
        }

        // 3. Find government body

        const governmentBody = await GovernmentBody.findOne({
            _id: governmentBodyId,
            isActive: true
        });

        if (!governmentBody) {
            return res.status(404).json({
                success: false,
                message: "Government body not found"
            });
        }

        // 4. Check whether officer profile already exists

        const existingOfficer =
            await GovernmentOfficer.findOne({
                firebaseUid
            });

        if (existingOfficer) {
            return res.status(409).json({
                success: false,
                message:
                    "Government officer profile already exists"
            });
        }

        // 5. Create officer

        const governmentOfficer =
            await GovernmentOfficer.create({
                firebaseUid,

                governmentBodyId:
                    governmentBody._id,

                name: name.trim(),

                designation:
                    designation.trim(),

                email,

                phone: phone?.trim(),

                isActive: true
            });

        // 6. Return result

        return res.status(201).json({
            success: true,
            message:
                "Government officer profile created successfully",
            governmentOfficer
        });

    } catch (error) {

        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message:
                    "Government officer profile already exists"
            });
        }

        console.error(
            "CREATE GOVERNMENT OFFICER ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to create government officer profile"
        });
    }
};

export default createGovernmentOfficer;