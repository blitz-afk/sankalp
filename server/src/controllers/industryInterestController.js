import IndustryInterest from "../models/IndustryInterest.js";
import Industry from "../models/Industry.js";
import Solution from "../models/Solution.js";
import University from "../models/University.js";


const createIndustryInterest = async (req, res) => {
    try {
        const {
            solutionId,
            message,
            proposedRole,
            capabilities,
            resourcesOffered,
            pilotProposal
        } = req.body;

        // 1. Validate required fields

        if (!solutionId) {
            return res.status(400).json({
                success: false,
                message: "Solution ID is required"
            });
        }

        if (!message || message.trim().length < 20) {
            return res.status(400).json({
                success: false,
                message: "Interest message must be at least 20 characters"
            });
        }

        if (!proposedRole || proposedRole.trim().length < 5) {
            return res.status(400).json({
                success: false,
                message: "Proposed role must be at least 5 characters"
            });
        }

        // 2. Find the logged-in industry

        const industry = await Industry.findOne({
            firebaseUid: req.user.uid,
            isActive: true
        });

        if (!industry) {
            return res.status(403).json({
                success: false,
                message: "Industry profile not found"
            });
        }

        // 3. Check whether the solution exists

        const solution = await Solution.findById(solutionId);

        if (!solution) {
            return res.status(404).json({
                success: false,
                message: "Solution not found"
            });
        }

        // 4. Check whether the solution is accepting
        // industry interest

        if (
            solution.status !== "Submitted" &&
            solution.status !== "Under Review"
        ) {
            return res.status(400).json({
                success: false,
                message: "This solution is not currently accepting industry interest"
            });
        }

        // 5. Check whether this industry
        // already expressed interest

        const existingInterest = await IndustryInterest.findOne({
            industryId: industry._id,
            solutionId: solution._id
        });

        if (existingInterest) {
            return res.status(409).json({
                success: false,
                message: "Your industry has already expressed interest in this solution"
            });
        }

        // 6. Create industry interest

        const interest = await IndustryInterest.create({
            industryId: industry._id,
            solutionId: solution._id,

            message: message.trim(),

            proposedRole: proposedRole.trim(),

            capabilities: Array.isArray(capabilities)
                ? capabilities
                    .map(capability => capability.trim())
                    .filter(Boolean)
                : [],

            resourcesOffered: Array.isArray(resourcesOffered)
                ? resourcesOffered
                    .map(resource => resource.trim())
                    .filter(Boolean)
                : [],

            pilotProposal: pilotProposal?.trim(),

            status: "Pending"
        });

        // 7. Return created interest

        return res.status(201).json({
            success: true,
            message: "Industry interest submitted successfully",
            interest
        });

    } catch (error) {

        // Handle duplicate compound index

        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "Your industry has already expressed interest in this solution"
            });
        }

        console.error(
            "CREATE INDUSTRY INTEREST ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to submit industry interest"
        });
    }
};


const getMyIndustryInterests = async (req, res) => {
    try {

        // 1. Find logged-in industry

        const industry = await Industry.findOne({
            firebaseUid: req.user.uid,
            isActive: true
        });

        if (!industry) {
            return res.status(403).json({
                success: false,
                message: "Industry profile not found"
            });
        }

        // 2. Get all interests created by this industry

        const interests = await IndustryInterest.find({
            industryId: industry._id
        })
            .populate({
                path: "solutionId",
                select:
                    "title description technologies universityId challengeId"
            })
            .sort({
                createdAt: -1
            });

        return res.status(200).json({
            success: true,
            count: interests.length,
            interests
        });

    } catch (error) {

        console.error(
            "GET MY INDUSTRY INTERESTS ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to fetch industry interests"
        });
    }
};
const getSolutionInterests = async (req, res) => {
    try {
        // 1. Find the logged-in university
        const university = await University.findOne({
            firebaseUid: req.user.uid,
            isActive: true
        });

        if (!university) {
            return res.status(403).json({
                success: false,
                message: "University profile not found"
            });
        }

        // 2. Find solutions owned by this university
        const solutions = await Solution.find({
            universityId: university._id
        }).select("_id");

        const solutionIds = solutions.map(
            solution => solution._id
        );

        // 3. Get industry interests for those solutions
        const interests = await IndustryInterest.find({
            solutionId: {
                $in: solutionIds
            }
        })
            .populate({
                path: "industryId",
                select: "name description domains capabilities resources organizationType contactPerson location website"
            })
            .populate({
                path: "solutionId",
                select: "title description technologies challengeId"
            })
            .sort({
                createdAt: -1
            });

        return res.status(200).json({
            success: true,
            count: interests.length,
            interests
        });

    } catch (error) {

        console.error(
            "GET SOLUTION INTERESTS ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to fetch industry interests"
        });
    }
};
const acceptIndustryInterest = async (req, res) => {
    try {
        const { id } = req.params;

        // 1. Find logged-in university

        const university = await University.findOne({
            firebaseUid: req.user.uid,
            isActive: true
        });

        if (!university) {
            return res.status(403).json({
                success: false,
                message: "University profile not found"
            });
        }

        // 2. Find the interest

        const interest = await IndustryInterest.findById(id);

        if (!interest) {
            return res.status(404).json({
                success: false,
                message: "Industry interest not found"
            });
        }

        // 3. Find the solution

        const solution = await Solution.findById(
            interest.solutionId
        );

        if (!solution) {
            return res.status(404).json({
                success: false,
                message: "Solution not found"
            });
        }

        // 4. Verify that this university owns the solution

        if (
            solution.universityId.toString() !==
            university._id.toString()
        ) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to accept this interest"
            });
        }

        // 5. Make sure interest is still pending

        if (interest.status !== "Pending") {
            return res.status(400).json({
                success: false,
                message: `This interest is already ${interest.status.toLowerCase()}`
            });
        }

        // 6. Accept interest

        interest.status = "Accepted";

        await interest.save();

        return res.status(200).json({
            success: true,
            message: "Industry interest accepted successfully",
            interest
        });

    } catch (error) {

        console.error(
            "ACCEPT INDUSTRY INTEREST ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to accept industry interest"
        });
    }
};


const rejectIndustryInterest = async (req, res) => {
    try {
        const { id } = req.params;
        const { rejectionReason } = req.body;

        // 1. Find logged-in university

        const university = await University.findOne({
            firebaseUid: req.user.uid,
            isActive: true
        });

        if (!university) {
            return res.status(403).json({
                success: false,
                message: "University profile not found"
            });
        }

        // 2. Find the interest

        const interest = await IndustryInterest.findById(id);

        if (!interest) {
            return res.status(404).json({
                success: false,
                message: "Industry interest not found"
            });
        }

        // 3. Find the solution

        const solution = await Solution.findById(
            interest.solutionId
        );

        if (!solution) {
            return res.status(404).json({
                success: false,
                message: "Solution not found"
            });
        }

        // 4. Verify solution ownership

        if (
            solution.universityId.toString() !==
            university._id.toString()
        ) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to reject this interest"
            });
        }

        // 5. Make sure interest is still pending

        if (interest.status !== "Pending") {
            return res.status(400).json({
                success: false,
                message: `This interest is already ${interest.status.toLowerCase()}`
            });
        }

        // 6. Reject interest

        interest.status = "Rejected";

        if (rejectionReason) {
            interest.rejectionReason =
                rejectionReason.trim();
        }

        await interest.save();

        return res.status(200).json({
            success: true,
            message: "Industry interest rejected successfully",
            interest
        });

    } catch (error) {

        console.error(
            "REJECT INDUSTRY INTEREST ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to reject industry interest"
        });
    }
};

export {
    createIndustryInterest,
    getMyIndustryInterests,
    getSolutionInterests,
    acceptIndustryInterest,
    rejectIndustryInterest
};