import { University } from '../models/University.js';
import { sendSuccess, sendError } from '../utils/responseHandler.js';

export const getUniversities = async (req, res, next) => {
  try {
    const universities = await University.find().populate('userId', 'displayName email photoURL');
    return sendSuccess(res, 200, 'Universities retrieved', universities);
  } catch (error) {
    next(error);
  }
};

export const getUniversityProfile = async (req, res, next) => {
  try {
    const university = await University.findById(req.params.id).populate('userId', 'displayName email photoURL');
    if (!university) return sendError(res, 404, 'University profile not found');
    return sendSuccess(res, 200, 'University profile retrieved', university);
  } catch (error) {
    next(error);
  }
};

export const updateUniversityProfile = async (req, res, next) => {
  try {
    const university = await University.findOneAndUpdate(
      { userId: req.user._id },
      { ...req.body, userId: req.user._id },
      { new: true, upsert: true }
    );
    return sendSuccess(res, 200, 'University profile saved', university);
  } catch (error) {
    next(error);
  }
};
