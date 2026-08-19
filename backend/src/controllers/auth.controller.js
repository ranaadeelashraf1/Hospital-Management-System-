import bcrypt from "bcryptjs";
import { prisma } from "../config/db.js";
import { signToken } from "../utils/jwt.js";
import { asyncHandler, ApiError } from "../utils/asyncHandler.js";
import crypto from "node:crypto";
import { appUrl, isEmailConfigured, sendEmail } from "../utils/mailer.js";

const publicUser = (user) => ({ id: user.id, name: user.name, email: user.email, role: user.role });

// POST /api/auth/register
export const register = asyncHandler(async (req, res) => {
  const { name, email, password, phone, age, gender } = req.body;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new ApiError(409, "An account with this email already exists.");

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await prisma.$transaction(async (tx) => {
    const createdUser = await tx.user.create({
      data: { name, email, passwordHash, phone, role: "PATIENT" },
    });

    await tx.patient.create({
      data: {
        userId: createdUser.id,
        age: age ?? 0,
        gender: gender ?? "OTHER",
      },
    });

    return createdUser;
  });

  const token = signToken({ id: user.id, role: user.role });

  await sendEmail({
    to: user.email,
    subject: "Welcome to MediCare",
    html: `<p>Hi ${user.name},</p><p>Your MediCare account has been created successfully. You can now sign in and use your portal.</p>`,
  }).catch((error) => console.error("Welcome email failed:", error.message));

  res.status(201).json({
    success: true,
    message: "Account created successfully.",
    data: { token, user: publicUser(user) },
  });
});

// POST /api/auth/admin/users (ADMIN only)
export const createManagedUser = asyncHandler(async (req, res) => {
  const { name, email, password, phone, role, specialization, experienceYears } = req.body;
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new ApiError(409, "An account with this email already exists.");

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await prisma.$transaction(async (tx) => {
    const createdUser = await tx.user.create({
      data: { name, email, passwordHash, phone, role },
    });

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

  res.status(201).json({
    success: true,
    message: `${role} account created successfully by admin.`,
    data: { user: publicUser(user) },
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
    data: { token, user: publicUser(user) },
  });
});

// POST /api/auth/forgot-password
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });

  if (user) {
    const rawToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
    await prisma.passwordResetToken.deleteMany({ where: { userId: user.id } });
    await prisma.passwordResetToken.create({
      data: { userId: user.id, tokenHash, expiresAt: new Date(Date.now() + 60 * 60 * 1000) },
    });

    const resetUrl = appUrl(`/reset-password?token=${rawToken}`);
    if (!isEmailConfigured()) {
      console.error("Password reset requested but SMTP email delivery is not configured.");
    } else {
      await sendEmail({
        to: user.email,
        subject: "Reset your MediCare password",
        html: `<p>Hi ${user.name},</p><p>Reset your password within one hour:</p><p><a href="${resetUrl}">${resetUrl}</a></p><p>If you did not request this, you can ignore this email.</p>`,
      }).catch((error) => console.error("Password reset email failed:", error.message));
    }
  }

  res.json({ success: true, message: "If an account exists for this email, a reset link has been sent." });
});

// POST /api/auth/reset-password
export const resetPassword = asyncHandler(async (req, res) => {
  const { token, password } = req.body;
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
  const resetToken = await prisma.passwordResetToken.findUnique({ where: { tokenHash } });
  if (!resetToken || resetToken.expiresAt < new Date()) throw new ApiError(400, "This reset link is invalid or expired.");

  await prisma.$transaction([
    prisma.user.update({ where: { id: resetToken.userId }, data: { passwordHash: await bcrypt.hash(password, 12) } }),
    prisma.passwordResetToken.delete({ where: { id: resetToken.id } }),
  ]);

  res.json({ success: true, message: "Password reset successfully. You can now sign in." });
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
