import mongoose from 'mongoose';

const UniversitySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    institutionName: {
      type: String,
      required: true,
      trim: true,
    },
    aicteOrUgcCode: {
      type: String,
      default: '',
    },
    location: {
      city: { type: String, default: '' },
      state: { type: String, default: '' },
      country: { type: String, default: 'India' },
    },
    departments: [{ type: String }],
    focusAreas: [{ type: String }],
    incubationCenter: {
      hasCenter: { type: Boolean, default: false },
      centerName: { type: String, default: '' },
    },
    contactPerson: {
      name: { type: String, default: '' },
      designation: { type: String, default: '' },
      email: { type: String, default: '' },
      phone: { type: String, default: '' },
    },
    stats: {
      totalSolutions: { type: Number, default: 0 },
      deployedSolutions: { type: Number, default: 0 },
      activeProjects: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true,
  }
);

export const University = mongoose.model('University', UniversitySchema);
