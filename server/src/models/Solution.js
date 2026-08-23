import mongoose from 'mongoose';
import { SOLUTION_STATUS } from '../utils/constants.js';

const SolutionSchema = new mongoose.Schema(
  {
    challengeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Challenge',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    abstract: {
      type: String,
      required: true,
    },
    technicalDetails: {
      type: String,
      default: '',
    },
    repositoryUrl: {
      type: String,
      default: '',
    },
    demoUrl: {
      type: String,
      default: '',
    },
    documents: [
      {
        name: { type: String },
        url: { type: String },
        fileType: { type: String },
      },
    ],
    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    universityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'University',
    },
    teamMembers: [
      {
        name: { type: String },
        email: { type: String },
        role: { type: String },
      },
    ],
    status: {
      type: String,
      enum: Object.values(SOLUTION_STATUS),
      default: SOLUTION_STATUS.SUBMITTED,
      index: true,
    },
    averageScore: {
      type: Number,
      default: 0,
    },
    evaluationCount: {
      type: Number,
      default: 0,
    },
    sponsoredBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Industry',
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Solution = mongoose.model('Solution', SolutionSchema);
