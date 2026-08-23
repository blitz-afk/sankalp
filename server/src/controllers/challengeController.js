import { Challenge } from '../models/Challenge.js';
import { Problem } from '../models/Problem.js';
import { findUniversityMatchesForChallenge } from '../services/matchingService.js';
import { sendSuccess, sendError } from '../utils/responseHandler.js';
import { CHALLENGE_STATUS, PROBLEM_STATUS } from '../utils/constants.js';

export const getChallenges = async (req, res, next) => {
  try {
    const { domain, status, limit = 20, page = 1 } = req.query;
    const query = {};

    if (domain) query.domain = domain;
    if (status) query.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const challenges = await Challenge.find(query)
      .populate('problemIds', 'title category location')
      .populate('createdBy', 'displayName organization')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Challenge.countDocuments(query);

    return sendSuccess(res, 200, 'Challenges fetched', {
      challenges,
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

export const getChallengeById = async (req, res, next) => {
  try {
    const challenge = await Challenge.findById(req.params.id)
      .populate('problemIds')
      .populate('createdBy', 'displayName organization');

    if (!challenge) return sendError(res, 404, 'Challenge not found');

    return sendSuccess(res, 200, 'Challenge retrieved', challenge);
  } catch (error) {
    next(error);
  }
};

export const createChallenge = async (req, res, next) => {
  try {
    const { title, statement, domain, problemIds, requirements, evaluationCriteria, rewardOrGrant, deadline } =
      req.body;

    if (!title || !statement || !domain) {
      return sendError(res, 400, 'Title, statement, and domain are required');
    }

    const challenge = new Challenge({
      title,
      statement,
      domain,
      problemIds: problemIds || [],
      requirements: requirements || [],
      evaluationCriteria: evaluationCriteria || [],
      rewardOrGrant: rewardOrGrant || '',
      deadline: deadline ? new Date(deadline) : undefined,
      createdBy: req.user._id,
      status: CHALLENGE_STATUS.ACTIVE,
    });

    await challenge.save();

    // Update associated problems' status
    if (problemIds && problemIds.length > 0) {
      await Problem.updateMany(
        { _id: { $in: problemIds } },
        { status: PROBLEM_STATUS.CHALLENGE_CREATED, challengeId: challenge._id }
      );
    }

    return sendSuccess(res, 201, 'Challenge created successfully', challenge);
  } catch (error) {
    next(error);
  }
};

export const getRecommendedUniversities = async (req, res, next) => {
  try {
    const challenge = await Challenge.findById(req.params.id);
    if (!challenge) return sendError(res, 404, 'Challenge not found');

    const recommendations = await findUniversityMatchesForChallenge(challenge);
    return sendSuccess(res, 200, 'University recommendations generated', recommendations);
  } catch (error) {
    next(error);
  }
};
