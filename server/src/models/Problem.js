import mongoose from "mongoose";

const problemSchema = new mongoose.Schema({
    submittedBy: {
        type: String,
        required: true
    },

    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 100
    },

    description: {
        type: String,
        required: true,
        trim: true,
        minlength: 10,
        maxlength: 1000
    },

    media: {
        type: [String],
        required: true
    },

    location: {
        latitude: {
            type: Number,
            required: true
        },

        longitude: {
            type: Number,
            required: true
        },

        address: {
            type: String,
            trim: true
        },

        city: {
            type: String,
            trim: true
        },

        state: {
            type: String,
            trim: true
        },

        country: {
            type: String,
            trim: true
        }
    },

    status: {
        type: String,
        enum: ["Submitted",
            "Verified",
            "Rejected",
            "Duplicate",
            "In-Progress",
            "Resolved"
        ],
        default: "Submitted"
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    aiAnalysis: {
        isValid: Boolean,
        imageMatchesReport: Boolean,
        confidence: {
            type: Number,
            min: 0,
            max: 1
        },
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
            ]
        },
        problemType: {
            type: String,
            required: true,
            trim: true
        },
        severity: {
            type: String,
            enum: ["Low", "Medium", "High", "Critical"]
        },
        summary: String,
        suggestedDepartment: String,
        possibleAiGeneratedImage: Boolean
    },
    challengeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Challenge",
        default: null
    },
    governmentBodyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "GovernmentBody"
    },

    governmentOfficerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "GovernmentOfficer"
    },
});

const Problem = mongoose.model("Problem", problemSchema);

export default Problem;