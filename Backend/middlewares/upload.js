import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudynari.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {

    const mime = file.mimetype;

    let folder = "others";
    let resource_type = "image";

    if (mime.startsWith("image/")) {
      folder = "images";
      resource_type = "image";
    } 
    else if (mime === "application/pdf") {
      folder = "study-materials";
      resource_type = "raw";
    } 
    else if (mime.startsWith("video/")) {
      folder = "videos";
      resource_type = "video";
    }

    const fileName = file.originalname
      .replace(/\s+/g, "-")
      .replace(/[^a-zA-Z0-9-_]/g, "")
      .split(".")
      .slice(0, -1)
      .join("");

    return {
      folder,
      resource_type,
      public_id: `${Date.now()}-${fileName}`,
    };
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = [
    "application/pdf",
    "image/jpeg",
    "image/png",
    "image/jpg",
    "video/mp4",
    "video/mkv",
    "video/webm",
  ];

  allowed.includes(file.mimetype)
    ? cb(null, true)
    : cb(new Error("Only image, PDF & video files allowed"), false);
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024, // ✅ 100MB for videos
  },
});

export default upload;
