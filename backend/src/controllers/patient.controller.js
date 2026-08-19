import bcrypt from "bcryptjs";
import { prisma } from "../config/db.js";
import { asyncHandler, ApiError } from "../utils/asyncHandler.js";

const patientInclude = {
  user: { select: { id: true, name: true, email: true, phone: true, avatarUrl: true } },
  department: { select: { id: true, name: true } },
};

// GET /api/patients  (ADMIN only) — full patient list
export const getAllPatients = asyncHandler(async (req, res) => {
  const { search, department, status, page = 1, limit = 10 } = req.query;

  const where = {
    AND: [
      search
        ? { user: { name: { contains: search, mode: "insensitive" } } }
        : {},
      department && department !== "All" ? { department: { name: department } } : {},
      status && status !== "All" ? { status } : {},
    ],
  };

  const [patients, total] = await Promise.all([
    prisma.patient.findMany({
      where,
      include: patientInclude,
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
      orderBy: { createdAt: "desc" },
    }),
    prisma.patient.count({ where }),
  ]);

  res.json({
    success: true,
    data: patients,
    meta: { total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total / limit) },
  });
});

// POST /api/patients  (ADMIN only) — admin adds a new patient (creates user + patient)
export const createPatient = asyncHandler(async (req, res) => {
  const { name, email, phone, age, gender, bloodGroup, address, departmentId } = req.body;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new ApiError(409, "A user with this email already exists.");

  // Temporary password — patient should reset it on first login in a real app
  const tempPassword = Math.random().toString(36).slice(-10);
  const passwordHash = await bcrypt.hash(tempPassword, 12);

  const patient = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: { name, email, phone, passwordHash, role: "PATIENT" },
    });
    return tx.patient.create({
      data: { userId: user.id, age, gender, bloodGroup, address, departmentId },
      include: patientInclude,
    });
  });

  res.status(201).json({
    success: true,
    message: "Patient added successfully.",
    data: { ...patient, temporaryPassword: tempPassword },
  });
});

// GET /api/patients/:id  (ADMIN, or the DOCTOR treating them, or the PATIENT themself)
export const getPatientById = asyncHandler(async (req, res) => {
  const patient = await prisma.patient.findUnique({
    where: { id: req.params.id },
    include: {
      ...patientInclude,
      appointments: { include: { doctor: { include: { user: true } } }, orderBy: { apptDate: "desc" } },
      prescriptions: { include: { medicines: true }, orderBy: { issuedDate: "desc" } },
      billings: { orderBy: { invoiceDate: "desc" } },
    },
  });

  if (!patient) throw new ApiError(404, "Patient not found.");

  // Access control: patients can only view themselves; doctors only patients they've treated
  if (req.user.role === "PATIENT" && patient.userId !== req.user.id) {
    throw new ApiError(403, "You can only view your own records.");
  }
  if (req.user.role === "DOCTOR") {
    const doctor = await prisma.doctor.findUnique({ where: { userId: req.user.id } });
    const treated = patient.appointments.some((a) => a.doctorId === doctor?.id);
    if (!treated) throw new ApiError(403, "You can only view patients under your care.");
  }

  res.json({ success: true, data: patient });
});

// PUT /api/patients/:id  (ADMIN, or the PATIENT themself)
export const updatePatient = asyncHandler(async (req, res) => {
  const patient = await prisma.patient.findUnique({ where: { id: req.params.id } });
  if (!patient) throw new ApiError(404, "Patient not found.");

  if (req.user.role === "PATIENT" && patient.userId !== req.user.id) {
    throw new ApiError(403, "You can only update your own profile.");
  }

  const { age, gender, bloodGroup, address, departmentId, status } = req.body;

  const updated = await prisma.patient.update({
    where: { id: req.params.id },
    data: { age, gender, bloodGroup, address, departmentId, status },
    include: patientInclude,
  });

  res.json({ success: true, message: "Patient updated successfully.", data: updated });
});

// DELETE /api/patients/:id  (ADMIN only)
export const deletePatient = asyncHandler(async (req, res) => {
  const patient = await prisma.patient.findUnique({ where: { id: req.params.id } });
  if (!patient) throw new ApiError(404, "Patient not found.");

  // Deleting the user cascades to the patient record (see schema onDelete: Cascade)
  await prisma.user.delete({ where: { id: patient.userId } });

  res.json({ success: true, message: "Patient removed successfully." });
});

// GET /api/patients/me  (PATIENT only) — the logged-in patient's own record
export const getMyPatientProfile = asyncHandler(async (req, res) => {
  const patient = await prisma.patient.findUnique({
    where: { userId: req.user.id },
    include: {
      ...patientInclude,
      appointments: { include: { doctor: { include: { user: true } } }, orderBy: { apptDate: "desc" } },
      prescriptions: { include: { medicines: true, doctor: { include: { user: true } } }, orderBy: { issuedDate: "desc" } },
      billings: { orderBy: { invoiceDate: "desc" } },
    },
  });

  if (!patient) throw new ApiError(404, "Patient profile not found.");
  res.json({ success: true, data: patient });
});

// GET /api/patients/mine  (DOCTOR only) — patients this doctor has treated
export const getMyTreatedPatients = asyncHandler(async (req, res) => {
  const doctor = await prisma.doctor.findUnique({ where: { userId: req.user.id } });
  if (!doctor) throw new ApiError(404, "Doctor profile not found.");

  const patients = await prisma.patient.findMany({
    where: { appointments: { some: { doctorId: doctor.id } } },
    include: patientInclude,
  });

  res.json({ success: true, data: patients });
});
