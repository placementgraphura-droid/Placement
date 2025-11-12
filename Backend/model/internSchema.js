import mongoose from "mongoose";

const internSchema = new mongoose.Schema({
  // 👤 Basic Details
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true }, // bcrypt hashed

  // 🎓 Academic Info
  college: { type: String, required: true },
  course: { type: String, required: true },
  yearOfStudy: { type: Number, required: true },
  department: { type: String },
  cgpa: { type: Number, min: 0, max: 10 },

  // 💼 Professional Info
  skills: [{ type: String, required: true }],
  resumeUrl: { type: String },
  linkedinUrl: { type: String },
  githubUrl: { type: String },

  // 🧩 Internship Details
  appliedFor: { type: String }, // e.g., "Web Development"
  internshipStatus: {
    type: String,
    enum: ["pending", "in_progress", "completed", "hired"],
    default: "pending",
  },
  
  feedback: { type: String },

  // ⚙️ Misc
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model("Intern", internSchema);
