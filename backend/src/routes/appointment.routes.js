import { Router } from "express";
import {
  getAppointments,
  createAppointment,
  updateAppointmentStatus,
  rescheduleAppointment,
} from "../controllers/appointment.controller.js";
import { protect, authorize } from "../middleware/auth.js";

const router = Router();

router.use(protect);

router.get("/", getAppointments); // scoped per role inside the controller
router.post("/", authorize("ADMIN", "RECEPTIONIST", "PATIENT"), createAppointment);
router.put("/:id/status", authorize("ADMIN", "DOCTOR", "PATIENT"), updateAppointmentStatus);
router.put("/:id/reschedule", authorize("ADMIN", "DOCTOR", "PATIENT"), rescheduleAppointment);

export default router;
