import { Router } from "express";
import { getPrescriptions, createPrescription } from "../controllers/prescription.controller.js";
import { protect, authorize } from "../middleware/auth.js";

const router = Router();

router.use(protect);

router.get("/", getPrescriptions);
router.post("/", authorize("DOCTOR"), createPrescription);

export default router;
