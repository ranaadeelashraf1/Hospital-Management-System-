import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bell } from "lucide-react";
import toast from "react-hot-toast";
import { api, apiCall } from "../../api/client";

const apiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function formatTime(value) {
  const date = new Date(value);
  const seconds = Math.max(0, Math.floor((Date.now() - date.getTime()) / 1000));
  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hr ago`;
  return date.toLocaleDateString();
}

export default function NotificationBell() {
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const notificationRef = useRef(null);

  useEffect(() => {
    if (!notifOpen) return undefined;

    const closeOnOutsideClick = (event) => {
      if (!notificationRef.current?.contains(event.target)) setNotifOpen(false);
    };

    document.addEventListener("pointerdown", closeOnOutsideClick);
    return () => document.removeEventListener("pointerdown", closeOnOutsideClick);
  }, [notifOpen]);

  useEffect(() => {
    let active = true;
    const token = localStorage.getItem("medicare_token");
    if (!token) return undefined;

    apiCall(api.get("/notifications"))
      .then((data) => { if (active) setNotifications(data); })
      .catch(() => {});

    const stream = new EventSource(`${apiBaseUrl}/notifications/stream?token=${encodeURIComponent(token)}`);
    stream.onmessage = (event) => {
      const notification = JSON.parse(event.data);
      if (!active) return;
      setNotifications((current) => [notification, ...current.filter((item) => item.id !== notification.id)].slice(0, 30));
      toast(notification.title, { icon: "🔔", duration: 4500 });
    };
    stream.onerror = () => stream.close();

    return () => {
      active = false;
      stream.close();
    };
  }, []);

  const unreadCount = notifications.filter((notification) => !notification.read).length;

  const markRead = async (notification) => {
    if (notification.read) return;
    setNotifications((current) => current.map((item) => item.id === notification.id ? { ...item, read: true } : item));
    try {
      await apiCall(api.put(`/notifications/${notification.id}/read`));
    } catch {
      setNotifications((current) => current.map((item) => item.id === notification.id ? { ...item, read: false } : item));
    }
  };

  return (
    <div ref={notificationRef} className="relative">
      <button
        onClick={() => setNotifOpen((value) => !value)}
        className="relative p-2.5 rounded-xl text-ink-500 hover:bg-ink-100 transition-colors"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-danger-500 ring-2 ring-white" />}
      </button>
      <AnimatePresence>
        {notifOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-lifted border border-ink-100 overflow-hidden"
          >
            <div className="px-4 py-3 border-b border-ink-100 flex items-center justify-between">
              <p className="font-semibold text-sm text-ink-800">Notifications</p>
              <span className="text-xs text-primary-600 font-medium">{unreadCount} new</span>
            </div>
            <div className="max-h-80 overflow-y-auto scrollbar-thin">
              {notifications.length === 0 && <p className="px-4 py-8 text-center text-sm text-ink-400">No notifications yet</p>}
              {notifications.map((notification) => (
                <button
                  key={notification.id}
                  onClick={() => markRead(notification)}
                  className="w-full text-left px-4 py-3 border-b border-ink-50 last:border-0 hover:bg-ink-50 transition-colors"
                >
                  <div className="flex items-start gap-2">
                    {!notification.read && <span className="w-1.5 h-1.5 rounded-full bg-primary-600 mt-1.5 shrink-0" />}
                    <div className={notification.read ? "pl-3.5" : ""}>
                      <p className="text-sm font-medium text-ink-800">{notification.title}</p>
                      <p className="text-xs text-ink-500 mt-0.5">{notification.detail}</p>
                      <p className="text-[11px] text-ink-400 mt-1">{formatTime(notification.createdAt)}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}