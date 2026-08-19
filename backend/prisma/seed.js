import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  const password = await bcrypt.hash("password123", 12);

  // ── Departments ──
  const cardiology = await prisma.department.create({ data: { name: "Cardiology" } });
  const pediatrics = await prisma.department.create({ data: { name: "Pediatrics" } });

  // ── Admin ──
  await prisma.user.create({
    data: {
      name: "Dr. Ayesha Raza",
      email: "admin@medicare.hospital",
      passwordHash: password,
      role: "ADMIN",
      phone: "+92 300 9998877",
    },
  });

  // ── Doctor ──
  const doctorUser = await prisma.user.create({
    data: {
      name: "Dr. Farhan Iqbal",
      email: "doctor@medicare.hospital",
      passwordHash: password,
      role: "DOCTOR",
      phone: "+92 321 1112233",
    },
  });
  const doctor = await prisma.doctor.create({
    data: {
      userId: doctorUser.id,
      specialization: "Cardiologist",
      experienceYears: 14,
      departmentId: cardiology.id,
      availability: "Mon–Fri, 9am–3pm",
      rating: 4.9,
      status: "AVAILABLE",
    },
  });
  await prisma.department.update({ where: { id: cardiology.id }, data: { headDoctorId: doctor.id } });

  // ── Patient ──
  const patientUser = await prisma.user.create({
    data: {
      name: "Ali Hassan",
      email: "patient@medicare.hospital",
      passwordHash: password,
      role: "PATIENT",
      phone: "+92 300 1234567",
    },
  });
  const patient = await prisma.patient.create({
    data: {
      userId: patientUser.id,
      age: 34,
      gender: "MALE",
      bloodGroup: "O+",
      address: "House 12, Gulberg III, Lahore",
      departmentId: cardiology.id,
      status: "ADMITTED",
    },
  });

  // ── Appointment ──
  const appointment = await prisma.appointment.create({
    data: {
      patientId: patient.id,
      doctorId: doctor.id,
      apptDate: new Date("2026-08-05"),
      apptTime: "09:30 AM",
      status: "CONFIRMED",
    },
  });

  // ── Prescription ──
  await prisma.prescription.create({
    data: {
      appointmentId: appointment.id,
      patientId: patient.id,
      doctorId: doctor.id,
      diagnosis: "Hypertension, Stage 1",
      instructions: "Low-sodium diet. Monitor blood pressure twice daily. Follow up in 4 weeks.",
      medicines: {
        create: [
          { name: "Amlodipine", dosage: "5mg, once daily", duration: "30 days" },
          { name: "Atorvastatin", dosage: "10mg, at night", duration: "30 days" },
        ],
      },
    },
  });

  // ── Billing ──
  await prisma.billing.create({
    data: {
      patientId: patient.id,
      appointmentId: appointment.id,
      amount: 12500,
      status: "PAID",
    },
  });

  console.log("Seed complete. Demo accounts (all use password: password123):");
  console.log("  Admin:   admin@medicare.hospital");
  console.log("  Doctor:  doctor@medicare.hospital");
  console.log("  Patient: patient@medicare.hospital");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
