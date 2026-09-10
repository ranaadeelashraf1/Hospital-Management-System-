import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  const password = await bcrypt.hash("password123", 12);

  // Keep the demo seed repeatable when the database already contains a partial run.
  await prisma.medicine.deleteMany();
  await prisma.prescription.deleteMany();
  await prisma.billing.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.patient.deleteMany();
  await prisma.doctor.deleteMany();
  await prisma.passwordResetToken.deleteMany();
  await prisma.user.deleteMany();
  await prisma.department.deleteMany();

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

  // ── Receptionist ──
  await prisma.user.create({
    data: {
      name: "MediCare Receptionist",
      email: "receptionist@medicare.hospital",
      passwordHash: password,
      role: "RECEPTIONIST",
      phone: "+92 300 9998878",
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
      availability: "Mon–Fri, 9am–3pm",
      rating: 4.9,
      status: "AVAILABLE",
    },
  });

  const additionalDoctors = [
    { name: "Dr. Sara Khan", email: "doctor2@medicare.hospital", specialization: "Neurologist", experienceYears: 8 },
    { name: "Dr. Hamza Ali", email: "doctor3@medicare.hospital", specialization: "Orthopedic Surgeon", experienceYears: 10 },
    { name: "Dr. Hina Malik", email: "doctor4@medicare.hospital", specialization: "Dermatologist", experienceYears: 7 },
    { name: "Dr. Usman Raza", email: "doctor5@medicare.hospital", specialization: "General Physician", experienceYears: 6 },
  ];
  const additionalDoctorRecords = [];

  for (const doctorData of additionalDoctors) {
    const user = await prisma.user.create({
      data: {
        name: doctorData.name,
        email: doctorData.email,
        passwordHash: password,
        role: "DOCTOR",
      },
    });
    const doctorRecord = await prisma.doctor.create({
      data: {
        userId: user.id,
        specialization: doctorData.specialization,
        experienceYears: doctorData.experienceYears,
        availability: "Mon–Fri, 9am–3pm",
        rating: 4.5,
        status: "AVAILABLE",
      },
    });
    additionalDoctorRecords.push(doctorRecord);
  }

  // MongoDB unique indexes allow only one null headDoctorId, so assign the first
  // department immediately and give each extra department a unique head doctor.
  const cardiology = await prisma.department.create({ data: { name: "Cardiology", headDoctorId: doctor.id } });
  const pediatrics = await prisma.department.create({ data: { name: "Pediatrics" } });
  const neurology = await prisma.department.create({ data: { name: "Neurology", headDoctorId: additionalDoctorRecords[0].id } });
  const orthopedics = await prisma.department.create({ data: { name: "Orthopedics", headDoctorId: additionalDoctorRecords[1].id } });
  const dermatology = await prisma.department.create({ data: { name: "Dermatology", headDoctorId: additionalDoctorRecords[2].id } });
  await prisma.doctor.update({ where: { id: doctor.id }, data: { departmentId: cardiology.id } });
  await prisma.doctor.update({ where: { id: additionalDoctorRecords[0].id }, data: { departmentId: neurology.id } });
  await prisma.doctor.update({ where: { id: additionalDoctorRecords[1].id }, data: { departmentId: orthopedics.id } });
  await prisma.doctor.update({ where: { id: additionalDoctorRecords[2].id }, data: { departmentId: dermatology.id } });
  await prisma.doctor.update({ where: { id: additionalDoctorRecords[3].id }, data: { departmentId: pediatrics.id } });

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
  console.log("  Receptionist: receptionist@medicare.hospital");
  console.log("  Doctor:  doctor@medicare.hospital");
  console.log("  Doctor2: doctor2@medicare.hospital");
  console.log("  Doctor3: doctor3@medicare.hospital");
  console.log("  Doctor4: doctor4@medicare.hospital");
  console.log("  Doctor5: doctor5@medicare.hospital");
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
