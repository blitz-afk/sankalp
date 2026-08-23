import { Problem } from '../models/Problem.js';
import { categorizeProblem } from '../services/ai/categorization.js';
import { prioritizeProblem } from '../services/ai/prioritization.js';
import { checkDuplicateProblem } from '../services/ai/deduplication.js';
import { sendSuccess, sendError } from '../utils/responseHandler.js';
import { PROBLEM_STATUS } from '../utils/constants.js';

export const getProblems = async (req, res, next) => {
  try {
    const { category, status, search, limit = 20, page = 1 } = req.query;
    const query = {};

    if (category) query.category = category;
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const problems = await Problem.find(query)
      .populate('reportedBy', 'displayName photoURL role')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Problem.countDocuments(query);

    return sendSuccess(res, 200, 'Problems fetched successfully', {
      problems,
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

export const getProblemById = async (req, res, next) => {
  try {
    const problem = await Problem.findById(req.params.id)
      .populate('reportedBy', 'displayName email photoURL organization role')
      .populate('challengeId', 'title status deadline');

    if (!problem) {
      return sendError(res, 404, 'Problem not found');
    }

    return sendSuccess(res, 200, 'Problem retrieved', problem);
  } catch (error) {
    next(error);
  }
};

export const createProblem = async (req, res, next) => {
  try {
    const { title, description, category, location, attachments } = req.body;

    if (!title || !description) {
      return sendError(res, 400, 'Title and description are required');
    }

    const problem = new Problem({
      title,
      description,
      category: category || 'General',
      location: location || {},
      attachments: attachments || [],
      reportedBy: req.user._id,
      status: PROBLEM_STATUS.SUBMITTED,
    });

    await problem.save();
    return sendSuccess(res, 201, 'Problem reported successfully', problem);
  } catch (error) {
    next(error);
  }
};

export const upvoteProblem = async (req, res, next) => {
  try {
    const problem = await Problem.findById(req.params.id);
    if (!problem) return sendError(res, 404, 'Problem not found');

    const userId = req.user._id;
    const hasUpvoted = problem.upvotes.includes(userId);

    if (hasUpvoted) {
      problem.upvotes = problem.upvotes.filter((id) => id.toString() !== userId.toString());
    } else {
      problem.upvotes.push(userId);
    }

    await problem.save();
    return sendSuccess(res, 200, hasUpvoted ? 'Upvote removed' : 'Problem upvoted', {
      upvoteCount: problem.upvotes.length,
      hasUpvoted: !hasUpvoted,
    });
  } catch (error) {
    next(error);
  }
};

export const analyzeProblemWithAI = async (req, res, next) => {
  try {
    const problem = await Problem.findById(req.params.id);
    if (!problem) return sendError(res, 404, 'Problem not found');

    // 1. Categorization via AI Service
    const categoryResult = await categorizeProblem({
      title: problem.title,
      description: problem.description,
    });

    // 2. Prioritization via AI Service
    const priorityResult = await prioritizeProblem({
      title: problem.title,
      description: problem.description,
      location: problem.location,
    });

    // 3. Deduplication check via AI Service
    const existingCandidates = await Problem.find({
      _id: { $ne: problem._id },
      category: categoryResult.category || problem.category,
    }).limit(10);

    const deduplicationResult = await checkDuplicateProblem(problem, existingCandidates);

    // Save AI findings back to problem
    problem.category = categoryResult.category || problem.category;
    problem.domain = categoryResult.domain || problem.domain;
    problem.aiAnalysis = {
      category: categoryResult.category,
      urgencyScore: priorityResult.urgencyScore,
      impactScore: priorityResult.impactScore,
      keywords: categoryResult.keywords || [],
      summary: categoryResult.summary,
      isDuplicate: deduplicationResult.isDuplicate,
      similarProblemIds: deduplicationResult.matchedProblemId ? [deduplicationResult.matchedProblemId] : [],
      lastAnalyzedAt: new Date(),
    };

    await problem.save();

    return sendSuccess(res, 200, 'AI Problem Analysis completed', {
      categorization: categoryResult,
      prioritization: priorityResult,
      deduplication: deduplicationResult,
      problem,
    });
  } catch (error) {
    next(error);
  }
};
