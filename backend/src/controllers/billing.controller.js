import { prisma } from "../config/db.js";
import { asyncHandler, ApiError } from "../utils/asyncHandler.js";
import { createNotification } from "../utils/notifications.js";
import { notifyAdmins } from "../utils/notifications.js";

const billingInclude = {
  patient: { include: { user: { select: { name: true } } } },
};

// GET /api/billing
// ADMIN     → all invoices
// PATIENT   → only their own
export const getBillings = asyncHandler(async (req, res) => {
  let where = {};

  if (req.user.role === "PATIENT") {
    const patient = await prisma.patient.findUnique({ where: { userId: req.user.id } });
    where = { patientId: patient.id };
  }

  const billings = await prisma.billing.findMany({
    where,
    include: billingInclude,
    orderBy: { invoiceDate: "desc" },
  });

  res.json({ success: true, data: billings });
});

// POST /api/billing  (ADMIN only)
export const createBilling = asyncHandler(async (req, res) => {
  const { patientId, appointmentId, amount, status } = req.body;

  const billing = await prisma.billing.create({
    data: { patientId, appointmentId, amount, status: status ?? "PENDING" },
    include: billingInclude,
  });

  const patient = await prisma.patient.findUnique({ where: { id: patientId }, select: { userId: true } });
  await createNotification({
    userId: patient.userId,
    type: "BILLING",
    title: "New invoice generated",
    detail: `A new invoice of ${amount} has been generated.`,
  });
  await notifyAdmins({
    type: "BILLING",
    title: "New invoice generated",
    detail: `A new invoice of ${amount} has been generated for a patient.`,
  });

  res.status(201).json({ success: true, message: "Invoice created.", data: billing });
});

// PUT /api/billing/:id  (ADMIN only) — e.g. mark as paid
export const updateBilling = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const billing = await prisma.billing.update({
    where: { id: req.params.id },
    data: { status },
    include: billingInclude,
  });
  const patient = await prisma.patient.findUnique({ where: { id: billing.patientId }, select: { userId: true } });
  await createNotification({
    userId: patient.userId,
    type: "BILLING",
    title: "Invoice status updated",
    detail: `Your invoice status is now ${status.toLowerCase()}.`,
  });
  await notifyAdmins({
    type: "BILLING",
    title: "Invoice status updated",
    detail: `An invoice status changed to ${status.toLowerCase()}.`,
  });
  res.json({ success: true, message: "Invoice updated.", data: billing });
});
