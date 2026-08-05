import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, Bell, ChevronDown, LogOut, UserCircle, Settings } from "lucide-react";
import { currentPatient } from "../../data/mockData";

const patientNotifications = [
  { id: 1, title: "Appointment confirmed", detail: "Your visit with Dr. Farhan Iqbal is confirmed for Aug 5", time: "10 min ago", unread: true },
  { id: 2, title: "New prescription available", detail: "Dr. Farhan Iqbal added a new prescription", time: "1 hr ago", unread: true },
  { id: 3, title: "Invoice generated", detail: "A new invoice of $12,500 has been generated", time: "1 day ago", unread: false },
];

export default function PatientNavbar({ setMobileOpen, pageTitle }) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();
  const unreadCount = patientNotifications.filter((n) => n.unread).length;

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-ink-100">
      <div className="flex items-center justify-between gap-4 px-4 lg:px-6 py-3.5">
        <div className="flex items-center gap-3 min-w-0">
          <button onClick={() => setMobileOpen(true)} className="lg:hidden p-2 rounded-lg text-ink-500 hover:bg-ink-100">
            <Menu className="w-5 h-5" />
          </button>
          <h1 className="font-display font-semibold text-lg text-ink-900 truncate">{pageTitle}</h1>
        </div>

        <div className="flex items-center gap-2 shrink-0 ml-auto">
          <div className="relative">
            <button
              onClick={() => { setNotifOpen((v) => !v); setProfileOpen(false); }}
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
                    {patientNotifications.map((n) => (
                      <div key={n.id} className="px-4 py-3 border-b border-ink-50 last:border-0 hover:bg-ink-50 transition-colors">
                        <div className="flex items-start gap-2">
                          {n.unread && <span className="w-1.5 h-1.5 rounded-full bg-primary-600 mt-1.5 shrink-0" />}
                          <div className={n.unread ? "" : "pl-3.5"}>
                            <p className="text-sm font-medium text-ink-800">{n.title}</p>
                            <p className="text-xs text-ink-500 mt-0.5">{n.detail}</p>
                            <p className="text-[11px] text-ink-400 mt-1">{n.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="relative">
            <button
              onClick={() => { setProfileOpen((v) => !v); setNotifOpen(false); }}
              className="flex items-center gap-2 pl-1.5 pr-2.5 py-1.5 rounded-xl hover:bg-ink-100 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-xs font-semibold">
                {currentPatient.avatar}
              </div>
              <div className="hidden sm:block text-left leading-tight">
                <p className="text-sm font-medium text-ink-800">{currentPatient.name}</p>
                <p className="text-[11px] text-ink-400">Patient · {currentPatient.id}</p>
              </div>
              <ChevronDown className="w-4 h-4 text-ink-400 hidden sm:block" />
            </button>
            <AnimatePresence>
              {profileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.97 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-lifted border border-ink-100 overflow-hidden py-1.5"
                >
                  <button onClick={() => { navigate("/patient/profile"); setProfileOpen(false); }} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-ink-600 hover:bg-ink-50">
                    <UserCircle className="w-4 h-4" /> My Profile
                  </button>
                  <button onClick={() => { navigate("/patient/settings"); setProfileOpen(false); }} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-ink-600 hover:bg-ink-50">
                    <Settings className="w-4 h-4" /> Settings
                  </button>
                  <div className="h-px bg-ink-100 my-1.5" />
                  <button onClick={() => navigate("/login")} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-danger-500 hover:bg-danger-100/60">
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}
