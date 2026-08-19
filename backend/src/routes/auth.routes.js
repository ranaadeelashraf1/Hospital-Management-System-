import { Router } from "express";
import { register, login, getMe, forgotPassword, resetPassword } from "../controllers/auth.controller.js";
import { validate } from "../middleware/validate.js";
import { registerSchema, loginSchema, emailSchema, resetPasswordSchema } from "../utils/validators.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/forgot-password", validate(emailSchema), forgotPassword);
router.post("/reset-password", validate(resetPasswordSchema), resetPassword);
router.get("/me", protect, getMe);

export default router;
