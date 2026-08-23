import mongoose from 'mongoose';

const EvaluationSchema = new mongoose.Schema(
  {
    solutionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Solution',
      required: true,
      index: true,
    },
    evaluatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    scores: {
      feasibility: { type: Number, min: 0, max: 100, default: 0 },
      innovation: { type: Number, min: 0, max: 100, default: 0 },
      impact: { type: Number, min: 0, max: 100, default: 0 },
      scalability: { type: Number, min: 0, max: 100, default: 0 },
      costEffectiveness: { type: Number, min: 0, max: 100, default: 0 },
    },
    totalScore: {
      type: Number,
      default: 0,
    },
    feedback: {
      type: String,
      default: '',
    },
    strengths: [{ type: String }],
    weaknesses: [{ type: String }],
    recommendation: {
      type: String,
      enum: ['STRONGLY_RECOMMEND', 'RECOMMEND', 'NEEDS_REVISION', 'REJECT'],
      default: 'RECOMMEND',
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to calculate total score
EvaluationSchema.pre('save', function (next) {
  if (this.scores) {
    const values = Object.values(this.scores).filter((v) => typeof v === 'number');
    if (values.length > 0) {
      this.totalScore = Math.round(values.reduce((a, b) => a + b, 0) / values.length);
    }
  }
  next();
});

export const Evaluation = mongoose.model('Evaluation', EvaluationSchema);
