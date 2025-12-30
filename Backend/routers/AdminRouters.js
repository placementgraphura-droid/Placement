import express from "express";
import { getAllInterns, updateInternStatus, getAllClasses, createClass, updateClass, 
    deleteClass,
    uploadStudyMaterial,
    getAllStudyMaterials,
    updateStudyMaterial,
    deleteStudyMaterial,

    updateVideoLecture,
    getAllVideos,
    deleteVideoLecture,
    uploadVideoLecture,

    getAllJobsAdmin,
    getJobById,
    deleteJobAdmin,
    exportApplicants,
    exportAllJobData,


    getAllInternsWithPayments,
    exportAllPayments,

    getAllMentors,
    toggleMentorActiveStatus,
    exportMentors,
    getAllHiringTeam,
    toggleHiringTeamStatus,
    exportHiringTeam,

    getAdminStats,
    getWeeklyJobs,
    getMonthlyPurchasedInternGrowth,
    getMonthlyRevenue,
    getPlansPurchasedStats,
    getMentorsAndHRs


} from "../controller/AdminController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/upload.js";

const router = express.Router();

// Route to get all interns with filtering options
router.get("/admin/interns", authMiddleware, getAllInterns);
// Route to update intern active status
router.patch("/admin/interns/:id/status", authMiddleware, updateInternStatus);

router.get("/admin/classes", authMiddleware, getAllClasses);
router.post("/admin/classes", authMiddleware, upload.single('thumbnail'), createClass);
router.put("/admin/classes/:id", authMiddleware, upload.single('thumbnail'), updateClass);
router.delete("/admin/classes/:id", authMiddleware, deleteClass);


router.post("/admin/study-materials/upload", authMiddleware, upload.single('file'), uploadStudyMaterial);
router.get("/admin/study-materials", authMiddleware, getAllStudyMaterials);
router.put("/admin/study-materials/:id", authMiddleware, upload.single('file'), updateStudyMaterial);
router.delete("/admin/study-materials/:id", authMiddleware, deleteStudyMaterial);


router.post("/admin/videos/upload", authMiddleware, upload.fields([{ name: "video", maxCount: 1 },{ name: "thumbnail", maxCount: 1 },]), uploadVideoLecture);
router.get("/admin/videos", authMiddleware, getAllVideos);
router.put("/admin/videos/:id", authMiddleware,  upload.fields([{ name: "video", maxCount: 1 },{ name: "thumbnail", maxCount: 1 },]), updateVideoLecture);
router.delete("/admin/videos/:id", authMiddleware, deleteVideoLecture);



router.get("/admin/jobs", authMiddleware, getAllJobsAdmin);
router.get("/admin/jobs/:id", authMiddleware, getJobById);
router.delete("/admin/jobs/:jobId", authMiddleware, deleteJobAdmin);
router.get("/admin/jobs/:jobId/export-applicants", authMiddleware, exportApplicants);
router.get("/admin/jobs/:jobId/export-all", authMiddleware, exportAllJobData);



router.get("/admin/interns/payments", authMiddleware, getAllInternsWithPayments);
router.get("/admin/payments/export-all", authMiddleware, exportAllPayments);


router.get("/admin/mentors", authMiddleware, getAllMentors);
router.patch("/admin/mentors/:id/toggle-active", authMiddleware, toggleMentorActiveStatus);
router.get("/admin/mentors/export", authMiddleware, exportMentors);

router.get("/admin/hr-members", authMiddleware, getAllHiringTeam);
router.patch("/admin/hr-members/:id/toggle-active", authMiddleware, toggleHiringTeamStatus);
router.get("/admin/hr-members/export", authMiddleware, exportHiringTeam);


router.get("/admin/stats", authMiddleware, getAdminStats);
router.get("/admin/jobs-weekly", authMiddleware, getWeeklyJobs);
router.get("/admin/purchases/monthly", authMiddleware, getMonthlyPurchasedInternGrowth);
router.get("/admin/revenue-monthly", authMiddleware, getMonthlyRevenue);
router.get("/admin/plans", authMiddleware, getPlansPurchasedStats);
router.get("/admin/users-list", authMiddleware, getMentorsAndHRs);

export default router;