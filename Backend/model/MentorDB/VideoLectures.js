import mongoose from "mongoose";

const videoLectureSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },

  description: {
    type: String,
    default: "",
  },  

  thumbnailUrl: {
    type: String,
    required: true, // Thumbnail Cloudinary URL
  },

  videoUrl: {
    type: String,
    required: true, // Video Cloudinary URL
  },

  queryUrl: {
    type: String,
  },
  
  duration: {
    type: String, // example: "15:32"
    default: "",
  },

  category: {
    enum: ["CV_BUILDING", "INTERVIEW_PREP"],
    type: String,
    required: true,
  },


}, { timestamps: true });

export default mongoose.model("VideoLecture", videoLectureSchema);
