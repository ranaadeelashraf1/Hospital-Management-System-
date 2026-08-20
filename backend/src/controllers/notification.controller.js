import { prisma } from "../config/db.js";
import { verifyToken } from "../utils/jwt.js";
import { subscribeToNotifications } from "../utils/notifications.js";
import { asyncHandler, ApiError } from "../utils/asyncHandler.js";

export const getNotifications = asyncHandler(async (req, res) => {
  const notifications = await prisma.notification.findMany({
    where: { userId: req.user.id },
    orderBy: { createdAt: "desc" },
    take: 30,
  });
  res.json({ success: true, data: notifications });
});

export const markNotificationRead = asyncHandler(async (req, res) => {
  const notification = await prisma.notification.updateMany({
    where: { id: req.params.id, userId: req.user.id },
    data: { read: true },
  });
  if (notification.count === 0) throw new ApiError(404, "Notification not found.");
  res.json({ success: true, data: { id: req.params.id, read: true } });
});

export async function streamNotifications(req, res) {
  try {
    const token = req.query.token;
    if (!token) throw new ApiError(401, "Not authenticated.");
    const decoded = verifyToken(token);
    const user = await prisma.user.findUnique({ where: { id: decoded.id }, select: { id: true } });
    if (!user) throw new ApiError(401, "User no longer exists.");

    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    });
    res.write(`event: ready\ndata: ${JSON.stringify({ connected: true })}\n\n`);

    const unsubscribe = subscribeToNotifications(user.id, (notification) => {
      res.write(`data: ${JSON.stringify(notification)}\n\n`);
    });
    const heartbeat = setInterval(() => res.write(": heartbeat\n\n"), 25000);
    req.on("close", () => {
      clearInterval(heartbeat);
      unsubscribe();
      res.end();
    });
  } catch (error) {
    if (!res.headersSent) res.status(error.statusCode || 401).json({ success: false, message: error.message });
  }
}