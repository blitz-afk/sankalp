import mongoose from "mongoose";

const challengeSchema = new mongoose.Schema(
    {
        category: {
            type: String,
            enum: [
                "Road Damage",
                "Street Lighting",
                "Waste Management",
                "Water Supply",
                "Drainage",
                "Traffic Management",
                "Public Safety",
                "Public Transport",
                "Electricity",
                "Sanitation",
                "Other"
            ],
            required: true
        },

        title: {
            type: String,
            required: true,
            trim: true
        },

        problemStatement: {
            type: String,
            required: true,
            trim: true
        },

        objective: {
            type: String,
            required: true,
            trim: true
        },

        expectedOutcome: {
            type: String,
            required: true,
            trim: true
        },
        requiredDomains: {
            type: [String],
            default: []
        },
        reportCount: {
            type: Number,
            required: true,
            default: 0
        },

        status: {
            type: String,
            enum: [
                "Open",
                "In-Progress",
                "Completed",
                "Closed"
            ],
            default: "Open"
        }
    },
    {
        timestamps: true
    }
);

const Challenge = mongoose.model("Challenge", challengeSchema);

export default Challenge;