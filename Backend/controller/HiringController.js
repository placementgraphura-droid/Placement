import HiringTeam from "../model/RegisterDB/hiringSchema.js";
import JobPost from "../model/JobPostDB/JobSchema.js";
import Intern from "../model/RegisterDB/internSchema.js";
import { Parser } from "json2csv";
import ExcelJS from "exceljs";
import JobApplication from "../model/JobPostDB/JobApplication.js";

export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id; // from auth middleware

    const user = await HiringTeam.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    res.json({ success: true, data: user });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};


export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id; // from auth middleware

    const {
      name,
      email,
      phone,
      experience,
      bio
    } = req.body;

    const updatedUser = await HiringTeam.findByIdAndUpdate(
      userId,
      {
        name,
        email,
        phone,
        experience,
        bio,
      },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update profile",
    });
  }
};


export const uploadProfileImage = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image file uploaded",
      });
    }

    // ✅ Cloudinary URL is available here
    const imageUrl = req.file.path;

    const updatedUser = await HiringTeam.findByIdAndUpdate(
      userId,
      { profileImage: imageUrl },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Profile image uploaded successfully",
      imageUrl,
      data: updatedUser,
    });
  } catch (error) {
    console.error("Image upload error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Image upload failed",
    });
  }
};









export const createJobPost = async (req, res) => {
  try {
    const job = await JobPost.create(req.body);

    return res.status(201).json({
      success: true,
      message: "Job created successfully",
      data: job,
    });

  } catch (error) {
    console.error("Create Job Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



export const getAllJobPosts = async (req, res) => {
  try {
    const jobs = await JobPost.find()
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      data: jobs,
    });

  } catch (error) {
    console.error("Fetch Jobs Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch jobs",
    });
  }
};



export const getJobById = async (req, res) => {
  try {
    const job = await JobPost.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: job,
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


export const updateJob = async (req, res) => {
  try {
    const updatedJob = await JobPost.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        customFields: req.body.customFields || [],
        salary: req.body.salary || {},
      },
      { new: true, runValidators: true }
    );

    if (!updatedJob) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Job updated successfully",
      data: updatedJob,
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


export const updateJobStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["Open", "Closed"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    const isActive = status === "Open";

    const updatedJob = await JobPost.findByIdAndUpdate(
      req.params.id,
      {
        status,
        isActive,
      },
      { new: true }
    );

    if (!updatedJob) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: `Job ${status === "Open" ? "opened" : "closed"} successfully`,
      data: updatedJob,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



export const getAllInterns = async (req, res) => {
  try {
    const interns = await Intern.find({ isActive: true })
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: interns
    });
  } catch (error) {
    console.error("Get Interns Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch interns"
    });
  }
};


export const submitHiringFeedback = async (req, res) => {
  try {
    const { rating, comment, improvementSuggestions } = req.body;
    const internId = req.params.id;

    if (!rating) {
      return res.status(400).json({
        success: false,
        message: "Rating is required"
      });
    }

    const intern = await Intern.findById(internId);
    if (!intern) {
      return res.status(404).json({
        success: false,
        message: "Intern not found"
      });
    }

    intern.hiringTeamFeedback.push({
      rating,
      comment,
      improvementSuggestions
    });

    await intern.save();

    res.status(200).json({
      success: true,
      message: "Feedback submitted successfully"
    });

  } catch (error) {
    console.error("Feedback Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to submit feedback"
    });
  }
};



export const exportApplicants = async (req, res) => {
  try {
    const { jobId } = req.params;
    const format = req.query.format || "csv";

    // 🔎 Validate Job
    const job = await JobPost.findById(jobId).lean();
    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    // 📄 Fetch applications
    const applications = await JobApplication.find({ job: jobId })
      .sort({ createdAt: -1 })
      .lean();

    if (!applications.length) {
      return res.status(400).json({
        success: false,
        message: "No applicants found",
      });
    }

    // 🧠 Collect dynamic custom fields
    const customFieldKeys = new Set();
    applications.forEach(app => {
      if (app.customResponses) {
        Object.keys(app.customResponses).forEach(key =>
          customFieldKeys.add(key)
        );
      }
    });

    // 🧾 Build rows
    const rows = applications.map((app, index) => {
      const baseRow = {
        "S.No": index + 1,
        "Full Name": app.full_name || "",
        "Email": app.email || "",
        "Mobile Number": app.mobile_number || "",
        "Resume URL": app.resume || "",
        "Cover Letter": app.cover_letter || "",
        "Status": app.status || "APPLIED",
        "Applied At": new Date(app.appliedAt).toLocaleString(),
      };

      customFieldKeys.forEach(key => {
        baseRow[key] =
          app.customResponses?.[key] !== undefined
            ? String(app.customResponses[key])
            : "";
      });

      return baseRow;
    });

    // ✅ SAFE JOB TITLE FOR FILE NAME
    const safeJobTitle = job.title
      .replace(/[^a-zA-Z0-9-_ ]/g, "")
      .replace(/\s+/g, "_")
      .toLowerCase();

    // =========================
    // 📤 CSV EXPORT
    // =========================
    if (format === "csv") {
      const parser = new Parser({ fields: Object.keys(rows[0]) });
      const csv = parser.parse(rows);

      res.setHeader("Content-Type", "text/csv");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=applicants_${safeJobTitle}.csv`
      );

      return res.status(200).send(csv);
    }

    // =========================
    // 📊 EXCEL EXPORT
    // =========================
    if (format === "excel") {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Applicants");

      worksheet.columns = Object.keys(rows[0]).map(key => ({
        header: key,
        key,
        width: 25,
      }));

      rows.forEach(row => worksheet.addRow(row));

      worksheet.getRow(1).font = { bold: true };
      worksheet.views = [{ state: "frozen", ySplit: 1 }];

      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=applicants_${safeJobTitle}.xlsx`
      );

      await workbook.xlsx.write(res);
      return res.end();
    }

    return res.status(400).json({
      success: false,
      message: "Invalid format. Use csv or excel",
    });
  } catch (error) {
    console.error("Export applicants error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to export applicants",
    });
  }
};
