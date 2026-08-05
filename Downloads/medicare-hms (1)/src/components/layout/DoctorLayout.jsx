import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import DoctorSidebar from "./DoctorSidebar";
import DoctorNavbar from "./DoctorNavbar";
import Footer from "./Footer";

const titles = {
  "/doctor/dashboard": "Overview",
  "/doctor/patients": "My Patients",
  "/doctor/appointments": "My Appointments",
  "/doctor/prescriptions": "Prescriptions",
  "/doctor/profile": "My Profile",
  "/doctor/settings": "Settings",
};

export default function DoctorLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const pageTitle = titles[location.pathname] || "Doctor Portal";

  return (
    <div className="flex min-h-screen bg-ink-50">
      <DoctorSidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <div className="flex-1 flex flex-col min-w-0">
        <DoctorNavbar setMobileOpen={setMobileOpen} pageTitle={pageTitle} />
        <main className="flex-1 p-4 lg:p-6">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}
