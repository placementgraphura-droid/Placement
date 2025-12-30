import mongoose from "mongoose";

const jobApplicationSchema = new mongoose.Schema(
  {
    intern: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Intern",
      required: true,
    },

    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },

    // 🔹 Static mandatory fields
    full_name: { type: String, required: true },
    email: { type: String, required: true },
    mobile_number: { type: String, required: true },
    resume: { type: String, required: true }, // URL
    cover_letter: { type: String },

    // 🔹 Dynamic custom fields (MAIN PART)
    customResponses: {
      type: Map,
      of: mongoose.Schema.Types.Mixed, // supports string, array, number, url
    },

    status: {
      type: String,
      enum: ["APPLIED", "SHORTLISTED", "REJECTED", "HIRED"],
      default: "APPLIED",
    },

    appliedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model("JobApplication", jobApplicationSchema);
