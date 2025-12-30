import mongoose from "mongoose";

const studyMaterialSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },

  description: {
    type: String,
    default: "",
  },

  subject: {
    type: String,
    required: true,
  },

  pdfUrl: {
    type: String,
    required: true,  // Cloudinary URL
  },

  link: {
    type: String,
    default: "",
  },


}, { timestamps: true });

export default mongoose.model("StudyMaterial", studyMaterialSchema);
