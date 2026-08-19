import bcrypt from "bcryptjs";
import { prisma } from "../config/db.js";
import { signToken } from "../utils/jwt.js";
import { asyncHandler, ApiError } from "../utils/asyncHandler.js";

// POST /api/auth/register
export const register = asyncHandler(async (req, res) => {
  const { name, email, password, phone, role, age, gender, specialization, experienceYears } = req.body;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new ApiError(409, "An account with this email already exists.");

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await prisma.$transaction(async (tx) => {
    const createdUser = await tx.user.create({
      data: { name, email, passwordHash, phone, role },
    });

    if (role === "PATIENT") {
      await tx.patient.create({
        data: {
          userId: createdUser.id,
          age: age ?? 0,
          gender: gender ?? "OTHER",
        },
      });
    }

    if (role === "DOCTOR") {
      await tx.doctor.create({
        data: {
          userId: createdUser.id,
          specialization: specialization ?? "General Physician",
          experienceYears: experienceYears ?? 0,
        },
      });
    }

    return createdUser;
  });

  const token = signToken({ id: user.id, role: user.role });

  res.status(201).json({
    success: true,
    message: "Account created successfully.",
    data: { token, user: { id: user.id, name: user.name, email: user.email, role: user.role } },
  });
});

// POST /api/auth/login
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new ApiError(401, "Invalid email or password.");

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) throw new ApiError(401, "Invalid email or password.");

  const token = signToken({ id: user.id, role: user.role });

  res.json({
    success: true,
    message: "Logged in successfully.",
    data: { token, user: { id: user.id, name: user.name, email: user.email, role: user.role } },
  });
});

// GET /api/auth/me
export const getMe = asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      avatarUrl: true,
      patient: true,
      doctor: true,
    },
  });

  res.json({ success: true, data: user });
});
