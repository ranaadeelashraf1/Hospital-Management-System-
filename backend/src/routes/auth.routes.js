import { Router } from "express";
import { register, login, getMe, forgotPassword, resetPassword, createManagedUser } from "../controllers/auth.controller.js";
import { validate } from "../middleware/validate.js";
import { registerSchema, adminCreateUserSchema, loginSchema, emailSchema, resetPasswordSchema } from "../utils/validators.js";
import { protect, authorize } from "../middleware/auth.js";

const router = Router();

router.post("/register", validate(registerSchema), register);
router.post("/admin/users", protect, authorize("ADMIN"), validate(adminCreateUserSchema), createManagedUser);
router.post("/login", validate(loginSchema), login);
router.post("/forgot-password", validate(emailSchema), forgotPassword);
router.post("/reset-password", validate(resetPasswordSchema), resetPassword);
router.get("/me", protect, getMe);

export default router;
