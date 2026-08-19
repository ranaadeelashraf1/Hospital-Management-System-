import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.routes.js";
import patientRoutes from "./routes/patient.routes.js";
import doctorRoutes from "./routes/doctor.routes.js";
import departmentRoutes from "./routes/department.routes.js";
import appointmentRoutes from "./routes/appointment.routes.js";
import prescriptionRoutes from "./routes/prescription.routes.js";
import billingRoutes from "./routes/billing.routes.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/health", (req, res) => {
  const mongoStatus = mongoose.connection.readyState === 1 ? "connected" : "not_connected";

  res.json({
    success: true,
    message: "MediCare API is running.",
    databases: {
      postgres: "configured",
      mongo: mongoStatus,
    },
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/prescriptions", prescriptionRoutes);
app.use("/api/billing", billingRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
