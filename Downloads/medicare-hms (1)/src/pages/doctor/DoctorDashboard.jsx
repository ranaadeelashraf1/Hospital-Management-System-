import { useNavigate } from "react-router-dom";
import { Users, CalendarDays, ClipboardList, ArrowUpRight, Star, FileText } from "lucide-react";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import { currentDoctor, patients, appointments, prescriptions } from "../../data/mockData";

export default function DoctorDashboard() {
  const navigate = useNavigate();

  const myAppointments = appointments.filter((a) => a.doctor === currentDoctor.name);
  const myPatientNames = [...new Set(myAppointments.map((a) => a.patient))];
  const myPatients = patients.filter((p) => myPatientNames.includes(p.name));
  const myPrescriptions = prescriptions.filter((r) => r.doctor === currentDoctor.name);
  const todayAppts = myAppointments.filter((a) => a.date === "2026-08-05");

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-primary-600 via-primary-600 to-accent-600 text-white border-0 overflow-hidden relative">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: "radial-gradient(circle at 2px 2px, white 1.5px, transparent 0)",
          backgroundSize: "24px 24px",
        }} />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-display font-bold">Welcome back, {currentDoctor.name} 👋</h2>
            <p className="text-primary-100 text-sm mt-1">{currentDoctor.specialization} · {currentDoctor.department} Department</p>
          </div>
          <Button variant="secondary" icon={ClipboardList} onClick={() => navigate("/doctor/prescriptions")} className="!bg-white !text-primary-700 shrink-0">
            Write Prescription
          </Button>
        </div>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card hover>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-primary-100 flex items-center justify-center shrink-0">
              <Users className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <p className="text-xs text-ink-500">My Patients</p>
              <p className="text-lg font-display font-semibold text-ink-900 font-mono-num">{myPatients.length}</p>
            </div>
          </div>
        </Card>
        <Card hover>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-accent-100 flex items-center justify-center shrink-0">
              <CalendarDays className="w-5 h-5 text-accent-600" />
            </div>
            <div>
              <p className="text-xs text-ink-500">Today's Appointments</p>
              <p className="text-lg font-display font-semibold text-ink-900 font-mono-num">{todayAppts.length}</p>
            </div>
          </div>
        </Card>
        <Card hover>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-warning-100 flex items-center justify-center shrink-0">
              <Star className="w-5 h-5 text-warning-500" />
            </div>
            <div>
              <p className="text-xs text-ink-500">Rating</p>
              <p className="text-lg font-display font-semibold text-ink-900 font-mono-num">{currentDoctor.rating} / 5.0</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Card className="xl:col-span-2" padded={false}>
          <div className="flex items-center justify-between px-5 pt-5 pb-3">
            <h3 className="font-display font-semibold text-ink-900">Today's Schedule</h3>
            <button onClick={() => navigate("/doctor/appointments")} className="text-xs font-medium text-primary-600 hover:text-primary-700 flex items-center gap-1">
              View all <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-ink-400 text-xs uppercase tracking-wide border-y border-ink-100">
                  <th className="px-5 py-2.5 font-medium">Patient</th>
                  <th className="px-5 py-2.5 font-medium">Time</th>
                  <th className="px-5 py-2.5 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {myAppointments.length === 0 ? (
                  <tr><td colSpan={3} className="px-5 py-8 text-center text-ink-400 text-sm">No appointments scheduled.</td></tr>
                ) : (
                  myAppointments.map((a) => (
                    <tr key={a.id} className="border-b border-ink-50 last:border-0 hover:bg-ink-50/60 transition-colors">
                      <td className="px-5 py-3 font-medium text-ink-800">{a.patient}</td>
                      <td className="px-5 py-3 text-ink-600 font-mono-num text-xs">{a.date} · {a.time}</td>
                      <td className="px-5 py-3"><Badge status={a.status} /></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>

        <Card padded={false}>
          <div className="flex items-center justify-between px-5 pt-5 pb-3">
            <h3 className="font-display font-semibold text-ink-900">Recent Prescriptions</h3>
          </div>
          <div className="divide-y divide-ink-50">
            {myPrescriptions.length === 0 ? (
              <p className="px-5 py-8 text-center text-ink-400 text-sm">None issued yet.</p>
            ) : (
              myPrescriptions.map((rx) => (
                <div key={rx.id} className="px-5 py-3 hover:bg-ink-50/60 transition-colors">
                  <div className="flex items-start gap-2.5">
                    <FileText className="w-4 h-4 text-accent-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-ink-800">{rx.patient}</p>
                      <p className="text-xs text-ink-500 mt-0.5">{rx.diagnosis}</p>
                      <p className="text-[11px] text-ink-400 mt-1">{rx.date}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
