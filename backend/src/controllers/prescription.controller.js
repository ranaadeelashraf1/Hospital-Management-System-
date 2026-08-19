import { prisma } from "../config/db.js";
import { asyncHandler, ApiError } from "../utils/asyncHandler.js";

const prescriptionInclude = {
  patient: { include: { user: { select: { name: true } } } },
  doctor: { include: { user: { select: { name: true } } } },
  medicines: true,
};

// GET /api/prescriptions
// ADMIN     → all
// DOCTOR    → only ones they wrote
// PATIENT   → only their own
export const getPrescriptions = asyncHandler(async (req, res) => {
  let where = {};

  if (req.user.role === "DOCTOR") {
    const doctor = await prisma.doctor.findUnique({ where: { userId: req.user.id } });
    where = { doctorId: doctor.id };
  }

  if (req.user.role === "PATIENT") {
    const patient = await prisma.patient.findUnique({ where: { userId: req.user.id } });
    where = { patientId: patient.id };
  }

  const prescriptions = await prisma.prescription.findMany({
    where,
    include: prescriptionInclude,
    orderBy: { issuedDate: "desc" },
  });

  res.json({ success: true, data: prescriptions });
});

// POST /api/prescriptions  (DOCTOR only)
export const createPrescription = asyncHandler(async (req, res) => {
  const { appointmentId, diagnosis, instructions, medicines } = req.body;

  const doctor = await prisma.doctor.findUnique({ where: { userId: req.user.id } });
  if (!doctor) throw new ApiError(404, "Doctor profile not found.");

  const appointment = await prisma.appointment.findUnique({ where: { id: appointmentId } });
  if (!appointment) throw new ApiError(404, "Appointment not found.");
  if (appointment.doctorId !== doctor.id) {
    throw new ApiError(403, "You can only write prescriptions for your own appointments.");
  }

  const prescription = await prisma.prescription.create({
    data: {
      appointmentId,
      patientId: appointment.patientId,
      doctorId: doctor.id,
      diagnosis,
      instructions,
      medicines: {
        create: medicines.map((m) => ({ name: m.name, dosage: m.dosage, duration: m.duration })),
      },
    },
    include: prescriptionInclude,
  });

  res.status(201).json({ success: true, message: "Prescription issued.", data: prescription });
});
