import PilotRequest from "../models/PilotRequest.js";
import IndustryInterest from "../models/IndustryInterest.js";
import University from "../models/University.js";
import Solution from "../models/Solution.js";
import Challenge from "../models/Challenge.js";
import Problem from "../models/Problem.js";
import GovernmentOfficer from "../models/GovernmentOfficer.js";
import GovernmentBody from "../models/GovernmentBody.js";
import Pilot from "../models/Pilot.js";


const createPilotRequest = async (req, res) => {
    try {
        const {
            industryInterestId,
            problemIds,
            title,
            objective,
            proposedLocation,
            implementationPlan,
            expectedDuration,
            successCriteria
        } = req.body;


        // 1. Validate required fields

        if (!industryInterestId) {
            return res.status(400).json({
                success: false,
                message: "Industry interest ID is required"
            });
        }

        if (
            !Array.isArray(problemIds) ||
            problemIds.length === 0
        ) {
            return res.status(400).json({
                success: false,
                message: "At least one problem ID is required"
            });
        }

        if (!title || title.trim().length < 5) {
            return res.status(400).json({
                success: false,
                message:
                    "Pilot request title must be at least 5 characters"
            });
        }

        if (!objective || objective.trim().length < 20) {
            return res.status(400).json({
                success: false,
                message:
                    "Pilot objective must be at least 20 characters"
            });
        }

        if (
            !implementationPlan ||
            implementationPlan.trim().length < 20
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Implementation plan must be at least 20 characters"
            });
        }

        if (
            !expectedDuration ||
            expectedDuration.trim().length < 2
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Expected duration is required"
            });
        }

        if (
            !Array.isArray(successCriteria) ||
            successCriteria.length === 0
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "At least one success criterion is required"
            });
        }

        if (!proposedLocation?.city) {
            return res.status(400).json({
                success: false,
                message:
                    "Pilot location city is required"
            });
        }


        // 2. Find logged-in university

        const university = await University.findOne({
            firebaseUid: req.user.uid,
            isActive: true
        });

        if (!university) {
            return res.status(403).json({
                success: false,
                message:
                    "University profile not found"
            });
        }


        // 3. Find industry interest

        const interest =
            await IndustryInterest.findById(
                industryInterestId
            );

        if (!interest) {
            return res.status(404).json({
                success: false,
                message:
                    "Industry interest not found"
            });
        }


        // 4. Interest must be accepted

        if (interest.status !== "Accepted") {
            return res.status(400).json({
                success: false,
                message:
                    "Industry interest must be accepted before requesting a pilot"
            });
        }


        // 5. Find solution

        const solution =
            await Solution.findById(
                interest.solutionId
            );

        if (!solution) {
            return res.status(404).json({
                success: false,
                message:
                    "Solution not found"
            });
        }


        // 6. Verify university owns solution

        if (
            solution.universityId.toString() !==
            university._id.toString()
        ) {
            return res.status(403).json({
                success: false,
                message:
                    "You are not authorized to request a pilot for this solution"
            });
        }


        // 7. Find challenge

        const challenge =
            await Challenge.findById(
                solution.challengeId
            );

        if (!challenge) {
            return res.status(404).json({
                success: false,
                message:
                    "Challenge not found"
            });
        }


        // 8. Find selected problems

        const problems = await Problem.find({
            _id: {
                $in: problemIds
            },
            "aiAnalysis.isValid": true
        });


        // Make sure every requested problem exists

        if (problems.length !== problemIds.length) {
            return res.status(400).json({
                success: false,
                message:
                    "One or more selected problems are invalid"
            });
        }


        // 9. Verify selected problems belong
        // to the challenge category

        const invalidProblem = problems.find(
            problem =>
                problem.aiAnalysis?.category !==
                challenge.category
        );

        if (invalidProblem) {
            return res.status(400).json({
                success: false,
                message:
                    "One or more selected problems do not belong to this challenge"
            });
        }


        // 10. Every problem must have
        // government assignment

        const unassignedProblem = problems.find(
            problem =>
                !problem.governmentBodyId ||
                !problem.governmentOfficerId
        );

        if (unassignedProblem) {
            return res.status(400).json({
                success: false,
                message:
                    "All selected problems must have an assigned government body and officer"
            });
        }


        // 11. Make sure all selected problems
        // belong to the same government body

        const governmentBodyIds = [
            ...new Set(
                problems.map(problem =>
                    problem.governmentBodyId.toString()
                )
            )
        ];

        if (governmentBodyIds.length !== 1) {
            return res.status(400).json({
                success: false,
                message:
                    "All selected problems must belong to the same government body"
            });
        }


        // 12. Make sure all selected problems
        // belong to the same government officer

        const governmentOfficerIds = [
            ...new Set(
                problems.map(problem =>
                    problem.governmentOfficerId.toString()
                )
            )
        ];

        if (governmentOfficerIds.length !== 1) {
            return res.status(400).json({
                success: false,
                message:
                    "All selected problems must be assigned to the same government officer"
            });
        }


        const governmentBodyId =
            problems[0].governmentBodyId;

        const governmentOfficerId =
            problems[0].governmentOfficerId;


        // 13. Verify government body

        const governmentBody =
            await GovernmentBody.findOne({
                _id: governmentBodyId,
                isActive: true
            });

        if (!governmentBody) {
            return res.status(404).json({
                success: false,
                message:
                    "Government body not found"
            });
        }


        // 14. Verify government officer

        const governmentOfficer =
            await GovernmentOfficer.findOne({
                _id: governmentOfficerId,
                governmentBodyId: governmentBody._id,
                isActive: true
            });

        if (!governmentOfficer) {
            return res.status(404).json({
                success: false,
                message:
                    "Government officer not found"
            });
        }


        // 15. Check duplicate pilot request

        const existingRequest =
            await PilotRequest.findOne({
                industryInterestId:
                    interest._id
            });

        if (existingRequest) {
            return res.status(409).json({
                success: false,
                message:
                    "A pilot request already exists for this industry partnership"
            });
        }


        // 16. Create pilot request

        const pilotRequest =
            await PilotRequest.create({

                solutionId:
                    solution._id,

                problemIds:
                    problems.map(problem =>
                        problem._id
                    ),

                industryId:
                    interest.industryId,

                universityId:
                    university._id,

                governmentBodyId:
                    governmentBody._id,

                governmentOfficerId:
                    governmentOfficer._id,

                industryInterestId:
                    interest._id,

                title:
                    title.trim(),

                objective:
                    objective.trim(),

                proposedLocation,

                implementationPlan:
                    implementationPlan.trim(),

                expectedDuration:
                    expectedDuration.trim(),

                successCriteria:
                    successCriteria
                        .map(criteria =>
                            criteria.trim()
                        )
                        .filter(Boolean),

                status: "Pending"
            });


        // 17. Return result

        return res.status(201).json({
            success: true,
            message:
                "Pilot request submitted successfully",
            pilotRequest
        });

    } catch (error) {

        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message:
                    "A pilot request already exists for this industry partnership"
            });
        }

        console.error(
            "CREATE PILOT REQUEST ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to create pilot request"
        });
    }
};
const getMyPilotRequests = async (req, res) => {
    try {
        // 1. Find logged-in government officer

        const officer = await GovernmentOfficer.findOne({
            firebaseUid: req.user.uid,
            isActive: true
        });

        if (!officer) {
            return res.status(403).json({
                success: false,
                message: "Government officer profile not found"
            });
        }

        // 2. Get requests assigned to this officer

        const requests = await PilotRequest.find({
            governmentOfficerId: officer._id
        })
            .populate({
                path: "solutionId",
                select: "title description technologies"
            })
            .populate({
                path: "problemIds",
                select: "title description location aiAnalysis"
            })
            .populate({
                path: "universityId",
                select: "name description"
            })
            .populate({
                path: "industryId",
                select: "name description domains capabilities resources"
            })
            .populate({
                path: "governmentBodyId",
                select: "name department description"
            })
            .sort({
                createdAt: -1
            });

        return res.status(200).json({
            success: true,
            count: requests.length,
            requests
        });

    } catch (error) {

        console.error(
            "GET MY PILOT REQUESTS ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to fetch pilot requests"
        });
    }
};


const acceptPilotRequest = async (req, res) => {
    try {
        const { pilotRequestId } = req.params;
        const { officerRemarks } = req.body;

        // 1. Find logged-in officer

        const officer = await GovernmentOfficer.findOne({
            firebaseUid: req.user.uid,
            isActive: true
        });

        if (!officer) {
            return res.status(403).json({
                success: false,
                message: "Government officer profile not found"
            });
        }

        // 2. Find request assigned to this officer

        const pilotRequest = await PilotRequest.findOne({
            _id: pilotRequestId,
            governmentOfficerId: officer._id
        });

        if (!pilotRequest) {
            return res.status(404).json({
                success: false,
                message:
                    "Pilot request not found or not assigned to you"
            });
        }

        // 3. Only pending requests can be accepted

        if (pilotRequest.status !== "Pending") {
            return res.status(400).json({
                success: false,
                message:
                    "Only pending pilot requests can be accepted"
            });
        }

        // 4. Accept request

        pilotRequest.status = "Accepted";

        if (officerRemarks) {
            pilotRequest.officerRemarks =
                officerRemarks.trim();
        }

        await pilotRequest.save();

        return res.status(200).json({
            success: true,
            message: "Pilot request accepted successfully",
            pilotRequest
        });

    } catch (error) {

        console.error(
            "ACCEPT PILOT REQUEST ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to accept pilot request"
        });
    }
};


const rejectPilotRequest = async (req, res) => {
    try {
        const { pilotRequestId } = req.params;
        const { officerRemarks } = req.body;

        // 1. Find logged-in officer

        const officer = await GovernmentOfficer.findOne({
            firebaseUid: req.user.uid,
            isActive: true
        });

        if (!officer) {
            return res.status(403).json({
                success: false,
                message: "Government officer profile not found"
            });
        }

        // 2. Find request assigned to this officer

        const pilotRequest = await PilotRequest.findOne({
            _id: pilotRequestId,
            governmentOfficerId: officer._id
        });

        if (!pilotRequest) {
            return res.status(404).json({
                success: false,
                message:
                    "Pilot request not found or not assigned to you"
            });
        }

        // 3. Only pending requests can be rejected

        if (pilotRequest.status !== "Pending") {
            return res.status(400).json({
                success: false,
                message:
                    "Only pending pilot requests can be rejected"
            });
        }

        // 4. Reject request

        pilotRequest.status = "Rejected";

        if (officerRemarks) {
            pilotRequest.officerRemarks =
                officerRemarks.trim();
        }

        await pilotRequest.save();

        return res.status(200).json({
            success: true,
            message: "Pilot request rejected successfully",
            pilotRequest
        });

    } catch (error) {

        console.error(
            "REJECT PILOT REQUEST ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to reject pilot request"
        });
    }
};
const convertPilotRequestToPilot = async (req, res) => {
    try {
        const { pilotRequestId } = req.params;

        // 1. Find logged-in government officer

        const officer = await GovernmentOfficer.findOne({
            firebaseUid: req.user.uid,
            isActive: true
        });

        if (!officer) {
            return res.status(403).json({
                success: false,
                message: "Government officer profile not found"
            });
        }

        // 2. Find pilot request assigned to this officer

        const pilotRequest = await PilotRequest.findOne({
            _id: pilotRequestId,
            governmentOfficerId: officer._id
        });

        if (!pilotRequest) {
            return res.status(404).json({
                success: false,
                message:
                    "Pilot request not found or not assigned to you"
            });
        }

        // 3. Request must be accepted

        if (pilotRequest.status !== "Accepted") {
            return res.status(400).json({
                success: false,
                message:
                    "Only accepted pilot requests can be converted into pilots"
            });
        }

        // 4. Check whether a pilot already exists

        const existingPilot = await Pilot.findOne({
            solutionId: pilotRequest.solutionId
        });

        if (existingPilot) {
            return res.status(409).json({
                success: false,
                message:
                    "A pilot already exists for this solution"
            });
        }

        // 5. Calculate dates

        const startDate = new Date();

        const durationMatch =
            pilotRequest.expectedDuration.match(/\d+/);

        const durationDays = durationMatch
            ? parseInt(durationMatch[0], 10)
            : 30;

        const endDate = new Date(startDate);

        endDate.setDate(
            endDate.getDate() + durationDays
        );

        // 6. Create pilot

        const pilot = await Pilot.create({
            solutionId:
                pilotRequest.solutionId,

            problemIds:
                pilotRequest.problemIds,

            industryId:
                pilotRequest.industryId,

            universityId:
                pilotRequest.universityId,

            governmentBodyId:
                pilotRequest.governmentBodyId,

            governmentOfficerId:
                pilotRequest.governmentOfficerId,

            title:
                pilotRequest.title,

            objective:
                pilotRequest.objective,

            location:
                pilotRequest.proposedLocation,

            implementationPlan:
                pilotRequest.implementationPlan,

            resources: [],

            successCriteria:
                pilotRequest.successCriteria,

            startDate,

            endDate,

            status: "Planned"
        });

        // 7. Mark request as converted

        pilotRequest.status = "Converted";

        await pilotRequest.save();

        // 8. Return result

        return res.status(201).json({
            success: true,
            message:
                "Pilot created successfully from pilot request",
            pilot
        });

    } catch (error) {

        console.error(
            "CONVERT PILOT REQUEST ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to create pilot from pilot request"
        });
    }
};
export {
    createPilotRequest,
    getMyPilotRequests,
    acceptPilotRequest,
    rejectPilotRequest,
    convertPilotRequestToPilot
};
