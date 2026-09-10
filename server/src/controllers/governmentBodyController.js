import GovernmentBody from "../models/GovernmentBody.js";
import Pilot from "../models/Pilot.js";
import Challenge from "../models/Challenge.js";

const createGovernmentBody = async (req, res) => {
  try {
    const {
      name,
      department,
      description,
      domains,
      responsibilities,
      location,
      contactPerson,
    } = req.body;

    // 1. Validate required fields

    if (!name || name.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: "Government body name is required",
      });
    }

    if (!department || department.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: "Department is required",
      });
    }

    if (!description || description.trim().length < 10) {
      return res.status(400).json({
        success: false,
        message: "Government body description is required",
      });
    }

    if (!Array.isArray(domains) || domains.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one domain is required",
      });
    }

    if (!contactPerson?.name) {
      return res.status(400).json({
        success: false,
        message: "Contact person name is required",
      });
    }

    // 2. Check whether profile already exists

    const existingGovernmentBody = await GovernmentBody.findOne({
      firebaseUid: req.user.uid,
    });

    if (existingGovernmentBody) {
      return res.status(409).json({
        success: false,
        message: "Government body profile already exists",
      });
    }

    // 3. Create profile

    const governmentBody = await GovernmentBody.create({
      firebaseUid: req.user.uid,

      name: name.trim(),

      department: department.trim(),

      description: description.trim(),

      domains: domains.map((domain) => domain.trim()).filter(Boolean),

      responsibilities: Array.isArray(responsibilities)
        ? responsibilities
            .map((responsibility) => responsibility.trim())
            .filter(Boolean)
        : [],

      location,

      contactPerson,
    });

    return res.status(201).json({
      success: true,
      message: "Government body profile created successfully",
      governmentBody,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Government body profile already exists",
      });
    }

    console.error("CREATE GOVERNMENT BODY ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create government body profile",
    });
  }
};

const getMyGovernmentBody = async (req, res) => {
  try {
    const governmentBody = await GovernmentBody.findOne({
      firebaseUid: req.user.uid,
    }).select("-__v");

    if (!governmentBody) {
      return res.status(404).json({
        success: false,
        message: "Government body profile not found",
      });
    }

    return res.status(200).json({
      success: true,
      governmentBody,
    });
  } catch (error) {
    console.error("GET MY GOVERNMENT BODY ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch government body profile",
    });
  }
};

const getAllGovernmentBodies = async (req, res) => {
  try {
    const governmentBodies = await GovernmentBody.find({
      isActive: true,
    }).select("-__v");

    return res.status(200).json({
      success: true,
      count: governmentBodies.length,
      governmentBodies,
    });
  } catch (error) {
    console.error("GET GOVERNMENT BODIES ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch government bodies",
    });
  }
};

const getGovernmentBodyById = async (req, res) => {
  try {
    const governmentBody = await GovernmentBody.findOne({
      _id: req.params.id,
      isActive: true,
    }).select("-__v");

    if (!governmentBody) {
      return res.status(404).json({
        success: false,
        message: "Government body not found",
      });
    }

    return res.status(200).json({
      success: true,
      governmentBody,
    });
  } catch (error) {
    console.error("GET GOVERNMENT BODY BY ID ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch government body",
    });
  }
};
const getCompletedPilots = async (req, res) => {
  try {
    const governmentBody = await GovernmentBody.findOne({
      firebaseUid: req.user.uid,
      isActive: true,
    });

    if (!governmentBody) {
      return res.status(403).json({
        success: false,
        message: "Government body profile not found",
      });
    }

    const pilots = await Pilot.find({
      governmentBodyId: governmentBody._id,
      status: "Completed",
    })
      .populate({
        path: "solutionId",
        select: "title description technologies",
      })
      .populate({
        path: "industryId",
        select: "name description domains capabilities",
      })
      .populate({
        path: "universityId",
        select: "name description",
      })
      .populate({
        path: "problemIds",
        select: "title description location aiAnalysis",
      })
      .sort({ updatedAt: -1 });

    return res.status(200).json({
      success: true,
      count: pilots.length,
      pilots,
    });
  } catch (error) {
    console.error("GET COMPLETED PILOTS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch completed pilots",
    });
  }
};

const verifyPilot = async (req, res) => {
  try {
    const governmentBody = await GovernmentBody.findOne({
      firebaseUid: req.user.uid,
      isActive: true,
    });

    if (!governmentBody) {
      return res.status(403).json({
        success: false,
        message: "Government body profile not found",
      });
    }

    const pilot = await Pilot.findOne({
      _id: req.params.pilotId,
      governmentBodyId: governmentBody._id,
    });

    if (!pilot) {
      return res.status(404).json({
        success: false,
        message: "Pilot not found",
      });
    }

    if (pilot.status !== "Completed") {
      return res.status(400).json({
        success: false,
        message: "Only completed pilots can be verified",
      });
    }

    pilot.status = "Verified";
    await pilot.save();

    const solution = await Pilot.findById(pilot._id).select("solutionId");

    if (solution?.solutionId) {
      await Challenge.findOneAndUpdate(
        {
          _id: (
            await Pilot.findById(pilot._id).populate({
              path: "solutionId",
              select: "challengeId",
            })
          ).solutionId.challengeId,
        },
        { status: "Completed" },
      );
    }

    return res.status(200).json({
      success: true,
      message: "Pilot verified and challenge marked as completed",
      pilot,
    });
  } catch (error) {
    console.error("VERIFY PILOT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to verify pilot",
    });
  }
};

const rejectPilot = async (req, res) => {
  try {
    const governmentBody = await GovernmentBody.findOne({
      firebaseUid: req.user.uid,
      isActive: true,
    });

    if (!governmentBody) {
      return res.status(403).json({
        success: false,
        message: "Government body profile not found",
      });
    }

    const pilot = await Pilot.findOne({
      _id: req.params.pilotId,
      governmentBodyId: governmentBody._id,
    });

    if (!pilot) {
      return res.status(404).json({
        success: false,
        message: "Pilot not found",
      });
    }

    if (pilot.status !== "Completed") {
      return res.status(400).json({
        success: false,
        message: "Only completed pilots can be rejected",
      });
    }

    pilot.status = "Rejected";
    await pilot.save();

    return res.status(200).json({
      success: true,
      message: "Pilot rejected",
      pilot,
    });
  } catch (error) {
    console.error("REJECT PILOT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to reject pilot",
    });
  }
};

export {
    createGovernmentBody,
    getMyGovernmentBody,
    getAllGovernmentBodies,
    getGovernmentBodyById,
    getCompletedPilots,
    verifyPilot,
    rejectPilot
};
