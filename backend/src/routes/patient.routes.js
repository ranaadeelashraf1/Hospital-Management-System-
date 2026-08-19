import { Router } from "express";
import {
  getAllPatients,
  createPatient,
  getPatientById,
  updatePatient,
  deletePatient,
  getMyPatientProfile,
  getMyTreatedPatients,
} from "../controllers/patient.controller.js";
import { protect, authorize } from "../middleware/auth.js";

const router = Router();

router.use(protect); // every route below requires a valid JWT

router.get("/me", authorize("PATIENT"), getMyPatientProfile);
router.get("/mine", authorize("DOCTOR"), getMyTreatedPatients);

router.get("/", authorize("ADMIN", "RECEPTIONIST"), getAllPatients);
router.post("/", authorize("ADMIN", "RECEPTIONIST"), createPatient);

router.get("/:id", authorize("ADMIN", "DOCTOR", "PATIENT", "RECEPTIONIST"), getPatientById);
router.put("/:id", authorize("ADMIN", "PATIENT"), updatePatient);
router.delete("/:id", authorize("ADMIN"), deletePatient);

export default router;
