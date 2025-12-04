import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { getProfile, updateProfile, uploadProfileImage, createJobPost, getAllJobPosts, updateJob, getJobById, updateJobStatus } from "../controller/HiringController.js";
import upload from "../middlewares/upload.js";

const router = express.Router();

router.get("/hiring/profile", authMiddleware, getProfile);
router.put("/hiring/profile", authMiddleware, updateProfile);
router.post("/hiring/profile/upload-image", authMiddleware, upload.single("profileImage"), uploadProfileImage);


router.post("/hiring/jobs", authMiddleware, createJobPost);
router.get("/hiring/jobs", authMiddleware, getAllJobPosts);
router.put("/hiring/jobs/:id", authMiddleware, updateJob);
router.get("/hiring/jobs/:id", authMiddleware, getJobById);


router.patch("/hiring/jobs/:id/status", authMiddleware, updateJobStatus);


export default router;