import express from "express";
import { registerIntern, internLogin, checkAuth, registerMentor, loginMentor, registerHiringTeam, loginHiring, registerAdmin, loginAdmin, 
    forgotPasswordAdmin, forgotPasswordHiring, forgotPasswordIntern, forgotPasswordMentor,
    verifyOTPController, resendOTPController, resetPasswordController
} from "../controller/AuthController.js";
import { authMiddleware, allowRoles } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/upload.js"


const router = express.Router();

router.post("/register/intern", upload.single("profileImage"),  registerIntern);
router.post("/login/intern", internLogin);



router.post('/forgot-password/intern', forgotPasswordIntern);
router.post('/forgot-password/mentor', forgotPasswordMentor);
router.post('/forgot-password/hiring', forgotPasswordHiring);
router.post('/forgot-password/admin', forgotPasswordAdmin);

// OTP Verification
router.post('/verify-otp', verifyOTPController);
router.post('/resend-otp', resendOTPController);

// Reset Password
router.post('/reset-password', resetPasswordController);




router.post("/mentor/register", upload.single("profileImage"), registerMentor);
router.post("/login/mentor", loginMentor);


router.post("/hiring-team/register", upload.single("profileImage"), registerHiringTeam);
router.post("/login/hiring-team", loginHiring);

router.post("/admin/register",  registerAdmin);
router.post("/login/admin", loginAdmin);


router.get("/check-auth/intern", authMiddleware, allowRoles("intern"), checkAuth);
router.get("/check-auth/mentor", authMiddleware, allowRoles("mentor"), checkAuth);
router.get("/check-auth/hiring", authMiddleware, allowRoles("HiringTeam"), checkAuth);
router.get("/check-auth/admin", authMiddleware, allowRoles("admin"), checkAuth);


export default router;