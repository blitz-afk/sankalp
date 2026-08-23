import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    solutionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Solution',
      required: true,
    },
    challengeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Challenge',
    },
    universityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'University',
    },
    industryPartnerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Industry',
    },
    status: {
      type: String,
      enum: ['PLANNING', 'IN_DEVELOPMENT', 'PILOT_STAGE', 'COMPLETED', 'ON_HOLD'],
      default: 'PLANNING',
    },
    milestones: [
      {
        title: { type: String, required: true },
        description: { type: String },
        dueDate: { type: Date },
        completedDate: { type: Date },
        isCompleted: { type: Boolean, default: false },
      },
    ],
    fundingAmount: {
      type: Number,
      default: 0,
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    targetCompletionDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

export const Project = mongoose.model('Project', ProjectSchema);
