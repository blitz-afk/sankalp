import mongoose from "mongoose";

const industryInterestSchema = new mongoose.Schema(
    {
        industryId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Industry",
            required: true
        },

        solutionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Solution",
            required: true
        },

        message: {
            type: String,
            required: true,
            trim: true,
            minlength: 20,
            maxlength: 2000
        },

        proposedRole: {
            type: String,
            required: true,
            trim: true,
            maxlength: 1000
        },

        capabilities: {
            type: [String],
            default: []
        },

        resourcesOffered: {
            type: [String],
            default: []
        },

        pilotProposal: {
            type: String,
            trim: true,
            maxlength: 3000
        },

        status: {
            type: String,
            enum: [
                "Pending",
                "Accepted",
                "Rejected"
            ],
            default: "Pending"
        },

        rejectionReason: {
            type: String,
            trim: true,
            maxlength: 1000
        }
    },
    {
        timestamps: true
    }
);

// One industry can express interest
// in a particular solution only once
industryInterestSchema.index(
    {
        industryId: 1,
        solutionId: 1
    },
    {
        unique: true
    }
);

const IndustryInterest = mongoose.model(
    "IndustryInterest",
    industryInterestSchema
);

export default IndustryInterest;