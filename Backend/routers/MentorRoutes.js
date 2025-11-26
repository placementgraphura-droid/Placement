import express from "express"
import { getMentorProfile, updateMentorProfile, uploadProfileImage, getMentorStudyMaterials, deleteStudyMaterial, uploadStudyMaterial } from "../controller/MentorController.js"
import { authMiddleware } from "../middlewares/authMiddleware.js"
import  upload  from "../middlewares/upload.js"


const router = express.Router()


router.get("/mentors/profile", authMiddleware, getMentorProfile)
router.put("/mentors/profile", authMiddleware, updateMentorProfile)
router.post("/upload/profile-image", authMiddleware, upload.single("profileImage"), uploadProfileImage)


router.get("/mentor/study-materials", authMiddleware, getMentorStudyMaterials)
router.post("/mentor/study-materials/upload", authMiddleware, upload.single("file") ,uploadStudyMaterial)
router.delete("/mentor/study-materials/:id", authMiddleware, deleteStudyMaterial)





export default router