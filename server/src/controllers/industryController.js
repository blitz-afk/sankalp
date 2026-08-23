import { Industry } from '../models/Industry.js';
import { Solution } from '../models/Solution.js';
import { sendSuccess, sendError } from '../utils/responseHandler.js';

export const getIndustries = async (req, res, next) => {
  try {
    const industries = await Industry.find().populate('userId', 'displayName email');
    return sendSuccess(res, 200, 'Industry partners retrieved', industries);
  } catch (error) {
    next(error);
  }
};

export const updateIndustryProfile = async (req, res, next) => {
  try {
    const industry = await Industry.findOneAndUpdate(
      { userId: req.user._id },
      { ...req.body, userId: req.user._id },
      { new: true, upsert: true }
    );
    return sendSuccess(res, 200, 'Industry profile updated', industry);
  } catch (error) {
    next(error);
  }
};

export const sponsorSolution = async (req, res, next) => {
  try {
    const { solutionId } = req.body;
    if (!solutionId) return sendError(res, 400, 'Solution ID is required');

    const industry = await Industry.findOne({ userId: req.user._id });
    if (!industry) return sendError(res, 404, 'Industry profile not found for user');

    const solution = await Solution.findById(solutionId);
    if (!solution) return sendError(res, 404, 'Solution not found');

    if (!industry.sponsoredSolutions.includes(solution._id)) {
      industry.sponsoredSolutions.push(solution._id);
      await industry.save();
    }

    if (!solution.sponsoredBy.includes(industry._id)) {
      solution.sponsoredBy.push(industry._id);
      await solution.save();
    }

    return sendSuccess(res, 200, 'Sponsorship initiated successfully', {
      industry,
      solution,
    });
  } catch (error) {
    next(error);
  }
};
