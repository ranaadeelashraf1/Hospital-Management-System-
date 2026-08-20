import { prisma } from "../config/db.js";
import { asyncHandler, ApiError } from "../utils/asyncHandler.js";
import { notifyUsers } from "../utils/notifications.js";

const appointmentInclude = {
  patient: { include: { user: { select: { name: true, phone: true } } } },
  doctor: { include: { user: { select: { name: true } } } },
};

const SLOT_START_MINUTES = 9 * 60;
const SLOT_END_MINUTES = 17 * 60;
const SLOT_DURATION_MINUTES = 30;

function formatSlot(minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
}

function getSlots() {
  return Array.from(
    { length: (SLOT_END_MINUTES - SLOT_START_MINUTES) / SLOT_DURATION_MINUTES },
    (_, index) => formatSlot(SLOT_START_MINUTES + index * SLOT_DURATION_MINUTES)
  );
}

function isValidSlot(apptTime) {
  return getSlots().includes(apptTime);
}

async function getBookedTimes(doctorId, apptDate, excludeId) {
  const appointments = await prisma.appointment.findMany({
    where: {
      doctorId,
      apptDate: new Date(apptDate),
      status: { not: "CANCELLED" },
      ...(excludeId ? { id: { not: excludeId } } : {}),
    },
    select: { apptTime: true },
  });
  return new Set(appointments.map(({ apptTime }) => apptTime));
}

// GET /api/appointments/availability?doctorId=...&date=YYYY-MM-DD
export const getAppointmentAvailability = asyncHandler(async (req, res) => {
  const { doctorId, date } = req.query;
  if (!doctorId || !date) throw new ApiError(400, "Doctor and date are required.");

  const doctor = await prisma.doctor.findUnique({ where: { id: doctorId }, select: { id: true } });
  if (!doctor) throw new ApiError(404, "Doctor not found.");

  const bookedTimes = await getBookedTimes(doctorId, date);
  const slots = getSlots().map((time) => ({ time, available: !bookedTimes.has(time) }));
  res.json({ success: true, data: slots });
});

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

  const doctor = await prisma.doctor.findUnique({ where: { id: doctorId }, select: { id: true, userId: true } });
  if (!doctor) throw new ApiError(404, "Doctor not found.");
  const patient = await prisma.patient.findUnique({ where: { id: patientId }, select: { userId: true } });
  if (!patient) throw new ApiError(404, "Patient not found.");

  if (!isValidSlot(apptTime)) throw new ApiError(400, "Choose a valid 30-minute slot between 09:00 and 17:00.");
  const bookedTimes = await getBookedTimes(doctorId, apptDate);
  if (bookedTimes.has(apptTime)) throw new ApiError(409, "This doctor is already booked for that time slot.");

  const appointment = await prisma.appointment.create({
    data: { patientId, doctorId, apptDate: new Date(apptDate), apptTime, status: "PENDING" },
    include: appointmentInclude,
  });

  await notifyUsers([doctor.userId, patient.userId], {
    type: "APPOINTMENT",
    title: "New appointment request",
    detail: `${appointment.patient.user.name} requested an appointment for ${apptDate} at ${apptTime}.`,
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

  const appointmentUsers = await prisma.appointment.findUnique({
    where: { id: updated.id },
    include: { patient: { select: { userId: true } }, doctor: { select: { userId: true } } },
  });
  await notifyUsers([appointmentUsers.patient.userId, appointmentUsers.doctor.userId], {
    type: "APPOINTMENT",
    title: "Appointment status updated",
    detail: `Your appointment status is now ${status.toLowerCase()}.`,
  });

  res.json({ success: true, message: "Appointment status updated.", data: updated });
});

// PUT /api/appointments/:id/reschedule
export const rescheduleAppointment = asyncHandler(async (req, res) => {
  const { apptDate, apptTime } = req.body;
  const appointment = await prisma.appointment.findUnique({ where: { id: req.params.id } });
  if (!appointment) throw new ApiError(404, "Appointment not found.");

  if (!isValidSlot(apptTime)) throw new ApiError(400, "Choose a valid 30-minute slot between 09:00 and 17:00.");
  const bookedTimes = await getBookedTimes(appointment.doctorId, apptDate, appointment.id);
  if (bookedTimes.has(apptTime)) throw new ApiError(409, "This doctor is already booked for that time slot.");

  if (req.user.role === "PATIENT") {
    const patient = await prisma.patient.findUnique({ where: { userId: req.user.id } });
    if (appointment.patientId !== patient.id) throw new ApiError(403, "You can only reschedule your own appointments.");
  }

  const updated = await prisma.appointment.update({
    where: { id: req.params.id },
    data: { apptDate: new Date(apptDate), apptTime, status: "PENDING" },
    include: appointmentInclude,
  });

  const appointmentUsers = await prisma.appointment.findUnique({
    where: { id: updated.id },
    include: { patient: { select: { userId: true } }, doctor: { select: { userId: true } } },
  });
  await notifyUsers([appointmentUsers.patient.userId, appointmentUsers.doctor.userId], {
    type: "APPOINTMENT",
    title: "Appointment rescheduled",
    detail: `Your appointment moved to ${apptDate} at ${apptTime}.`,
  });

  res.json({ success: true, message: "Appointment rescheduled.", data: updated });
});
