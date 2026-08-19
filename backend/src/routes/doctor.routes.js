import { Router } from "express";
import {
  getAllDoctors,
  getDoctorById,
  getMyDoctorProfile,
  updateDoctor,
  deleteDoctor,
} from "../controllers/doctor.controller.js";
import { protect, authorize } from "../middleware/auth.js";

const router = Router();

router.use(protect);

router.get("/me", authorize("DOCTOR"), getMyDoctorProfile);
router.get("/", getAllDoctors); // any logged-in role can browse doctors (e.g. to book)
router.get("/:id", getDoctorById);
router.put("/:id", authorize("ADMIN", "DOCTOR"), updateDoctor);
router.delete("/:id", authorize("ADMIN"), deleteDoctor);

export default router;
