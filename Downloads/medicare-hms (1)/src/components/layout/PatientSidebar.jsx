import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, CalendarDays, ClipboardList, Receipt, UserCircle, Settings, LogOut, X,
} from "lucide-react";
import Logo from "../ui/Logo";

const menu = [
  { to: "/patient/dashboard", label: "Overview", icon: LayoutDashboard },
  { to: "/patient/appointments", label: "My Appointments", icon: CalendarDays },
  { to: "/patient/prescriptions", label: "My Prescriptions", icon: ClipboardList },
  { to: "/patient/billing", label: "My Billing", icon: Receipt },
  { to: "/patient/profile", label: "My Profile", icon: UserCircle },
  { to: "/patient/settings", label: "Settings", icon: Settings },
];

export default function PatientSidebar({ mobileOpen, setMobileOpen }) {
  const navigate = useNavigate();

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-ink-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed lg:sticky top-0 h-screen z-50 w-64 bg-white border-r border-ink-100 flex flex-col transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex items-center justify-between px-5 py-5 border-b border-ink-100">
          <Logo />
          <button onClick={() => setMobileOpen(false)} className="lg:hidden p-1.5 rounded-lg text-ink-400 hover:bg-ink-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-5 pt-4">
          <span className="inline-block px-2.5 py-1 rounded-full bg-accent-100 text-accent-700 text-[11px] font-medium tracking-wide">
            PATIENT PORTAL
          </span>
        </div>

        <nav className="flex-1 overflow-y-auto scrollbar-thin px-3 py-4 space-y-1">
          {menu.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                  isActive ? "bg-primary-50 text-primary-700" : "text-ink-500 hover:bg-ink-50 hover:text-ink-800"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-full bg-primary-600" />}
                  <item.icon className={`w-[18px] h-[18px] shrink-0 ${isActive ? "text-primary-600" : ""}`} />
                  <span>{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-ink-100">
          <button
            onClick={() => navigate("/login")}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-danger-500 hover:bg-danger-100/60 transition-colors"
          >
            <LogOut className="w-[18px] h-[18px] shrink-0" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
