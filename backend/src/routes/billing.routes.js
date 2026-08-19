import { Router } from "express";
import { getBillings, createBilling, updateBilling } from "../controllers/billing.controller.js";
import { protect, authorize } from "../middleware/auth.js";

const router = Router();

router.use(protect);

router.get("/", authorize("ADMIN", "PATIENT"), getBillings);
router.post("/", authorize("ADMIN"), createBilling);
router.put("/:id", authorize("ADMIN"), updateBilling);

export default router;
