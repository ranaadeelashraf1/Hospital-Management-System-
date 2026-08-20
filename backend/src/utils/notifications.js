import { prisma } from "../config/db.js";

const subscribers = new Map();

export function subscribeToNotifications(userId, send) {
  const listeners = subscribers.get(userId) || new Set();
  listeners.add(send);
  subscribers.set(userId, listeners);

  return () => {
    listeners.delete(send);
    if (listeners.size === 0) subscribers.delete(userId);
  };
}

export async function createNotification({ userId, type, title, detail }) {
  const notification = await prisma.notification.create({
    data: { userId, type, title, detail },
  });
  const listeners = subscribers.get(userId) || [];
  listeners.forEach((send) => send(notification));
  return notification;
}

export async function notifyUsers(userIds, payload) {
  await Promise.all([...new Set(userIds.filter(Boolean))].map((userId) => createNotification({ userId, ...payload })));
}