import mongoose from "mongoose";

const industrySchema = new mongoose.Schema(
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

        capabilities: {
            type: [String],
            default: []
        },

        resources: {
            type: [String],
            default: []
        },

        organizationType: {
            type: String,
            enum: [
                "Industry",
                "Startup",
                "MSME",
                "CSR Organization",
                "Research Organization"
            ],
            required: true
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

        location: {
            city: String,
            state: String,
            country: String
        },

        website: {
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

const Industry = mongoose.model("Industry", industrySchema);

export default Industry;