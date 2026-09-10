import { Router } from "express";
import { register, login, getMe, updateMe, forgotPassword, resetPassword, createManagedUser, verifyEmail, resendVerification } from "../controllers/auth.controller.js";
import { validate } from "../middleware/validate.js";
import { registerSchema, adminCreateUserSchema, loginSchema, updateProfileSchema, emailSchema, resetPasswordSchema } from "../utils/validators.js";
import { protect, authorize } from "../middleware/auth.js";

const router = Router();

router.post("/register", validate(registerSchema), register);
router.post("/admin/users", protect, authorize("ADMIN"), validate(adminCreateUserSchema), createManagedUser);
router.post("/login", validate(loginSchema), login);
router.get("/verify-email", verifyEmail);
router.post("/resend-verification", validate(emailSchema), resendVerification);
router.post("/forgot-password", validate(emailSchema), forgotPassword);
router.post("/reset-password", validate(resetPasswordSchema), resetPassword);
router.get("/me", protect, getMe);
router.put("/me", protect, validate(updateProfileSchema), updateMe);

export default router;
