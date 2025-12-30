// controllers/admin/internController.js
import Intern from "../model/RegisterDB/internSchema.js";
import Class from "../model/MentorDB/classes.js";
import StudyMaterial from "../model/MentorDB/studyMaterial.js";
import VideoLecture from "../model/MentorDB/VideoLectures.js";
import JobPost from "../model/JobPostDB/JobSchema.js";
import JobApplication from "../model/JobPostDB/JobApplication.js";
import Mentor from "../model/RegisterDB/mentorSchema.js";
import HiringTeam from "../model/RegisterDB/hiringSchema.js";
import { Parser } from "json2csv";
import archiver from "archiver";


// Get all interns (Admin - read only)
export const getAllInterns = async (req, res) => {
  try {
    // Get query parameters for filtering
    const { 
      domain, 
      yearOfStudy, 
      planCategory, 
      status,
      search 
    } = req.query;

    // Build filter object
    const filter = {};

    if (domain && domain !== 'all') {
      filter.domain = domain;
    }

    if (yearOfStudy && yearOfStudy !== 'all') {
      filter.yearOfStudy = parseInt(yearOfStudy);
    }

    if (status && status !== 'all') {
      filter.isActive = status === 'active';
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { college: { $regex: search, $options: 'i' } },
        { domain: { $regex: search, $options: 'i' } },
        { 'skills.name': { $regex: search, $options: 'i' } }
      ];
    }

    // Get interns with all feedbacks
    const interns = await Intern.find(filter)
      .select('-password -__v')
      .sort({ createdAt: -1 });

    // Format response data
    const formattedInterns = interns.map(intern => {
      const internObj = intern.toObject();
      
      // Find the latest job package purchase
      const latestJobPackage = intern.purchases
        .filter(p => p.purchaseCategory === 'JOB_PACKAGE')
        .sort((a, b) => new Date(b.purchasedAt) - new Date(a.purchasedAt))[0];

      // Find active job credits
      const activeJobCredits = latestJobPackage 
        ? latestJobPackage.jobPackageDetails?.creditsRemaining || 0
        : 0;

      // Calculate total feedback rating (combining hiring and mentor)
      const hiringFeedbacks = intern.hiringTeamFeedback || [];
      const mentorFeedbacks = intern.mentorFeedback || [];
      const allFeedbacks = [...hiringFeedbacks, ...mentorFeedbacks];
      
      const avgRating = allFeedbacks.length > 0
        ? allFeedbacks.reduce((sum, feedback) => sum + (feedback.rating || 0), 0) / allFeedbacks.length
        : 0;

      // Determine plan category
      let planCategory = 'NONE';
      if (latestJobPackage) {
        planCategory = latestJobPackage.jobPackageDetails?.packageType || 'NONE';
      }

      return {
        ...internObj,
        planCategory,
        jobCredits: activeJobCredits,
        hiringTeamFeedback: hiringFeedbacks,
        mentorFeedback: mentorFeedbacks,
        avgRating: avgRating.toFixed(1),
        status: intern.isActive ? 'active' : 'inactive'
      };
    });

    // Apply plan category filter
    let filteredInterns = formattedInterns;
    if (planCategory && planCategory !== 'all') {
      if (planCategory === 'NONE') {
        filteredInterns = formattedInterns.filter(intern => !intern.planCategory || intern.planCategory === 'NONE');
      } else {
        filteredInterns = formattedInterns.filter(intern => 
          intern.planCategory && intern.planCategory === planCategory
        );
      }
    }

    res.status(200).json({
      success: true,
      count: filteredInterns.length,
      data: filteredInterns
    });

  } catch (error) {
    console.error('Error fetching interns:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching interns'
    });
  }
};

// Update intern status only (admin can't edit/delete feedbacks)
export const updateInternStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    if (!status || !['active', 'inactive'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be either "active" or "inactive"'
      });
    }

    // Find and update intern
    const intern = await Intern.findByIdAndUpdate(
      id,
      { 
        isActive: status === 'active',
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    ).select('-password -__v');

    if (!intern) {
      return res.status(404).json({
        success: false,
        message: 'Intern not found'
      });
    }

    res.status(200).json({
      success: true,
      message: `Intern marked as ${status}`,
      data: {
        ...intern.toObject(),
        status: intern.isActive ? 'active' : 'inactive'
      }
    });

  } catch (error) {
    console.error('Error updating intern status:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating intern status'
    });
  }
};



export const getAllClasses = async (req, res) => {
  try {
    const classes = await Class.find()
      .sort({ startTime: -1 });

    res.status(200).json({ classes });
  } catch (error) {
    console.error("Get classes error:", error);
    res.status(500).json({ message: "Failed to fetch classes" });
  }
};


export const createClass = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      classType,
      meetingLink,
      startTime,
      endTime,
      thumbnailUrl,
    } = req.body;

    const newClass = await Class.create({
      title,
      description,
      category,
      classType,
      meetingLink,
      startTime,
      endTime,
      thumbnailUrl: req.file?.path || thumbnailUrl || "",
    });

    res.status(201).json({ message: "Class created successfully", class: newClass });
  } catch (error) {
    console.error("Create class error:", error);
    res.status(500).json({ message: "Failed to create class" });
  }
};



export const updateClass = async (req, res) => {
  try {
    const classId = req.params.id;

    const cls = await Class.findById(classId);
    if (!cls) {
      return res.status(404).json({ message: "Class not found" });
    }

    const {
      title,
      description,
      category,
      classType,
      meetingLink,
      startTime,
      endTime,
      thumbnailUrl,
    } = req.body;

    // Update fields
    cls.title = title ?? cls.title;
    cls.description = description ?? cls.description;
    cls.category = category ?? cls.category;
    cls.classType = classType ?? cls.classType;
    cls.meetingLink = meetingLink ?? cls.meetingLink;
    cls.startTime = startTime ?? cls.startTime;
    cls.endTime = endTime ?? cls.endTime;


    // ✅ Cloudinary image replacement logic
    if (req.file?.path) {
      cls.thumbnailUrl = req.file.path;
    } else if (thumbnailUrl !== undefined) {
      cls.thumbnailUrl = thumbnailUrl;
    }

    await cls.save();

    res.status(200).json(cls);
  } catch (error) {
    console.error("Update class error:", error);
    res.status(500).json({ message: "Failed to update class" });
  }
};



export const deleteClass = async (req, res) => {
  try {
    const classId = req.params.id;

    const cls = await Class.findById(classId);
    if (!cls) {
      return res.status(404).json({ message: "Class not found" });
    }

    await cls.deleteOne();

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Delete class error:", error);
    res.status(500).json({ message: "Failed to delete class" });
  }
};  

export const getAllStudyMaterials = async (req, res) => {
  try {
    const materials = await StudyMaterial.find()
      .sort({ createdAt: -1 });

    res.status(200).json({ data: materials });
  } catch (error) {
    console.error("Fetch materials error:", error);
    res.status(500).json({ message: "Failed to fetch materials" });
  }
};
 

export const uploadStudyMaterial = async (req, res) => {
  try {
    const {
      title,
      subject,
      description,
      link,
    } = req.body;

    if (!title || !subject) {
      return res.status(400).json({ message: "Title and subject are required" });
    }

    const material = new StudyMaterial({
      title,
      subject,
      description,
      link,
      pdfUrl: req.file ? req.file.path : null,

    });

    await material.save();
    res.status(201).json({ message: "Material uploaded successfully", material });
  } catch (error) {
    console.error("Upload material error:", error);
    res.status(500).json({ message: "Failed to upload material" });
  }
};



export const updateStudyMaterial = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      title,
      subject,
      category,
      description,
      link,
    } = req.body;

    const material = await StudyMaterial.findById(id);
    if (!material) {
      return res.status(404).json({ message: "Material not found" });
    }

    material.title = title ?? material.title;
    material.subject = subject ?? material.subject;
    material.category = category ?? material.category;
    material.description = description ?? material.description;
    material.link = link ?? material.link;

    if (req.file) {
      material.pdfUrl = req.file.path;
    }

    await material.save();

    res.status(200).json({ message: "Material updated successfully", material });
  } catch (error) {
    console.error("Update material error:", error);
    res.status(500).json({ message: "Failed to update material" });
  }
};



export const deleteStudyMaterial = async (req, res) => {
  try {
    const { id } = req.params;

    const material = await StudyMaterial.findById(id);
    if (!material) {
      return res.status(404).json({ message: "Material not found" });
    }

    await material.deleteOne();

    res.status(200).json({ message: "Material deleted successfully" });
  } catch (error) {
    console.error("Delete material error:", error);
    res.status(500).json({ message: "Failed to delete material" });
  }
};



export const uploadVideoLecture = async (req, res) => {
  try {
    const {
      title,
      description,
      duration,
      category
    } = req.body;

    if (!title || !duration || !category) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    let videoUrl = null;
    let thumbnailUrl = null;

    if (req.files?.video?.[0]) {
      videoUrl = req.files.video[0].path;
    }

    if (req.files?.thumbnail?.[0]) {
      thumbnailUrl = req.files.thumbnail[0].path;
    }

    if (!videoUrl) {
      return res.status(400).json({ message: "Video file is required" });
    }

    const video = new VideoLecture({
      title,
      description,
      duration,
      category,
      videoUrl,
      thumbnailUrl,
    });

    await video.save();

    res.status(201).json(video);
  } catch (error) {
    console.error("Upload video error:", error);
    res.status(500).json({ message: "Failed to upload video" });
  }
};



export const getAllVideos = async (req, res) => {
  try {
    const videos = await VideoLecture.find()
      .sort({ createdAt: -1 });

    res.status(200).json({ videos });
  } catch (error) {
    console.error("Fetch videos error:", error);
    res.status(500).json({ message: "Failed to fetch videos" });
  }
};


export const updateVideoLecture = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      title,
      description,
      duration,
      category
    } = req.body;

    const video = await VideoLecture.findById(id);
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    video.title = title ?? video.title;
    video.description = description ?? video.description;
    video.duration = duration ?? video.duration;
    video.category = category ?? video.category;

    if (req.files?.video?.[0]) {
      video.videoUrl = req.files.video[0].path;
    }

    if (req.files?.thumbnail?.[0]) {
      video.thumbnailUrl = req.files.thumbnail[0].path;
    }

    await video.save();

    res.status(200).json(video);
  } catch (error) {
    console.error("Update video error:", error);
    res.status(500).json({ message: "Failed to update video" });
  }
};


export const deleteVideoLecture = async (req, res) => {
  try {
    const { id } = req.params;

    const video = await VideoLecture.findById(id);
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    await video.deleteOne();

    res.status(200).json({ message: "Video deleted successfully" });
  } catch (error) {
    console.error("Delete video error:", error);
    res.status(500).json({ message: "Failed to delete video" });
  }
};



export const getAllJobsAdmin = async (req, res) => {
  try {
    const jobs = await JobPost.find()
    res.status(200).json({
      success: true,
      data: jobs,
    });
  } catch (error) {
    res.status(500).json({
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



export const deleteJobAdmin = async (req, res) => {
  try {
    const { jobId } = req.params;

    await JobApplication.deleteMany({ job: jobId });
    await JobPost.findByIdAndDelete(jobId);

    res.status(200).json({
      success: true,
      message: "Job deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete job",
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

export const exportAllJobData = async (req, res) => {
  try {
    const { jobId } = req.params;

    const job = await JobPost.findById(jobId).lean();
    const applications = await JobApplication.find({ job: jobId }).lean();

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    res.setHeader("Content-Type", "application/zip");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=job_${jobId}.zip`
    );

    const archive = archiver("zip", { zlib: { level: 9 } });
    archive.pipe(res);

    archive.append(JSON.stringify(job, null, 2), {
      name: "job_details.json",
    });

    archive.append(JSON.stringify(applications, null, 2), {
      name: "applicants.json",
    });

    await archive.finalize();
  } catch (error) {
    console.error("Export job data error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to export job data",
    });
  }
};



export const getAllInternsWithPayments = async (req, res) => {
  try {
    const interns = await Intern.find()
      .select(
        "name email phone college course yearOfStudy purchases"
      )
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: interns,
    });
  } catch (error) {
    console.error("Fetch interns payments error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch interns payment data",
    });
  }
};


export const exportAllPayments = async (req, res) => {
  try {
    const interns = await Intern.find()
      .select(
        "name email phone college course purchases"
      )
      .lean();

    const rows = [];

    interns.forEach(intern => {
      intern.purchases?.forEach(purchase => {
        rows.push({
          "Intern Name": intern.name,
          "Email": intern.email,
          "Phone": intern.phone || "",
          "College": intern.college || "",
          "Course": intern.course || "",
          "Category": purchase.purchaseCategory,
          "Package/Course Type":
            purchase.purchaseCategory === "JOB_PACKAGE"
              ? purchase.jobPackageDetails?.packageType
              : purchase.courseDetails?.courseType,
          "Amount Paid": purchase.amountPaid || 0,
          "Currency": purchase.currency || "INR",
          "Payment Status": purchase.paymentStatus,
          "Payment Date": new Date(purchase.purchasedAt).toLocaleDateString(),
          "Credits Given": purchase.jobPackageDetails?.creditsGiven || 0,
          "Credits Remaining": purchase.jobPackageDetails?.creditsRemaining || 0,
          "Live Sessions": purchase.courseDetails?.liveSessions || 0,
          "Recorded Sessions": purchase.courseDetails?.recordedSessions || 0,
        });
      });
    });

    if (!rows.length) {
      return res.status(400).json({
        success: false,
        message: "No payment data found",
      });
    }

    const parser = new Parser({ fields: Object.keys(rows[0]) });
    const csv = parser.parse(rows);

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=all_payments_${new Date()
        .toISOString()
        .split("T")[0]}.csv`
    );

    return res.status(200).send(csv);
  } catch (error) {
    console.error("Export all payments error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to export payment data",
    });
  }
};


export const getAllMentors = async (req, res) => {
  try {
    const mentors = await Mentor.find()
      .select("-password") // never send password
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: mentors,
    });
  } catch (error) {
    console.error("Get mentors error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch mentors",
    });
  }
};


export const toggleMentorActiveStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isactive } = req.body;

    const mentor = await Mentor.findById(id);

    if (!mentor) {
      return res.status(404).json({
        success: false,
        message: "Mentor not found",
      });
    }

    mentor.isactive = isactive;
    await mentor.save();

    return res.status(200).json({
      success: true,
      message: `Mentor ${isactive ? "activated" : "deactivated"} successfully`,
      data: {
        _id: mentor._id,
        isactive: mentor.isactive,
      },
    });
  } catch (error) {
    console.error("Toggle mentor status error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update mentor status",
    });
  }
};


export const exportMentors = async (req, res) => {
  try {
    const mentors = await Mentor.find().select("-password").lean();

    if (!mentors.length) {
      return res.status(404).json({
        success: false,
        message: "No mentors found",
      });
    }

    const fields = [
      { label: "Name", value: "name" },
      { label: "Email", value: "email" },
      { label: "Phone", value: "phone" },
      { label: "Role", value: "role" },
      { label: "Experience (Years)", value: "experience" },
      { label: "Domains", value: (row) => row.domain?.join(", ") || "" },
      { label: "LinkedIn", value: "linkedinUrl" },
      { label: "GitHub", value: "githubUrl" },
      { label: "Active", value: (row) => (row.isactive ? "Yes" : "No") },
      { label: "Joined At", value: "createdAt" },
    ];

    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(mentors);

    res.header("Content-Type", "text/csv");
    res.attachment(`mentors_${Date.now()}.csv`);
    return res.send(csv);
  } catch (error) {
    console.error("Export mentors error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to export mentors",
    });
  }
};


export const getAllHiringTeam = async (req, res) => {
  try {
    const members = await HiringTeam.find()
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: members,
    });
  } catch (error) {
    console.error("Fetch hiring team error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch hiring team members",
    });
  }
};


export const toggleHiringTeamStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isactive } = req.body;

    const member = await HiringTeam.findById(id);

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Hiring team member not found",
      });
    }

    member.isactive = isactive;
    await member.save();

    res.status(200).json({
      success: true,
      message: `Member ${isactive ? "activated" : "deactivated"} successfully`,
      data: {
        _id: member._id,
        isactive: member.isactive,
      },
    });
  } catch (error) {
    console.error("Toggle status error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update status",
    });
  }
};


export const exportHiringTeam = async (req, res) => {
  try {
    const members = await HiringTeam.find().select("-password").lean();

    if (!members.length) {
      return res.status(404).json({
        success: false,
        message: "No hiring team members found",
      });
    }

    const fields = [
      { label: "Name", value: "name" },
      { label: "Email", value: "email" },
      { label: "Phone", value: "phone" },
      { label: "Role", value: "role" },
      { label: "Experience (Years)", value: "experience" },
      { label: "Bio", value: "bio" },
      { label: "Profile Image", value: "profileImage" },
      { label: "Active", value: (row) => (row.isactive ? "Yes" : "No") },
      { label: "Joined At", value: "createdAt" },
    ];

    const parser = new Parser({ fields });
    const csv = parser.parse(members);

    res.header("Content-Type", "text/csv");
    res.attachment(`hiring_team_${Date.now()}.csv`);
    return res.send(csv);
  } catch (error) {
    console.error("Export hiring team error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to export hiring team",
    });
  }
};


export const getAdminStats = async (req, res) => {
  try {
    const interns = await Intern.countDocuments();
    const mentors = await Mentor.countDocuments();
    const hr = await HiringTeam.countDocuments();
    const jobs = await JobPost.countDocuments();

    res.json({ interns, mentors, hr, jobs });
  } catch (err) {
    res.status(500).json({ message: "Failed to load stats" });
  }
};


export const getWeeklyJobs = async (req, res) => {
  try {
    const jobs = await JobPost.aggregate([
      {
        $group: {
          _id: { $week: "$createdAt" },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    const result = jobs.map((item, index) => ({
      week: `Week ${index + 1}`,
      count: item.count
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "Failed to load jobs data" });
  }
};


export const getMonthlyPurchasedInternGrowth = async (req, res) => {
  try {
    const { year = new Date().getFullYear() } = req.query;
    
    // Convert year to number and validate
    const targetYear = parseInt(year);
    if (isNaN(targetYear) || targetYear < 2000 || targetYear > 2100) {
      return res.status(400).json({ 
        message: "Invalid year parameter. Please provide a valid year (2000-2100)." 
      });
    }

    const data = await Intern.aggregate([
      // Filter documents that have purchases array
      { $match: { purchases: { $exists: true, $ne: [] } } },
      
      // Unwind purchases array
      { $unwind: "$purchases" },
      
      // Match only successful payments
      {
        $match: {
          "purchases.paymentStatus": "SUCCESS",
          "purchases.purchasedAt": { $exists: true, $ne: null }
        }
      },
      
      // Convert purchasedAt to date safely
      {
        $addFields: {
          purchaseDate: {
            $cond: {
              if: { $eq: [{ $type: "$purchases.purchasedAt" }, "date"] },
              then: "$purchases.purchasedAt",
              else: {
                $cond: {
                  if: { $eq: [{ $type: "$purchases.purchasedAt" }, "string"] },
                  then: { $toDate: "$purchases.purchasedAt" },
                  else: null
                }
              }
            }
          }
        }
      },
      
      // Filter out invalid dates and filter by year
      {
        $match: {
          purchaseDate: { $ne: null },
          $expr: { $eq: [{ $year: "$purchaseDate" }, targetYear] }
        }
      },
      
      // Group by month to get count of purchases (not unique interns)
      {
        $group: {
          _id: {
            month: { $month: "$purchaseDate" }
          },
          purchaseCount: { $sum: 1 },
          uniqueInterns: { $addToSet: "$_id" } // For unique intern count if needed
        }
      },
      
      // Calculate both total purchases and unique interns
      {
        $project: {
          month: "$_id.month",
          // Count of all successful purchases
          totalPurchases: "$purchaseCount",
          // Count of unique interns who made purchases
          uniqueInternsCount: { $size: "$uniqueInterns" },
          _id: 0
        }
      },
      
      // Sort by month
      { $sort: { month: 1 } }
    ]);

    // Prepare month names
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    // Create a complete array for all months (even with 0 purchases)
    const completeData = Array.from({ length: 12 }, (_, i) => {
      const monthData = data.find(item => item.month === i + 1);
      return {
        month: months[i],
        monthNumber: i + 1,
        year: targetYear,
        totalPurchases: monthData ? monthData.totalPurchases : 0,
        uniqueInterns: monthData ? monthData.uniqueInternsCount : 0
      };
    });

    // Also calculate summary statistics
    const summary = {
      year: targetYear,
      totalPurchases: completeData.reduce((sum, month) => sum + month.totalPurchases, 0),
      totalUniqueInterns: completeData.reduce((sum, month) => sum + month.uniqueInterns, 0),
      averageMonthlyPurchases: Math.round(
        completeData.reduce((sum, month) => sum + month.totalPurchases, 0) / 12
      ),
      peakMonth: completeData.reduce((max, month) => 
        month.totalPurchases > max.totalPurchases ? month : max, 
        { month: "", totalPurchases: 0 }
      )
    };

    res.json({
      success: true,
      year: targetYear,
      data: completeData,
      summary,
      metadata: {
        generatedAt: new Date().toISOString(),
        dataPoints: completeData.length,
        currentMonth: months[new Date().getMonth()]
      }
    });
    
  } catch (error) {
    console.error("Monthly Purchase Growth Error:", error);
    
    // More specific error responses
    if (error.name === 'MongoServerError') {
      return res.status(500).json({ 
        success: false,
        message: "Database error occurred",
        error: error.code === 241 ? "Invalid date format in database" : error.message 
      });
    }
    
    res.status(500).json({ 
      success: false,
      message: "Failed to fetch purchase growth data",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};



export const getMonthlyRevenue = async (req, res) => {
  try {
    const data = await Intern.aggregate([
      { $unwind: "$purchases" },
      {
        $match: {
          "purchases.paymentStatus": "SUCCESS"
        }
      },
      {
        $group: {
          _id: { $month: "$purchases.purchasedAt" },
          amount: { $sum: "$purchases.amountPaid" }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    const result = data.map(item => ({
      month: months[item._id - 1],
      amount: item.amount
    }));

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch revenue data" });
  }
};


export const getPlansPurchasedStats = async (req, res) => {
  try {
    const data = await Intern.aggregate([
      { $unwind: "$purchases" },
      {
        $match: {
          "purchases.paymentStatus": "SUCCESS"
        }
      },
      {
        $project: {
          planName: {
            $cond: [
              { $eq: ["$purchases.purchaseCategory", "COURSE"] },
              "$purchases.courseDetails.courseType",
              "$purchases.jobPackageDetails.packageType"
            ]
          }
        }
      },
      {
        $group: {
          _id: "$planName",
          count: { $sum: 1}
        }
      }
    ]);

    const result = data.map(item => ({
      plan: item._id,
      count: item.count
    }));

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch plan stats" });
  }
};



export const getMentorsAndHRs = async (req, res) => {
  try {
    const mentors = await Mentor.find({ role: "Mentor" })
      .select("name role experience phone createdAt");

    const hrs = await HiringTeam.find({ role: "HiringTeam" })
      .select("name role experience phone createdAt");

    res.json({ mentors, hrs });
  } catch (err) {
    res.status(500).json({ message: "Failed to load users" });
  }
};