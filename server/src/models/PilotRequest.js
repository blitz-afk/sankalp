import mongoose from "mongoose";

const pilotRequestSchema = new mongoose.Schema(
    {
        solutionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Solution",
            required: true
        },
        problemIds: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Problem",
                required: true
            }
        ],

        industryId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Industry",
            required: true
        },

        universityId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "University",
            required: true
        },

        governmentBodyId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "GovernmentBody",
            required: true
        },

        governmentOfficerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "GovernmentOfficer",
            required: true
        },

        industryInterestId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "IndustryInterest",
            required: true
        },

        title: {
            type: String,
            required: true,
            trim: true,
            minlength: 5,
            maxlength: 200
        },

        objective: {
            type: String,
            required: true,
            trim: true,
            minlength: 20,
            maxlength: 3000
        },

        proposedLocation: {
            city: {
                type: String,
                required: true,
                trim: true
            },

            state: {
                type: String,
                trim: true
            },

            country: {
                type: String,
                trim: true
            },

            details: {
                type: String,
                trim: true,
                maxlength: 1000
            }
        },

        implementationPlan: {
            type: String,
            required: true,
            trim: true,
            minlength: 20,
            maxlength: 5000
        },

        expectedDuration: {
            type: String,
            required: true,
            trim: true
        },

        successCriteria: {
            type: [String],
            required: true,
            validate: {
                validator: value => value.length > 0,
                message: "At least one success criterion is required"
            }
        },

        status: {
            type: String,
            enum: [
                "Pending",
                "Accepted",
                "Rejected",
                "Converted"
            ],
            default: "Pending"
        },

        officerRemarks: {
            type: String,
            trim: true,
            maxlength: 3000
        }
    },
    {
        timestamps: true
    }
);

const PilotRequest = mongoose.model(
    "PilotRequest",
    pilotRequestSchema
);

export default PilotRequest;