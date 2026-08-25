import mongoose from "mongoose";

const governmentOfficerSchema = new mongoose.Schema(
    {
        firebaseUid: {
            type: String,
            required: true,
            unique: true
        },

        governmentBodyId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "GovernmentBody",
            required: true
        },

        name: {
            type: String,
            required: true,
            trim: true,
            minlength: 2
        },

        designation: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            trim: true
        },

        phone: {
            type: String,
            trim: true
        },

        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

const GovernmentOfficer = mongoose.model(
    "GovernmentOfficer",
    governmentOfficerSchema
);

export default GovernmentOfficer;