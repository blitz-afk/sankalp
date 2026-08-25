import mongoose from "mongoose";

const governmentBodySchema = new mongoose.Schema(
    {
        firebaseUid: {
            type: String,
            required: true,
            unique: true
        },

        name: {
            type: String,
            required: true,
            trim: true
        },

        department: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            required: true,
            trim: true
        },

        domains: {
            type: [String],
            required: true,
            validate: {
                validator: (value) => value.length > 0,
                message: "At least one domain is required"
            }
        },

        responsibilities: {
            type: [String],
            default: []
        },

        location: {
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

        contactPerson: {
            name: {
                type: String,
                required: true,
                trim: true
            },

            designation: {
                type: String,
                trim: true
            },

            email: {
                type: String,
                trim: true
            },

            phone: {
                type: String,
                trim: true
            }
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

const GovernmentBody = mongoose.model(
    "GovernmentBody",
    governmentBodySchema
);

export default GovernmentBody;