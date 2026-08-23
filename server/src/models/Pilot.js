import mongoose from 'mongoose';
import { PILOT_STATUS } from '../utils/constants.js';

const PilotSchema = new mongoose.Schema(
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
    location: {
      zoneName: { type: String, required: true },
      district: { type: String, default: '' },
      state: { type: String, default: '' },
      coordinates: {
        lat: { type: Number },
        lng: { type: Number },
      },
    },
    targetBeneficiariesCount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: Object.values(PILOT_STATUS),
      default: PILOT_STATUS.PROPOSED,
      index: true,
    },
    authorityApprovals: [
      {
        authorityName: { type: String },
        approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        approvalDate: { type: Date },
        status: { type: String, enum: ['PENDING', 'APPROVED', 'REJECTED'], default: 'PENDING' },
        remarks: { type: String },
      },
    ],
    kpis: [
      {
        metricName: { type: String },
        targetValue: { type: String },
        actualValue: { type: String },
        status: { type: String, default: 'TRACKING' },
      },
    ],
    verificationReport: {
      verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      verifiedAt: { type: Date },
      summary: { type: String },
      successRate: { type: Number },
      deploymentRecommended: { type: Boolean, default: false },
    },
  },
  {
    timestamps: true,
  }
);

export const Pilot = mongoose.model('Pilot', PilotSchema);
