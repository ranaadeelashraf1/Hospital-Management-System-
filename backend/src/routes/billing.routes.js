import { Router } from "express";
import { getBillings, createBilling, updateBilling } from "../controllers/billing.controller.js";
import { protect, authorize } from "../middleware/auth.js";

const router = Router();

router.use(protect);

router.get("/", authorize("ADMIN", "RECEPTIONIST", "PATIENT"), getBillings);
router.post("/", authorize("ADMIN", "RECEPTIONIST"), createBilling);
router.put("/:id", authorize("ADMIN", "RECEPTIONIST"), updateBilling);

export default router;
