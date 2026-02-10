import Intern from "../model/RegisterDB/internSchema.js"
import JobPost from "../model/JobPostDB/JobSchema.js"
import Class from "../model/MentorDB/classes.js"
import JobApplication from "../model/JobPostDB/JobApplication.js"
import StudyMaterial from "../model/MentorDB/studyMaterial.js"
import VideoLecture from "../model/MentorDB/VideoLectures.js"


export const getInternProfile = async (req, res) => {
  try {
    const internId = req.user.id;

    const intern = await Intern.findById(internId).select("-password");

    if (!intern) {
      return res.status(404).json({ message: "Intern not found" });
    }

    res.json(intern);
  } catch (error) {
    console.error("Error getting profile:", error);
    res.status(500).json({ message: "Server Error" });
  }
};


export const uploadProfileImage = async (req, res) => {
  try {
    // multer + cloudinary already uploaded the file
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image file uploaded",
      });
    }

    const internId = req.user.id; // from auth middleware
    const imageUrl = req.file.path; // cloudinary secure_url

    const intern = await Intern.findByIdAndUpdate(
      internId,
      { profileImage: imageUrl },
      { new: true }
    );

    if (!intern) {
      return res.status(404).json({
        success: false,
        message: "Intern not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile image uploaded successfully",
      profileImage: intern.profileImage,
    });

  } catch (error) {
    console.error("Upload profile image error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while uploading profile image",
    });
  }
};

export const updateInternProfile = async (req, res) => {
  try {
    const internId = req.user.id;
    let updateData = {};

    if (req.file) {
      // File upload
      if (req.file.fieldname === "resume") {
        updateData.resumeUrl = req.file.path;
      } else if (req.file.fieldname === "profileImage") {
        updateData.profileImage = req.file.path;
      }
    } else {
      updateData = req.body || {};
    }

    const intern = await Intern.findById(internId);
    if (!intern) {
      return res.status(404).json({ message: "Intern not found" });
    }

    // ----- SAFE SKILLS HANDLING -----
    if (updateData && updateData.skills !== undefined) {
      let rawSkills = updateData.skills;

      if (typeof rawSkills === "string") {
        try {
          rawSkills = JSON.parse(rawSkills);
        } catch (err) {
          rawSkills = [rawSkills];
        }
      }

      if (Array.isArray(rawSkills)) {
        intern.skills = rawSkills
          .map(skill => {
            if (typeof skill === "string") return { name: skill };
            if (skill?.name) return { name: skill.name };
            return null;
          })
          .filter(Boolean);
      }
    }

    // ----- Update other fields -----
    const fields = [
      "name", "phone", "college", "course", "yearOfStudy",
      "domain", "linkedinUrl", "githubUrl", "resumeUrl", "profileImage"
    ];

    fields.forEach(field => {
      if (updateData[field] !== undefined) {
        intern[field] = updateData[field];
      }
    });

    await intern.save();

    res.json({
      message: "Profile updated successfully",
      intern
    });

  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getInternClasses = async (req, res) => {
  try {
    const classes = await Class.find().sort({ startTime: 1 });

    res.json({
      success: true,
      classes: classes.map(cls => ({
        _id: cls._id,
        title: cls.title,
        description: cls.description,
        courseType: cls.category,
        classType: cls.classType,
        meetingLink: cls.meetingLink,
        startTime: cls.startTime,
        endTime: cls.endTime,
        thumbnailUrl: cls.thumbnailUrl
      }))
    });
  } catch (error) {
    console.error('Error fetching classes:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching classes'
    });
  }
}

export const getStudyMaterials = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 9;
    const skip = (page - 1) * limit;

    const total = await StudyMaterial.countDocuments();

    const materials = await StudyMaterial.find()

      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      materials,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("Fetch materials error:", error);
    res.status(500).json({ message: "Failed to fetch study materials" });
  }
};

export const searchStudyMaterials = async (req, res) => {
  try {
    const query = req.query.query;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 9;
    const skip = (page - 1) * limit;

    if (!query) {
      return res.status(200).json({
        materials: [],
        totalPages: 1,
        currentPage: 1,
      });
    }

    const filter = {
      $or: [
        { title: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
        { subject: { $regex: query, $options: "i" } },
      ],
    };

    const total = await StudyMaterial.countDocuments(filter);

    const materials = await StudyMaterial.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      materials,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ message: "Search failed" });
  }
};

export const getVideoLectures = async (req, res) => {
  try {
    const videos = await VideoLecture.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      videos: videos.map(video => ({
        id: video._id,
        title: video.title,
        description: video.description,
        category: video.category,
        thumbnail: video.thumbnailUrl,
        duration: video.duration,
        videoUrl: video.videoUrl
      }))
    });
  } catch (error) {
    console.error('Get Video Lectures Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch video lectures'
    });
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    const internId = req.user.id;

    // 1️⃣ Fetch intern feedback counts
    const intern = await Intern.findById(internId).select(
      "mentorFeedback hiringTeamFeedback"
    );

    if (!intern) {
      return res.status(404).json({
        success: false,
        message: "Intern not found",
      });
    }

    // 2️⃣ Count jobs applied by THIS intern
    const jobsApplied = await JobApplication.countDocuments({
      intern: internId,
      status: "APPLIED",
    });


    res.status(200).json({
      success: true,
      jobsApplied,
      mentorFeedbackCount: intern.mentorFeedback?.length || 0,
      hiringFeedbackCount: intern.hiringTeamFeedback?.length || 0,
      studyProgress: 0, // you can wire later
    });

  } catch (error) {
    console.error("Dashboard stats error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to load dashboard stats",
    });
  }
};

export const getRecentJobPosts = async (req, res) => {
  try {
    const jobs = await JobPost.find({ isActive: true })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("title companyName status createdAt");

    const formattedJobs = jobs.map(job => ({
      id: job._id,
      title: job.title,
      company: job.companyName,
      status: job.status.toLowerCase(), // "open"
      appliedDate: job.createdAt,       // frontend already formats it
    }));

    res.status(200).json(formattedJobs);
  } catch (error) {
    res.status(500).json({ message: "Failed to load recent jobs" });
  }
};

export const getRecentFeedback = async (req, res) => {
  try {
    const internId = req.user.id;

    const intern = await Intern.findById(internId).select(
      "mentorFeedback hiringTeamFeedback"
    );

    if (!intern) {
      return res.status(404).json({ message: "Intern not found" });
    }

    res.status(200).json({
      mentorFeedback: intern.mentorFeedback.map(item => ({
        _id: item._id,
        comment: item.comment,
        rating: item.rating,
        date: item.date,
        improvementSuggestions: item.improvementSuggestions || "",
        actionableItems: item.actionableItems || [],
        followUpRequired: item.followUpRequired || false,
        sentiment: item.sentiment || "neutral",
        strengths: item.strengths || [],
        areasForImprovement: item.areasForImprovement || []
      })),

      hiringTeamFeedback: intern.hiringTeamFeedback.map(item => ({
        _id: item._id,
        comment: item.comment,
        rating: item.rating,
        date: item.date,
        company: item.company,
        improvementSuggestions: item.improvementSuggestions || "",
        actionableItems: item.actionableItems || [],
        followUpRequired: item.followUpRequired || false,
        sentiment: item.sentiment || "neutral",
        strengths: item.strengths || [],
        areasForImprovement: item.areasForImprovement || []
      }))
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to load feedback" });
  }
};


export const getInternJobApplicationForm = async (req, res) => {
  try {
    const job = await JobPost.findById(req.params.jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Check if job is still open
    if (job.status !== 'Open' || !job.isActive) {
      return res.status(400).json({
        success: false,
        message: 'This job is no longer accepting applications'
      });
    }

    // Check if user has already applied
    const existingApplication = await JobApplication.findOne({
      jobId: job._id,
      userId: req.user.id
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied for this job'
      });
    }

    res.json({
      success: true,
      data: {
        customFields: job.customFields || []
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch application form'
    });
  }
}


export const applyForJob = async (req, res) => {
  try {
    const internId = req.user.id;
    const { jobId, formData } = req.body;

    if (!jobId || !formData) {
      return res.status(400).json({
        success: false,
        message: "Job ID and form data are required",
      });
    }

    // 1️⃣ Prevent duplicate application
    const alreadyApplied = await JobApplication.findOne({
      intern: internId,
      job: jobId,
    });

    if (alreadyApplied) {
      return res.status(400).json({
        success: false,
        message: "You have already applied for this job",
      });
    }

    // 2️⃣ Validate job
    const job = await JobPost.findById(jobId);
    if (!job || job.status !== "Open" || !job.isActive) {
      return res.status(400).json({
        success: false,
        message: "Job is not accepting applications",
      });
    }

    // 3️⃣ Fetch intern with purchases
    const intern = await Intern.findById(internId);

    if (!intern) {
      return res.status(404).json({
        success: false,
        message: "Intern not found",
      });
    }

    // 4️⃣ Get ALL successful job packages
    const jobPackages = intern.purchases
      .filter(p =>
        p.purchaseCategory === "JOB_PACKAGE" &&
        p.paymentStatus === "SUCCESS"
      )
      .sort((a, b) => new Date(a.purchasedAt) - new Date(b.purchasedAt));

    if (jobPackages.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No active job package found",
      });
    }

    // 5️⃣ Pick LATEST package (last index)
    const latestPackage = jobPackages[jobPackages.length - 1];

    if (latestPackage.jobPackageDetails.creditsRemaining <= 0) {
      return res.status(400).json({
        success: false,
        message: "No job credits remaining",
      });
    }

    // 6️⃣ Extract static fields
    const {
      full_name,
      email,
      mobile_number,
      resume,
      cover_letter,
      ...dynamicFields
    } = formData;

    if (!full_name || !email || !mobile_number || !resume) {
      return res.status(400).json({
        success: false,
        message: "Missing required application fields",
      });
    }

    // 7️⃣ Create application
    const application = await JobApplication.create({
      intern: internId,
      job: jobId,
      full_name,
      email,
      mobile_number,
      resume,
      cover_letter,
      customResponses: dynamicFields,
    });

    // 8️⃣ Increment job applicant count
    await JobPost.findByIdAndUpdate(jobId, {
      $inc: { applicantsCount: 1 },
    });

    // 9️⃣ Deduct credit from LATEST package
    latestPackage.jobPackageDetails.creditsRemaining -= 1;

    await intern.save();

    return res.status(201).json({
      success: true,
      message: "Job application submitted successfully",
      data: application,
      creditsRemaining: latestPackage.jobPackageDetails.creditsRemaining,
    });

  } catch (error) {
    console.error("Apply job error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to submit job application",
    });
  }
};



export const getAppliedJobs = async (req, res) => {
  try {
    const internId = req.user.id;

    const applications = await JobApplication.find({ intern: internId })
      .select("job")
      .lean();

    const appliedJobs = applications.map(a => a.job);

    res.json({
      success: true,
      data: { appliedJobs },
    });
  } catch (error) {
    res.status(500).json({ success: false });
  }
};


export const uploadResume = async (req, res) => {
  try {
    // multer + cloudinary already handled upload
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    // Cloudinary gives secure URL here
    const fileUrl = req.file.path;

    return res.status(200).json({
      success: true,
      message: "Resume uploaded successfully",
      fileUrl, // send back URL to frontend
    });

  } catch (error) {
    console.error("Resume upload error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to upload resume",
    });
  }
};


export const joinLiveClass = async (req, res) => {
  try {
    const internId = req.user.id;
    const { classId } = req.params;

    // 🔹 Fetch class
    const liveClass = await Class.findById(classId);

    if (!liveClass) {
      return res.status(404).json({
        success: false,
        message: "Class not found",
      });
    }

    // 🔹 Check class timing
    const now = new Date();
    if (now < new Date(liveClass.startTime) || now > new Date(liveClass.endTime)) {
      return res.status(400).json({
        success: false,
        message: "Class is not live right now",
      });
    }

    // 🔹 Fetch intern with purchases
    const intern = await Intern.findById(internId);

    if (!intern) {
      return res.status(404).json({
        success: false,
        message: "Intern not found",
      });
    }

    // 🔹 Get latest COURSE package (last index)
    const coursePackages = intern.purchases
      .filter(p =>
        p.purchaseCategory === "COURSE" &&
        p.paymentStatus === "SUCCESS"
      )
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

    if (coursePackages.length === 0) {
      return res.status(403).json({
        success: false,
        message: "No active course package found",
      });
    }

    const latestCourse = coursePackages[coursePackages.length - 1];

    // 🔹 Check live sessions
    if (latestCourse.courseDetails.liveSessions <= 0) {
      return res.status(403).json({
        success: false,
        message: "No live sessions remaining in your package",
      });
    }

    // 🔹 Deduct live session
    latestCourse.courseDetails.liveSessions -= 1;

    await intern.save();

    return res.status(200).json({
      success: true,
      message: "Access granted to live class",
      meetingLink: liveClass.meetingLink,
      liveSessionsRemaining: latestCourse.courseDetails.liveSessions,
    });

  } catch (error) {
    console.error("Join live class error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to join live class",
    });
  }
};