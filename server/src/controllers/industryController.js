import Industry from "../models/Industry.js";
import getRecommendedSolutions from "../services/industryMatchingService.js";

const createIndustry = async (req, res) => {
    try {
        const {
            name,
            description,
            domains,
            capabilities,
            resources,
            organizationType,
            contactPerson,
            location,
            website
        } = req.body;

        // 1. Validate required fields

        if (!name || name.trim().length < 2) {
            return res.status(400).json({
                success: false,
                message: "Industry name is required"
            });
        }

        if (!description || description.trim().length < 10) {
            return res.status(400).json({
                success: false,
                message: "Industry description is required"
            });
        }

        if (!Array.isArray(domains) || domains.length === 0) {
            return res.status(400).json({
                success: false,
                message: "At least one domain is required"
            });
        }

        if (!organizationType) {
            return res.status(400).json({
                success: false,
                message: "Organization type is required"
            });
        }

        if (!contactPerson?.name) {
            return res.status(400).json({
                success: false,
                message: "Contact person name is required"
            });
        }

        // 2. Check whether this Firebase account
        // already has an Industry profile

        const existingIndustry = await Industry.findOne({
            firebaseUid: req.user.uid
        });

        if (existingIndustry) {
            return res.status(409).json({
                success: false,
                message: "Industry profile already exists"
            });
        }

        // 3. Create Industry profile

        const industry = await Industry.create({
            firebaseUid: req.user.uid,
            name: name.trim(),
            description: description.trim(),

            domains: domains.map(
                domain => domain.trim()
            ),

            capabilities: Array.isArray(capabilities)
                ? capabilities.map(
                    capability => capability.trim()
                )
                : [],

            resources: Array.isArray(resources)
                ? resources.map(
                    resource => resource.trim()
                )
                : [],

            organizationType,

            contactPerson,

            location,

            website: website?.trim()
        });

        res.status(201).json({
            success: true,
            message: "Industry profile created successfully",
            industry
        });

    } catch (error) {

        // Handle duplicate firebaseUid
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "Industry profile already exists"
            });
        }

        console.error(
            "CREATE INDUSTRY ERROR:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to create industry profile"
        });
    }
};


const getMyIndustry = async (req, res) => {
    try {

        const industry = await Industry.findOne({
            firebaseUid: req.user.uid
        }).select("-__v");

        if (!industry) {
            return res.status(404).json({
                success: false,
                message: "Industry profile not found"
            });
        }

        res.status(200).json({
            success: true,
            industry
        });

    } catch (error) {

        console.error(
            "GET MY INDUSTRY ERROR:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to fetch industry profile"
        });
    }
};


const getAllIndustries = async (req, res) => {
    try {

        const industries = await Industry.find({
            isActive: true
        }).select("-__v");

        res.status(200).json({
            success: true,
            count: industries.length,
            industries
        });

    } catch (error) {

        console.error(
            "GET INDUSTRIES ERROR:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to fetch industries"
        });
    }
};


const getIndustryById = async (req, res) => {
    try {

        const industry = await Industry.findOne({
            _id: req.params.id,
            isActive: true
        }).select("-__v");

        if (!industry) {
            return res.status(404).json({
                success: false,
                message: "Industry not found"
            });
        }

        res.status(200).json({
            success: true,
            industry
        });

    } catch (error) {

        console.error(
            "GET INDUSTRY BY ID ERROR:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to fetch industry"
        });
    }
};
const getMyRecommendations = async (req, res) => {
    try {

        // 1. Find the logged-in industry

        const industry = await Industry.findOne({
            firebaseUid: req.user.uid,
            isActive: true
        });

        if (!industry) {
            return res.status(404).json({
                success: false,
                message: "Industry profile not found"
            });
        }

        // 2. Get recommended solutions

        const recommendations =
            await getRecommendedSolutions(industry._id);

        res.status(200).json({
            success: true,
            count: recommendations.length,
            recommendations
        });

    } catch (error) {

        console.error(
            "GET INDUSTRY RECOMMENDATIONS ERROR:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to fetch industry recommendations"
        });
    }
};


export {
    createIndustry,
    getMyIndustry,
    getAllIndustries,
    getIndustryById,
    getMyRecommendations
};