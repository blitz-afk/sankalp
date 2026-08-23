import mongoose from 'mongoose';

const IndustrySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    companyName: {
      type: String,
      required: true,
      trim: true,
    },
    sector: {
      type: String,
      default: '',
    },
    csrBudget: {
      allocated: { type: Number, default: 0 },
      available: { type: Number, default: 0 },
    },
    interestDomains: [{ type: String }],
    mentorshipAvailable: {
      type: Boolean,
      default: true,
    },
    website: {
      type: String,
      default: '',
    },
    contactPerson: {
      name: { type: String, default: '' },
      designation: { type: String, default: '' },
      email: { type: String, default: '' },
    },
    sponsoredSolutions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Solution',
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Industry = mongoose.model('Industry', IndustrySchema);
