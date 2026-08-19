import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().optional(),
  role: z.enum(["PATIENT", "DOCTOR", "RECEPTIONIST"]).default("PATIENT"),
  // Patient-specific (required if role === PATIENT)
  age: z.number().int().positive().optional(),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional(),
  // Doctor-specific (required if role === DOCTOR)
  specialization: z.string().optional(),
  experienceYears: z.number().int().nonnegative().optional(),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});
