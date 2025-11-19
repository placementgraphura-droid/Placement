import express from "express";
import { registerIntern, internLogin, checkAuth } from "../controller/AuthController.js";
import { authMiddleware, allowRoles } from "../middlewares/authMiddleware.js";


const router = express.Router();

router.post("/register/intern", registerIntern);
router.post("/login/intern", internLogin);
router.get("/check-auth", authMiddleware, allowRoles("intern"), checkAuth);

export default router;