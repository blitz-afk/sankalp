import { Pilot } from '../models/Pilot.js';
import { sendSuccess, sendError } from '../utils/responseHandler.js';
import { PILOT_STATUS } from '../utils/constants.js';

export const getPilots = async (req, res, next) => {
  try {
    const { status } = req.query;
    const query = {};
    if (status) query.status = status;

    const pilots = await Pilot.find(query)
      .populate('solutionId', 'title averageScore')
      .populate('challengeId', 'title domain');

    return sendSuccess(res, 200, 'Pilots retrieved', pilots);
  } catch (error) {
    next(error);
  }
};

export const getPilotById = async (req, res, next) => {
  try {
    const pilot = await Pilot.findById(req.params.id)
      .populate('solutionId')
      .populate('challengeId');

    if (!pilot) return sendError(res, 404, 'Pilot deployment record not found');
    return sendSuccess(res, 200, 'Pilot details retrieved', pilot);
  } catch (error) {
    next(error);
  }
};

export const createPilot = async (req, res, next) => {
  try {
    const { title, solutionId, challengeId, location, targetBeneficiariesCount, kpis } = req.body;

    if (!title || !solutionId || !location) {
      return sendError(res, 400, 'Title, solutionId, and location are required');
    }

    const pilot = new Pilot({
      title,
      solutionId,
      challengeId,
      location,
      targetBeneficiariesCount: targetBeneficiariesCount || 0,
      kpis: kpis || [],
      status: PILOT_STATUS.PROPOSED,
    });

    await pilot.save();
    return sendSuccess(res, 201, 'Pilot registered successfully', pilot);
  } catch (error) {
    next(error);
  }
};

export const updatePilotStatus = async (req, res, next) => {
  try {
    const { status, verificationReport } = req.body;
    const pilot = await Pilot.findById(req.params.id);

    if (!pilot) return sendError(res, 404, 'Pilot record not found');

    if (status && Object.values(PILOT_STATUS).includes(status)) {
      pilot.status = status;
    }

    if (verificationReport) {
      pilot.verificationReport = {
        ...verificationReport,
        verifiedBy: req.user._id,
        verifiedAt: new Date(),
      };
    }

    await pilot.save();
    return sendSuccess(res, 200, 'Pilot status updated successfully', pilot);
  } catch (error) {
    next(error);
  }
};
