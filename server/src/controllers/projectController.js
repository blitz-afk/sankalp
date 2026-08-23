import { Project } from '../models/Project.js';
import { sendSuccess, sendError } from '../utils/responseHandler.js';

export const getProjects = async (req, res, next) => {
  try {
    const projects = await Project.find()
      .populate('solutionId', 'title')
      .populate('challengeId', 'title')
      .populate('universityId', 'institutionName')
      .populate('industryPartnerId', 'companyName');

    return sendSuccess(res, 200, 'Projects retrieved', projects);
  } catch (error) {
    next(error);
  }
};

export const getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('solutionId')
      .populate('challengeId')
      .populate('universityId')
      .populate('industryPartnerId');

    if (!project) return sendError(res, 404, 'Project not found');
    return sendSuccess(res, 200, 'Project details retrieved', project);
  } catch (error) {
    next(error);
  }
};

export const createProject = async (req, res, next) => {
  try {
    const project = new Project(req.body);
    await project.save();
    return sendSuccess(res, 201, 'Project created', project);
  } catch (error) {
    next(error);
  }
};
