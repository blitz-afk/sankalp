import mongoose from 'mongoose';
import { PROBLEM_STATUS } from '../utils/constants.js';

const ProblemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      default: 'General',
      index: true,
    },
    domain: {
      type: String,
      default: 'Community & Society',
    },
    location: {
      address: { type: String, default: '' },
      city: { type: String, default: '' },
      state: { type: String, default: '' },
      pincode: { type: String, default: '' },
      coordinates: {
        lat: { type: Number },
        lng: { type: Number },
      },
    },
    attachments: [
      {
        url: { type: String },
        fileType: { type: String },
        filename: { type: String },
      },
    ],
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(PROBLEM_STATUS),
      default: PROBLEM_STATUS.SUBMITTED,
      index: true,
    },
    upvotes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    aiAnalysis: {
      category: { type: String },
      urgencyScore: { type: Number },
      impactScore: { type: Number },
      keywords: [{ type: String }],
      summary: { type: String },
      isDuplicate: { type: Boolean, default: false },
      similarProblemIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Problem' }],
      lastAnalyzedAt: { type: Date },
    },
    challengeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Challenge',
    },
  },
  {
    timestamps: true,
  }
);

export const Problem = mongoose.model('Problem', ProblemSchema);
