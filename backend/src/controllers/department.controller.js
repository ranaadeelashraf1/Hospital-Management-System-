import { prisma } from "../config/db.js";
import { asyncHandler, ApiError } from "../utils/asyncHandler.js";

const departmentInclude = {
  headDoctor: { include: { user: { select: { name: true } } } },
  _count: { select: { doctors: true, patients: true } },
};

// GET /api/departments
export const getAllDepartments = asyncHandler(async (req, res) => {
  const departments = await prisma.department.findMany({ include: departmentInclude });
  res.json({ success: true, data: departments });
});

// POST /api/departments  (ADMIN only)
export const createDepartment = asyncHandler(async (req, res) => {
  const { name, headDoctorId } = req.body;
  const department = await prisma.department.create({
    data: { name, headDoctorId },
    include: departmentInclude,
  });
  res.status(201).json({ success: true, message: "Department created.", data: department });
});

// PUT /api/departments/:id  (ADMIN only)
export const updateDepartment = asyncHandler(async (req, res) => {
  const { name, headDoctorId } = req.body;
  const department = await prisma.department.update({
    where: { id: req.params.id },
    data: { name, headDoctorId },
    include: departmentInclude,
  });
  res.json({ success: true, message: "Department updated.", data: department });
});

// DELETE /api/departments/:id  (ADMIN only)
export const deleteDepartment = asyncHandler(async (req, res) => {
  await prisma.department.delete({ where: { id: req.params.id } });
  res.json({ success: true, message: "Department removed." });
});
