import mongoose from 'mongoose';
import { CHALLENGE_STATUS } from '../utils/constants.js';

const ChallengeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    statement: {
      type: String,
      required: true,
    },
    domain: {
      type: String,
      required: true,
      index: true,
    },
    problemIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Problem',
      },
    ],
    status: {
      type: String,
      enum: Object.values(CHALLENGE_STATUS),
      default: CHALLENGE_STATUS.ACTIVE,
      index: true,
    },
    requirements: [{ type: String }],
    evaluationCriteria: [
      {
        criterion: { type: String },
        weight: { type: Number, default: 20 },
      },
    ],
    rewardOrGrant: {
      type: String,
      default: '',
    },
    deadline: {
      type: Date,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

export const Challenge = mongoose.model('Challenge', ChallengeSchema);
