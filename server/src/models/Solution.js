import mongoose from "mongoose";

const solutionSchema = new mongoose.Schema(
    {
        universityId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "University",
            required: true
        },

        challengeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Challenge",
            required: true
        },

        title: {
            type: String,
            required: true,
            trim: true,
            minlength: 5,
            maxlength: 150
        },

        description: {
            type: String,
            required: true,
            trim: true,
            minlength: 20,
            maxlength: 3000
        },

        proposedSolution: {
            type: String,
            required: true,
            trim: true,
            minlength: 50
        },

        technologies: {
            type: [String],
            default: []
        },

        expectedImpact: {
            type: String,
            required: true,
            trim: true
        },
        proposalDocumentUrl: {
            type: String,
            required: true,
            trim: true
        },

        demoVideoUrl: {
            type: String,
            trim: true
        },

        githubRepoUrl: {
            type: String,
            trim: true
        },

        status: {
            type: String,
            enum: [
                "Submitted",
                "Under Review",
                "Accepted",
                "Rejected"
            ],
            default: "Submitted"
        }
    },
    {
        timestamps: true
    }
);

solutionSchema.index(
    {
        universityId: 1,
        challengeId: 1
    },
    {
        unique: true
    }
);

const Solution = mongoose.model("Solution", solutionSchema);

export default Solution;