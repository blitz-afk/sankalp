import { Evaluation } from '../models/Evaluation.js';
import { Solution } from '../models/Solution.js';
import { sendSuccess, sendError } from '../utils/responseHandler.js';
import { SOLUTION_STATUS } from '../utils/constants.js';

export const getEvaluations = async (req, res, next) => {
  try {
    const { solutionId } = req.query;
    const query = {};
    if (solutionId) query.solutionId = solutionId;

    const evaluations = await Evaluation.find(query)
      .populate('solutionId', 'title challengeId')
      .populate('evaluatorId', 'displayName email');

    return sendSuccess(res, 200, 'Evaluations retrieved', evaluations);
  } catch (error) {
    next(error);
  }
};

export const submitEvaluation = async (req, res, next) => {
  try {
    const { solutionId, scores, feedback, strengths, weaknesses, recommendation } = req.body;

    if (!solutionId || !scores) {
      return sendError(res, 400, 'Solution ID and scores are required');
    }

    const solution = await Solution.findById(solutionId);
    if (!solution) return sendError(res, 404, 'Solution not found');

    const evaluation = new Evaluation({
      solutionId,
      evaluatorId: req.user._id,
      scores,
      feedback: feedback || '',
      strengths: strengths || [],
      weaknesses: weaknesses || [],
      recommendation: recommendation || 'RECOMMEND',
    });

    await evaluation.save();

    // Recalculate average score for the solution
    const allEvals = await Evaluation.find({ solutionId });
    const avg = allEvals.reduce((acc, curr) => acc + curr.totalScore, 0) / allEvals.length;

    solution.averageScore = Math.round(avg);
    solution.evaluationCount = allEvals.length;
    solution.status = SOLUTION_STATUS.EVALUATED;
    await solution.save();

    return sendSuccess(res, 201, 'Evaluation submitted successfully', evaluation);
  } catch (error) {
    next(error);
  }
};
