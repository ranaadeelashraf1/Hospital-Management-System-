import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import patientRoutes from "./routes/patient.routes.js";
import doctorRoutes from "./routes/doctor.routes.js";
import departmentRoutes from "./routes/department.routes.js";
import appointmentRoutes from "./routes/appointment.routes.js";
import prescriptionRoutes from "./routes/prescription.routes.js";
import billingRoutes from "./routes/billing.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";

const app = express();

app.use(
  cors({
    origin: (origin, callback) => {
      const configuredOrigin = process.env.CLIENT_URL || "http://localhost:5173";
      const isLocalDevOrigin = /^https?:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin || "");
      if (!origin || origin === configuredOrigin || (process.env.NODE_ENV !== "production" && isLocalDevOrigin)) {
        return callback(null, true);
      }
      return callback(new Error("Origin is not allowed by CORS."));
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "MediCare API is running.",
    databases: {
      database: "mongodb",
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
app.use("/api/notifications", notificationRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
