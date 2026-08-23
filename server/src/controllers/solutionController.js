import { Solution } from '../models/Solution.js';
import { Challenge } from '../models/Challenge.js';
import { findIndustrySponsorsForSolution } from '../services/matchingService.js';
import { sendSuccess, sendError } from '../utils/responseHandler.js';
import { SOLUTION_STATUS } from '../utils/constants.js';

export const getSolutions = async (req, res, next) => {
  try {
    const { challengeId, status, universityId, limit = 20, page = 1 } = req.query;
    const query = {};

    if (challengeId) query.challengeId = challengeId;
    if (status) query.status = status;
    if (universityId) query.universityId = universityId;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const solutions = await Solution.find(query)
      .populate('challengeId', 'title domain deadline')
      .populate('submittedBy', 'displayName organization')
      .populate('universityId', 'institutionName location')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Solution.countDocuments(query);

    return sendSuccess(res, 200, 'Solutions fetched', {
      solutions,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getSolutionById = async (req, res, next) => {
  try {
    const solution = await Solution.findById(req.params.id)
      .populate('challengeId')
      .populate('submittedBy', 'displayName organization email')
      .populate('universityId')
      .populate('sponsoredBy', 'companyName sector');

    if (!solution) return sendError(res, 404, 'Solution not found');

    return sendSuccess(res, 200, 'Solution retrieved', solution);
  } catch (error) {
    next(error);
  }
};

export const createSolution = async (req, res, next) => {
  try {
    const { challengeId, title, abstract, technicalDetails, repositoryUrl, demoUrl, teamMembers } = req.body;

    if (!challengeId || !title || !abstract) {
      return sendError(res, 400, 'Challenge ID, title, and abstract are required');
    }

    const challenge = await Challenge.findById(challengeId);
    if (!challenge) return sendError(res, 404, 'Referenced challenge does not exist');

    const solution = new Solution({
      challengeId,
      title,
      abstract,
      technicalDetails: technicalDetails || '',
      repositoryUrl: repositoryUrl || '',
      demoUrl: demoUrl || '',
      teamMembers: teamMembers || [],
      submittedBy: req.user._id,
      status: SOLUTION_STATUS.SUBMITTED,
    });

    await solution.save();
    return sendSuccess(res, 201, 'Solution submitted successfully', solution);
  } catch (error) {
    next(error);
  }
};

export const getRecommendedIndustrySponsors = async (req, res, next) => {
  try {
    const solution = await Solution.findById(req.params.id);
    if (!solution) return sendError(res, 404, 'Solution not found');

    const sponsors = await findIndustrySponsorsForSolution(solution);
    return sendSuccess(res, 200, 'Industry sponsor recommendations generated', sponsors);
  } catch (error) {
    next(error);
  }
};
