import { useNavigate } from "react-router-dom";
import { CalendarPlus, ClipboardList, Receipt, ArrowUpRight, HeartPulse, Stethoscope, Pill } from "lucide-react";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import { currentPatient, appointments, prescriptions, billing } from "../../data/mockData";

export default function PatientDashboard() {
  const navigate = useNavigate();

  const myAppointments = appointments.filter((a) => a.patient === currentPatient.name);
  const myPrescriptions = prescriptions.filter((r) => r.patient === currentPatient.name);
  const myBilling = billing.filter((b) => b.patient === currentPatient.name);
  const upcoming = myAppointments.find((a) => a.status === "Confirmed" || a.status === "Pending");
  const unpaid = myBilling.filter((b) => b.status !== "Paid").reduce((s, b) => s + b.amount, 0);

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <Card className="bg-gradient-to-br from-primary-600 via-primary-600 to-accent-600 text-white border-0 overflow-hidden relative">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: "radial-gradient(circle at 2px 2px, white 1.5px, transparent 0)",
          backgroundSize: "24px 24px",
        }} />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-display font-bold">Welcome back, {currentPatient.name.split(" ")[0]} 👋</h2>
            <p className="text-primary-100 text-sm mt-1">
              Patient ID <span className="font-mono-num">{currentPatient.id}</span> · {currentPatient.department}
            </p>
          </div>
          <Button variant="secondary" icon={CalendarPlus} onClick={() => navigate("/patient/appointments")} className="!bg-white !text-primary-700 shrink-0">
            Book Appointment
          </Button>
        </div>
      </Card>

      {/* Quick stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card hover>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-primary-100 flex items-center justify-center shrink-0">
              <CalendarPlus className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <p className="text-xs text-ink-500">Upcoming Appointment</p>
              <p className="text-sm font-semibold text-ink-900 mt-0.5">{upcoming ? `${upcoming.date} · ${upcoming.time}` : "None scheduled"}</p>
            </div>
          </div>
        </Card>
        <Card hover>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-accent-100 flex items-center justify-center shrink-0">
              <Pill className="w-5 h-5 text-accent-600" />
            </div>
            <div>
              <p className="text-xs text-ink-500">Active Prescriptions</p>
              <p className="text-sm font-semibold text-ink-900 mt-0.5">{myPrescriptions.length} prescriptions</p>
            </div>
          </div>
        </Card>
        <Card hover>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-warning-100 flex items-center justify-center shrink-0">
              <Receipt className="w-5 h-5 text-warning-500" />
            </div>
            <div>
              <p className="text-xs text-ink-500">Outstanding Balance</p>
              <p className="text-sm font-semibold text-ink-900 mt-0.5 font-mono-num">${unpaid.toLocaleString()}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Vitals-style profile card + upcoming appointments */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-display font-semibold text-lg">
              {currentPatient.avatar}
            </div>
            <div>
              <p className="font-display font-semibold text-ink-900">{currentPatient.name}</p>
              <Badge status={currentPatient.status} className="mt-1" />
            </div>
          </div>
          <div className="space-y-2 text-sm border-t border-ink-100 pt-3">
            <div className="flex justify-between"><span className="text-ink-400">Age / Gender</span><span className="text-ink-800 font-medium">{currentPatient.age} / {currentPatient.gender}</span></div>
            <div className="flex justify-between"><span className="text-ink-400">Blood Group</span><span className="text-ink-800 font-medium">{currentPatient.bloodGroup}</span></div>
            <div className="flex justify-between"><span className="text-ink-400">Department</span><span className="text-ink-800 font-medium">{currentPatient.department}</span></div>
          </div>
        </Card>

        <Card className="lg:col-span-2" padded={false}>
          <div className="flex items-center justify-between px-5 pt-5 pb-3">
            <h3 className="font-display font-semibold text-ink-900">My Appointments</h3>
            <button onClick={() => navigate("/patient/appointments")} className="text-xs font-medium text-primary-600 hover:text-primary-700 flex items-center gap-1">
              View all <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-ink-400 text-xs uppercase tracking-wide border-y border-ink-100">
                  <th className="px-5 py-2.5 font-medium">Doctor</th>
                  <th className="px-5 py-2.5 font-medium">Department</th>
                  <th className="px-5 py-2.5 font-medium">Date &amp; Time</th>
                  <th className="px-5 py-2.5 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {myAppointments.length === 0 ? (
                  <tr><td colSpan={4} className="px-5 py-8 text-center text-ink-400 text-sm">No appointments yet.</td></tr>
                ) : (
                  myAppointments.map((a) => (
                    <tr key={a.id} className="border-b border-ink-50 last:border-0 hover:bg-ink-50/60 transition-colors">
                      <td className="px-5 py-3 font-medium text-ink-800 flex items-center gap-2"><Stethoscope className="w-3.5 h-3.5 text-primary-500" />{a.doctor}</td>
                      <td className="px-5 py-3 text-ink-600">{a.department}</td>
                      <td className="px-5 py-3 text-ink-600 font-mono-num text-xs">{a.date} · {a.time}</td>
                      <td className="px-5 py-3"><Badge status={a.status} /></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
