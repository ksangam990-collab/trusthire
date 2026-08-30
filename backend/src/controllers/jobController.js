// backend/src/controllers/jobController.js
import JobListing from "../models/JobListing.js";
import Employer from "../models/Employer.js";
import Alert from "../models/Alert.js";
import { analyzeJobRisk } from "../services/verificationService.js";

export const createJob = async (req, res, next) => {
  try {
    const employer = await Employer.findOne({ userId: req.user.id });
    if (!employer) {
      return res
        .status(403)
        .json({
          success: false,
          message: "Employer profile required to post jobs.",
        });
    }

    const {
      title,
      description,
      requirements,
      salary,
      location,
      jobType,
      experienceLevel,
    } = req.body;

    // Run heuristic risk analysis
    const riskAnalysis = analyzeJobRisk(req.body, employer);

    const job = await JobListing.create({
      employerId: employer._id,
      postedBy: req.user.id,
      title,
      description,
      requirements,
      salary,
      location,
      jobType,
      experienceLevel,
      verificationStatus: riskAnalysis.isAutoFlagged
        ? "Under_Review"
        : "Verified",
      riskScore: riskAnalysis.riskScore,
      riskFlags: riskAnalysis.flags,
      isActive: !riskAnalysis.isAutoFlagged,
    });

    // Notify moderation if risk detected
    if (riskAnalysis.isAutoFlagged) {
      await Alert.create({
        type: "JOB_AUTO_FLAGGED",
        targetId: job._id,
        message: `Job "${job.title}" flagged with risk score ${riskAnalysis.riskScore}/100`,
        metadata: { flags: riskAnalysis.flags },
      });
    }

    return res.status(201).json({
      success: true,
      message: riskAnalysis.isAutoFlagged
        ? "Job created but held for manual trust review due to risk indicators."
        : "Job successfully posted.",
      data: job,
    });
  } catch (error) {
    next(error);
  }
};

export const getJobs = async (req, res, next) => {
  try {
    const {
      search,
      location,
      jobType,
      verifiedOnly,
      page = 1,
      limit = 10,
    } = req.query;

    const query = { isActive: true };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }
    if (location) query.location = { $regex: location, $options: "i" };
    if (jobType) query.jobType = jobType;
    if (verifiedOnly === "true") query.verificationStatus = "Verified";

    const jobs = await JobListing.find(query)
      .populate("employerId", "companyName verifiedStatus logo website")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await JobListing.countDocuments(query);

    return res.status(200).json({
      success: true,
      count: jobs.length,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
      data: jobs,
    });
  } catch (error) {
    next(error);
  }
};
