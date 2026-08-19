import { prisma } from "../config/db.js";
import { asyncHandler, ApiError } from "../utils/asyncHandler.js";

const doctorInclude = {
  user: { select: { id: true, name: true, email: true, phone: true, avatarUrl: true } },
  department: { select: { id: true, name: true } },
};

// GET /api/doctors  (public to any authenticated user — patients need this to book)
export const getAllDoctors = asyncHandler(async (req, res) => {
  const { search, specialization } = req.query;

  const doctors = await prisma.doctor.findMany({
    where: {
      AND: [
        search ? { user: { name: { contains: search, mode: "insensitive" } } } : {},
        specialization && specialization !== "All" ? { specialization } : {},
      ],
    },
    include: doctorInclude,
    orderBy: { rating: "desc" },
  });

  res.json({ success: true, data: doctors });
});

// GET /api/doctors/:id
export const getDoctorById = asyncHandler(async (req, res) => {
  const doctor = await prisma.doctor.findUnique({
    where: { id: req.params.id },
    include: doctorInclude,
  });
  if (!doctor) throw new ApiError(404, "Doctor not found.");
  res.json({ success: true, data: doctor });
});

// GET /api/doctors/me  (DOCTOR only)
export const getMyDoctorProfile = asyncHandler(async (req, res) => {
  const doctor = await prisma.doctor.findUnique({
    where: { userId: req.user.id },
    include: doctorInclude,
  });
  if (!doctor) throw new ApiError(404, "Doctor profile not found.");
  res.json({ success: true, data: doctor });
});

// PUT /api/doctors/:id  (ADMIN, or the doctor themself)
export const updateDoctor = asyncHandler(async (req, res) => {
  const doctor = await prisma.doctor.findUnique({ where: { id: req.params.id } });
  if (!doctor) throw new ApiError(404, "Doctor not found.");

  if (req.user.role === "DOCTOR" && doctor.userId !== req.user.id) {
    throw new ApiError(403, "You can only update your own profile.");
  }

  const { specialization, experienceYears, departmentId, availability, status } = req.body;

  const updated = await prisma.doctor.update({
    where: { id: req.params.id },
    data: { specialization, experienceYears, departmentId, availability, status },
    include: doctorInclude,
  });

  res.json({ success: true, message: "Doctor profile updated.", data: updated });
});

// DELETE /api/doctors/:id  (ADMIN only)
export const deleteDoctor = asyncHandler(async (req, res) => {
  const doctor = await prisma.doctor.findUnique({ where: { id: req.params.id } });
  if (!doctor) throw new ApiError(404, "Doctor not found.");
  await prisma.user.delete({ where: { id: doctor.userId } });
  res.json({ success: true, message: "Doctor removed successfully." });
});
