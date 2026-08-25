import GovernmentBody from "../models/GovernmentBody.js";

const createGovernmentBody = async (req, res) => {
    try {
        const {
            name,
            department,
            description,
            domains,
            responsibilities,
            location,
            contactPerson
        } = req.body;

        // 1. Validate required fields

        if (!name || name.trim().length < 2) {
            return res.status(400).json({
                success: false,
                message: "Government body name is required"
            });
        }

        if (!department || department.trim().length < 2) {
            return res.status(400).json({
                success: false,
                message: "Department is required"
            });
        }

        if (!description || description.trim().length < 10) {
            return res.status(400).json({
                success: false,
                message: "Government body description is required"
            });
        }

        if (!Array.isArray(domains) || domains.length === 0) {
            return res.status(400).json({
                success: false,
                message: "At least one domain is required"
            });
        }

        if (!contactPerson?.name) {
            return res.status(400).json({
                success: false,
                message: "Contact person name is required"
            });
        }

        // 2. Check whether profile already exists

        const existingGovernmentBody =
            await GovernmentBody.findOne({
                firebaseUid: req.user.uid
            });

        if (existingGovernmentBody) {
            return res.status(409).json({
                success: false,
                message: "Government body profile already exists"
            });
        }

        // 3. Create profile

        const governmentBody = await GovernmentBody.create({
            firebaseUid: req.user.uid,

            name: name.trim(),

            department: department.trim(),

            description: description.trim(),

            domains: domains
                .map(domain => domain.trim())
                .filter(Boolean),

            responsibilities:
                Array.isArray(responsibilities)
                    ? responsibilities
                        .map(
                            responsibility =>
                                responsibility.trim()
                        )
                        .filter(Boolean)
                    : [],

            location,

            contactPerson
        });

        return res.status(201).json({
            success: true,
            message: "Government body profile created successfully",
            governmentBody
        });

    } catch (error) {

        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "Government body profile already exists"
            });
        }

        console.error(
            "CREATE GOVERNMENT BODY ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to create government body profile"
        });
    }
};


const getMyGovernmentBody = async (req, res) => {
    try {

        const governmentBody =
            await GovernmentBody.findOne({
                firebaseUid: req.user.uid
            }).select("-__v");

        if (!governmentBody) {
            return res.status(404).json({
                success: false,
                message: "Government body profile not found"
            });
        }

        return res.status(200).json({
            success: true,
            governmentBody
        });

    } catch (error) {

        console.error(
            "GET MY GOVERNMENT BODY ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to fetch government body profile"
        });
    }
};


const getAllGovernmentBodies = async (req, res) => {
    try {

        const governmentBodies =
            await GovernmentBody.find({
                isActive: true
            }).select("-__v");

        return res.status(200).json({
            success: true,
            count: governmentBodies.length,
            governmentBodies
        });

    } catch (error) {

        console.error(
            "GET GOVERNMENT BODIES ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to fetch government bodies"
        });
    }
};


const getGovernmentBodyById = async (req, res) => {
    try {

        const governmentBody =
            await GovernmentBody.findOne({
                _id: req.params.id,
                isActive: true
            }).select("-__v");

        if (!governmentBody) {
            return res.status(404).json({
                success: false,
                message: "Government body not found"
            });
        }

        return res.status(200).json({
            success: true,
            governmentBody
        });

    } catch (error) {

        console.error(
            "GET GOVERNMENT BODY BY ID ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to fetch government body"
        });
    }
};


export {
    createGovernmentBody,
    getMyGovernmentBody,
    getAllGovernmentBodies,
    getGovernmentBodyById
};