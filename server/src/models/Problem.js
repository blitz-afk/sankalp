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
        maxlength: 100
    },

    media: {
        type: [String],
        required: true
    },

    location: {
        longitude: {
            type: Number,
            required: true
        },
        latitude: {
            type: Number,
            required: true
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
    }
});

const Problem = mongoose.model("Problem", problemSchema);

export default Problem;