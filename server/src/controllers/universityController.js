import University from "../models/University.js";
import User from "../models/User.js";
import { getRecommendedChallenges } from "../services/matchingService.js";

const createUniversity = async (req, res) => {
  try {
    const {
      name,
      description,
      domains,
      location,
      website
    } = req.body;

    if (!name || name.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: "University name is required",
      });
    }

    if (!Array.isArray(domains) || domains.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one domain is required",
      });
    }

    // Check whether this Firebase account already has a platform user
    const existingUser = await User.findOne({
      firebaseUid: req.user.uid,
    });

    // If the account already belongs to another role, reject it
    if (existingUser && existingUser.role !== "University") {
      return res.status(409).json({
        success: false,
        message: "This account is already registered with another role",
      });
    }

    // Check whether the University profile already exists
    const existingUniversity = await University.findOne({
      firebaseUid: req.user.uid,
    });

    if (existingUniversity) {
      return res.status(409).json({
        success: false,
        message: "University profile already exists",
      });
    }

    // Create the platform User only if one does not already exist
    if (!existingUser) {
      await User.create({
        firebaseUid: req.user.uid,
        role: "University",
      });
    }

    // Create the University profile
    const university = await University.create({
      firebaseUid: req.user.uid,
      name: name.trim(),
      description: description?.trim(),
      domains,
      location,
      website: website?.trim(),
    });

    return res.status(201).json({
      success: true,
      message: "University created successfully",
      university,
    });

  } catch (error) {
    console.error("CREATE UNIVERSITY ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create university",
    });
  }
};


const getMyUniversity = async (req, res) => {
  try {
    const university = await University.findOne({
      firebaseUid: req.user.uid,
    });

    if (!university) {
      return res.status(404).json({
        success: false,
        message: "University profile not found",
      });
    }

    return res.status(200).json({
      success: true,
      university,
    });

  } catch (error) {
    console.error("GET UNIVERSITY ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch university",
    });
  }
};


const getAllUniversities = async (req, res) => {
  try {
    const universities = await University.find({
      isActive: true,
    }).select("-__v");

    return res.status(200).json({
      success: true,
      count: universities.length,
      universities,
    });

  } catch (error) {
    console.error("GET UNIVERSITIES ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch universities",
    });
  }
};


const getUniversityById = async (req, res) => {
  try {
    const university = await University.findById(
      req.params.id
    ).select("-__v");

    if (!university) {
      return res.status(404).json({
        success: false,
        message: "University not found",
      });
    }

    return res.status(200).json({
      success: true,
      university,
    });

  } catch (error) {
    console.error("GET UNIVERSITY BY ID ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch university",
    });
  }
};


const getMyRecommendations = async (req, res) => {
  try {
    const university = await University.findOne({
      firebaseUid: req.user.uid,
    });

    if (!university) {
      return res.status(404).json({
        success: false,
        message: "University profile not found",
      });
    }

    const recommendations = await getRecommendedChallenges(
      university._id
    );

    return res.status(200).json({
      success: true,
      count: recommendations.length,
      recommendations,
    });

  } catch (error) {
    console.error(
      "GET UNIVERSITY RECOMMENDATIONS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch recommendations",
    });
  }
};


export {
  createUniversity,
  getMyUniversity,
  getAllUniversities,
  getUniversityById,
  getMyRecommendations,
};