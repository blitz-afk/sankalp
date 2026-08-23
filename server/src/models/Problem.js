import mongoose from "mongoose";

const problemSchema = new mongoose.Schema({
    submittedBy: {
        type: String,
        required: true
    },

    title: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    },

    media: [String],

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
        default: "SUBMITTED"
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