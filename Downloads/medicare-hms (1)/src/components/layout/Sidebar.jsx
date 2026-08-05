import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Users, Stethoscope, Building2, CalendarDays,
  ClipboardList, Receipt, BarChart3, UserCircle, Settings, LogOut,
  ChevronsLeft, X,
} from "lucide-react";
import Logo from "../ui/Logo";

const menu = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/patients", label: "Patients", icon: Users },
  { to: "/doctors", label: "Doctors", icon: Stethoscope },
  { to: "/departments", label: "Departments", icon: Building2 },
  { to: "/appointments", label: "Appointments", icon: CalendarDays },
  { to: "/prescriptions", label: "Prescriptions", icon: ClipboardList },
  { to: "/billing", label: "Billing", icon: Receipt },
  { to: "/reports", label: "Reports", icon: BarChart3 },
  { to: "/profile", label: "Profile", icon: UserCircle },
  { to: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar({ collapsed, setCollapsed, mobileOpen, setMobileOpen }) {
  const navigate = useNavigate();
  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-ink-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed lg:sticky top-0 h-screen z-50 bg-white border-r border-ink-100 flex flex-col transition-all duration-300 ${
          collapsed ? "lg:w-20" : "lg:w-64"
        } w-64 ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        <div className="flex items-center justify-between px-5 py-5 border-b border-ink-100">
          <Logo collapsed={collapsed} />
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-ink-400 hover:bg-ink-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto scrollbar-thin px-3 py-4 space-y-1">
          {menu.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? "bg-primary-50 text-primary-700"
                    : "text-ink-500 hover:bg-ink-50 hover:text-ink-800"
                }`
              }
              title={collapsed ? item.label : undefined}
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-full bg-primary-600" />
                  )}
                  <item.icon className={`w-[18px] h-[18px] shrink-0 ${isActive ? "text-primary-600" : ""}`} />
                  {!collapsed && <span>{item.label}</span>}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-ink-100 space-y-1">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-ink-500 hover:bg-ink-50 hover:text-ink-800 transition-colors"
          >
            <ChevronsLeft className={`w-[18px] h-[18px] transition-transform ${collapsed ? "rotate-180" : ""}`} />
            {!collapsed && "Collapse"}
          </button>
          <button
            onClick={() => navigate("/login")}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-danger-500 hover:bg-danger-100/60 transition-colors"
          >

            <LogOut className="w-[18px] h-[18px] shrink-0" />
            {!collapsed && "Logout"}
          </button>
        </div>
      </aside>
    </>
  );
}
