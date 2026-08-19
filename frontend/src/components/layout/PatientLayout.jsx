import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import PatientSidebar from "./PatientSidebar";
import PatientNavbar from "./PatientNavbar";
import Footer from "./Footer";

const titles = {
  "/patient/dashboard": "Overview",
  "/patient/appointments": "My Appointments",
  "/patient/prescriptions": "My Prescriptions",
  "/patient/billing": "My Billing",
  "/patient/profile": "My Profile",
  "/patient/settings": "Settings",
};

export default function PatientLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const pageTitle = titles[location.pathname] || "Patient Portal";

  return (
    <div className="flex min-h-screen bg-ink-50">
      <PatientSidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <div className="flex-1 flex flex-col min-w-0">
        <PatientNavbar setMobileOpen={setMobileOpen} pageTitle={pageTitle} />
        <main className="flex-1 p-4 lg:p-6">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}
