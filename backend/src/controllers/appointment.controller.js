import { prisma } from "../config/db.js";
import { asyncHandler, ApiError } from "../utils/asyncHandler.js";

const appointmentInclude = {
  patient: { include: { user: { select: { name: true, phone: true } } } },
  doctor: { include: { user: { select: { name: true } } } },
};

// GET /api/appointments
// ADMIN/RECEPTIONIST → all appointments
// DOCTOR             → only their own
// PATIENT            → only their own
export const getAppointments = asyncHandler(async (req, res) => {
  let where = {};

  if (req.user.role === "DOCTOR") {
    const doctor = await prisma.doctor.findUnique({ where: { userId: req.user.id } });
    where = { doctorId: doctor.id };
  }

  if (req.user.role === "PATIENT") {
    const patient = await prisma.patient.findUnique({ where: { userId: req.user.id } });
    where = { patientId: patient.id };
  }

  const appointments = await prisma.appointment.findMany({
    where,
    include: appointmentInclude,
    orderBy: [{ apptDate: "desc" }, { apptTime: "asc" }],
  });

  res.json({ success: true, data: appointments });
});

// POST /api/appointments  (PATIENT books for self, ADMIN/RECEPTIONIST can book for anyone)
export const createAppointment = asyncHandler(async (req, res) => {
  let { patientId, doctorId, apptDate, apptTime } = req.body;

  if (req.user.role === "PATIENT") {
    const patient = await prisma.patient.findUnique({ where: { userId: req.user.id } });
    patientId = patient.id;
  }

  const doctor = await prisma.doctor.findUnique({ where: { id: doctorId } });
  if (!doctor) throw new ApiError(404, "Doctor not found.");

  const appointment = await prisma.appointment.create({
    data: { patientId, doctorId, apptDate: new Date(apptDate), apptTime, status: "PENDING" },
    include: appointmentInclude,
  });

  res.status(201).json({ success: true, message: "Appointment booked.", data: appointment });
});

// PUT /api/appointments/:id/status  (DOCTOR completes/cancels, ADMIN any, PATIENT can cancel own)
export const updateAppointmentStatus = asyncHandler(async (req, res) => {
  const { status } = req.body; // PENDING | CONFIRMED | COMPLETED | CANCELLED
  const appointment = await prisma.appointment.findUnique({ where: { id: req.params.id } });
  if (!appointment) throw new ApiError(404, "Appointment not found.");

  if (req.user.role === "PATIENT") {
    const patient = await prisma.patient.findUnique({ where: { userId: req.user.id } });
    if (appointment.patientId !== patient.id) throw new ApiError(403, "You can only manage your own appointments.");
    if (status !== "CANCELLED") throw new ApiError(403, "Patients can only cancel appointments.");
  }

  if (req.user.role === "DOCTOR") {
    const doctor = await prisma.doctor.findUnique({ where: { userId: req.user.id } });
    if (appointment.doctorId !== doctor.id) throw new ApiError(403, "You can only manage your own appointments.");
  }

  const updated = await prisma.appointment.update({
    where: { id: req.params.id },
    data: { status },
    include: appointmentInclude,
  });

  res.json({ success: true, message: "Appointment status updated.", data: updated });
});

// PUT /api/appointments/:id/reschedule
export const rescheduleAppointment = asyncHandler(async (req, res) => {
  const { apptDate, apptTime } = req.body;
  const appointment = await prisma.appointment.findUnique({ where: { id: req.params.id } });
  if (!appointment) throw new ApiError(404, "Appointment not found.");

  if (req.user.role === "PATIENT") {
    const patient = await prisma.patient.findUnique({ where: { userId: req.user.id } });
    if (appointment.patientId !== patient.id) throw new ApiError(403, "You can only reschedule your own appointments.");
  }

  const updated = await prisma.appointment.update({
    where: { id: req.params.id },
    data: { apptDate: new Date(apptDate), apptTime, status: "PENDING" },
    include: appointmentInclude,
  });

  res.json({ success: true, message: "Appointment rescheduled.", data: updated });
});
