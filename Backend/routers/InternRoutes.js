import express from "express"
import {
    getInternProfile,
    updateInternProfile,
    getInternClasses,


    getStudyMaterials,
    searchStudyMaterials,

    getVideoLectures ,
    getDashboardStats,
    
    getRecentFeedback,
    getRecentJobPosts,
    uploadProfileImage,

    getInternJobApplicationForm,
    applyForJob,
    getAppliedJobs,
    uploadResume,
    joinLiveClass


} from "../controller/InternController.js"
import { authMiddleware } from "../middlewares/authMiddleware.js"
import upload from "../middlewares/upload.js"


const router = express.Router()



router.get("/intern/profile", authMiddleware, getInternProfile)
router.get("/intern/classes", authMiddleware, getInternClasses)
router.put("/intern/profile", authMiddleware,  updateInternProfile)
router.post("/intern/upload-profile-image", authMiddleware, upload.single("image"), uploadProfileImage)
router.post("/intern/jobs/:jobId/apply", authMiddleware, applyForJob)
router.get("/intern/jobs/applied", authMiddleware, getAppliedJobs)
router.post("/intern/upload/resume", authMiddleware, upload.single("file"), uploadResume)

router.post("/intern/classes/:classId/join", authMiddleware, joinLiveClass)

router.get("/intern/study-materials", authMiddleware, getStudyMaterials)
router.get("/intern/study-materials/search", authMiddleware, searchStudyMaterials)

router.get("/intern/video-lectures", authMiddleware, getVideoLectures)


router.get("/intern/dashboard-stats", authMiddleware, getDashboardStats)
router.get("/intern/recent-feedback", authMiddleware, getRecentFeedback)
router.get("/intern/recent-job-posts", authMiddleware, getRecentJobPosts)

router.get("/intern/jobs/:jobId/application-form", authMiddleware, getInternJobApplicationForm)


export default router