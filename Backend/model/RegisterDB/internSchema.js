import mongoose from "mongoose";

const internSchema = new mongoose.Schema({

  // 👤 Basic Details
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },

  // 🎓 Academic Info
  college: { type: String, required: true },
  course: { type: String, required: true },
  yearOfStudy: { type: Number},
  domain: { type: String },

  // 💼 Professional Info
  skills: [{ name: { type: String, required: true } }],
  resumeUrl: String,
  linkedinUrl: String,
  githubUrl: String,
  profileImage: String,

  // 🧩 Feedback
  mentorFeedback: [{
    comment: String,
    rating: { type: Number, min: 1, max: 5 },
    improvementSuggestions: String,
    date: { type: Date, default: Date.now }
  }],

  hiringTeamFeedback: [{
    comment: String,
    rating: { type: Number, min: 1, max: 5 },
    improvementSuggestions: String,
    date: { type: Date, default: Date.now }
  }],

  /* =========================================================
     💰 COMBINED PAYMENT SYSTEM (COURSES + JOB PACKAGES)
     ========================================================= */

  purchases: [
    {
      purchaseCategory: {
        type: String,
        enum: ["COURSE", "JOB_PACKAGE"],
        required: true
      },

      // 🎥 COURSE DETAILS
      courseDetails: {
        courseType: {
          type: String,
          enum: ["CV_BUILDING", "INTERVIEW_PREP", "COMBO"]
        },
        totalSessions: Number,       // 5 / 10 / 15
        liveSessions: Number,        // 2 / 5 / 7
        recordedSessions: Number     // auto or manual
      },

      // 💼 JOB PACKAGE DETAILS
      jobPackageDetails: {
        packageType: {
          type: String,
          enum: ["Silver", "NON_BLUE", "BLUE", "SUPER_BLUE"]
        },
        maxPackageLPA: Number,       // 5 / 10 / null
        creditsGiven: Number,        // 4 / 6 / 8
        creditsRemaining: Number
      },

      // 💳 PAYMENT INFO (COMMON)
      amountPaid: { type: Number, required: true },
      currency: { type: String, default: "INR" },
      paymentId: String,
      paymentStatus: {
        type: String,
        enum: ["SUCCESS", "FAILED", "PENDING"],
        default: "SUCCESS"
      },
      purchasedAt: { type: Date, default: Date.now }
    }
  ],

  // 🔄 Job Credit Usage
  creditHistory: [
    {
      action: { type: String, enum: ["JOB_APPLIED"] },
      creditsUsed: Number,
      jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job" },
      date: { type: Date, default: Date.now }
    }
  ],

  isActive: { type: Boolean, default: true }

}, { timestamps: true });

export default mongoose.model("Intern", internSchema, "Interns");
