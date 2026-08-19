import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import Footer from "./Footer";

const titles = {
  "/dashboard": "Dashboard",
  "/patients": "Patients",
  "/doctors": "Doctors",
  "/departments": "Departments",
  "/appointments": "Appointments",
  "/prescriptions": "Prescriptions",
  "/billing": "Billing",
  "/reports": "Reports",
  "/profile": "My Profile",
  "/settings": "Settings",
};

export default function MainLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const pageTitle = titles[location.pathname] || "MediCare";

  return (
    <div className="flex min-h-screen bg-ink-50">
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar setMobileOpen={setMobileOpen} pageTitle={pageTitle} />
        <main className="flex-1 p-4 lg:p-6">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}
