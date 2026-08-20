import { Router } from "express";
import { getNotifications, markNotificationRead, streamNotifications } from "../controllers/notification.controller.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.get("/stream", streamNotifications);
router.use(protect);
router.get("/", getNotifications);
router.put("/:id/read", markNotificationRead);

export default router;