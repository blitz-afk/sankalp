import mongoose from "mongoose";

const pilotEvaluationSchema = new mongoose.Schema(
    {
        pilotId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Pilot",
            required: true,
            unique: true
        },

        governmentOfficerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "GovernmentOfficer",
            required: true
        },

        score: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        },

        technicalAssessment: {
            type: String,
            required: true,
            trim: true,
            minlength: 20,
            maxlength: 5000
        },

        observations: {
            type: String,
            required: true,
            trim: true,
            minlength: 20,
            maxlength: 5000
        },

        recommendation: {
            type: String,
            required: true,
            enum: [
                "Recommended",
                "Recommended with Modifications",
                "Not Recommended"
            ]
        },

        status: {
            type: String,
            enum: [
                "Submitted",
                "Approved",
                "Rejected"
            ],
            default: "Submitted"
        },

        governmentBodyRemarks: {
            type: String,
            trim: true,
            maxlength: 5000
        }
    },
    {
        timestamps: true
    }
);

const PilotEvaluation = mongoose.model(
    "PilotEvaluation",
    pilotEvaluationSchema
);

export default PilotEvaluation;