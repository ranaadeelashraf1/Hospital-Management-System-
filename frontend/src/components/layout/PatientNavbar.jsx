import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, ChevronDown, LogOut, UserCircle, Settings } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import NotificationBell from "../ui/NotificationBell";

export default function PatientNavbar({ setMobileOpen, pageTitle }) {
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const initials = user?.name?.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() || "PT";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

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
          <NotificationBell />

          <div className="relative">
            <button
              onClick={() => setProfileOpen((v) => !v)}
              className="flex items-center gap-2 pl-1.5 pr-2.5 py-1.5 rounded-xl hover:bg-ink-100 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-xs font-semibold">
                {initials}
              </div>
              <div className="hidden sm:block text-left leading-tight">
                <p className="text-sm font-medium text-ink-800">{user?.name}</p>
                <p className="text-[11px] text-ink-400">Patient</p>
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
                  <button onClick={handleLogout} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-danger-500 hover:bg-danger-100/60">
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
