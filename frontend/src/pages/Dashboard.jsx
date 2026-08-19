import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserPlus, CalendarPlus, FileText, Receipt, ArrowUpRight, Users, UserRound, CalendarClock, Wallet } from "lucide-react";
import toast from "react-hot-toast";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import { CardSkeleton, TableSkeleton } from "../components/ui/Skeleton";
import RevenueChart from "../components/charts/RevenueChart";
import DepartmentDonut from "../components/charts/DepartmentDonut";
import { patientsApi } from "../api/patients";
import { doctorsApi } from "../api/doctors";
import { appointmentsApi } from "../api/appointments";
import { billingApi } from "../api/billing";

const quickActions = [
  { label: "Add Patient", icon: UserPlus, variant: "primary", to: "/patients" },
  { label: "Book Appointment", icon: CalendarPlus, variant: "accent", to: "/appointments" },
  { label: "New Prescription", icon: FileText, variant: "secondary", to: "/prescriptions" },
  { label: "Create Invoice", icon: Receipt, variant: "secondary", to: "/billing" },
];

const statusLabel = { PENDING: "Pending", CONFIRMED: "Confirmed", COMPLETED: "Completed", CANCELLED: "Cancelled" };
const donutColors = ["#2563eb", "#0d9488", "#60a5fa", "#5eead4", "#93c5fd", "#a78bfa"];

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [billing, setBilling] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      patientsApi.getAll({ limit: 1000 }),
      doctorsApi.getAll(),
      appointmentsApi.getAll(),
      billingApi.getAll(),
    ])
      .then(([p, d, a, b]) => {
        setPatients(p);
        setDoctors(d);
        setAppointments(a);
        setBilling(b);
      })
      .catch((err) => toast.error(err.message || "Failed to load dashboard data."))
      .finally(() => setLoading(false));
  }, []);

  const today = new Date().toISOString().slice(0, 10);
  const todaysAppointments = appointments.filter((a) => a.apptDate?.slice(0, 10) === today);
  const totalRevenue = billing.filter((b) => b.status === "PAID").reduce((sum, b) => sum + Number(b.amount), 0);

  const statCards = [
    { label: "Total Patients", value: patients.length, icon: Users },
    { label: "Total Doctors", value: doctors.length, icon: UserRound },
    { label: "Today's Appointments", value: todaysAppointments.length, icon: CalendarClock },
    { label: "Total Revenue", value: `$${totalRevenue.toLocaleString()}`, icon: Wallet },
  ];

  // Department distribution, computed client-side from the patient list
  const deptCounts = patients.reduce((acc, p) => {
    const name = p.department?.name || "Unassigned";
    acc[name] = (acc[name] || 0) + 1;
    return acc;
  }, {});
  const departmentSplit = Object.entries(deptCounts).map(([name, count], i) => ({
    name,
    value: patients.length ? Math.round((count / patients.length) * 100) : 0,
    color: donutColors[i % donutColors.length],
  }));

  const recentAppointments = [...appointments]
    .sort((a, b) => new Date(b.apptDate) - new Date(a.apptDate))
    .slice(0, 5);

  const recentPatients = [...patients]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3">
        {quickActions.map((qa) => (
          <Button key={qa.label} variant={qa.variant} icon={qa.icon} onClick={() => navigate(qa.to)}>
            {qa.label}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)
          : statCards.map((s) => (
              <Card key={s.label} hover>
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-soft">
                  <s.icon className="w-5 h-5 text-white" />
                </div>
                <p className="text-sm text-ink-500 mt-4">{s.label}</p>
                <p className="text-2xl font-display font-semibold text-ink-900 font-mono-num mt-1">{s.value}</p>
              </Card>
            ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Card className="xl:col-span-2">
          <div className="mb-1">
            <h3 className="font-display font-semibold text-ink-900">Revenue Overview</h3>
            <p className="text-xs text-ink-400 mt-0.5">Live totals from billing records</p>
          </div>
          {loading ? (
            <div className="h-[280px] flex items-center justify-center"><TableSkeleton rows={6} cols={1} /></div>
          ) : billing.length === 0 ? (
            <div className="h-[280px] flex items-center justify-center text-sm text-ink-400">No billing data yet.</div>
          ) : (
            <RevenueChart
              data={Object.values(
                billing.reduce((acc, b) => {
                  const month = new Date(b.invoiceDate).toLocaleString("default", { month: "short" });
                  acc[month] = acc[month] || { month, revenue: 0 };
                  if (b.status === "PAID") acc[month].revenue += Number(b.amount);
                  return acc;
                }, {})
              )}
            />
          )}
        </Card>

        <Card>
          <h3 className="font-display font-semibold text-ink-900 mb-1">Patients by Department</h3>
          <p className="text-xs text-ink-400 mb-2">Current distribution</p>
          {loading ? (
            <TableSkeleton rows={5} cols={1} />
          ) : departmentSplit.length === 0 ? (
            <p className="text-sm text-ink-400 text-center py-8">No patients yet.</p>
          ) : (
            <DepartmentDonut data={departmentSplit} />
          )}
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Card className="xl:col-span-2" padded={false}>
          <div className="flex items-center justify-between px-5 pt-5 pb-3">
            <h3 className="font-display font-semibold text-ink-900">Recent Appointments</h3>
            <button onClick={() => navigate("/appointments")} className="text-xs font-medium text-primary-600 hover:text-primary-700 flex items-center gap-1">
              View all <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-ink-400 text-xs uppercase tracking-wide border-y border-ink-100">
                  <th className="px-5 py-2.5 font-medium">Patient</th>
                  <th className="px-5 py-2.5 font-medium">Doctor</th>
                  <th className="px-5 py-2.5 font-medium">Date &amp; Time</th>
                  <th className="px-5 py-2.5 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={4} className="px-5 py-4"><TableSkeleton rows={4} cols={4} /></td></tr>
                ) : recentAppointments.length === 0 ? (
                  <tr><td colSpan={4} className="px-5 py-8 text-center text-ink-400 text-sm">No appointments yet.</td></tr>
                ) : (
                  recentAppointments.map((a) => (
                    <tr key={a.id} className="border-b border-ink-50 last:border-0 hover:bg-ink-50/60 transition-colors">
                      <td className="px-5 py-3 font-medium text-ink-800">{a.patient?.user?.name}</td>
                      <td className="px-5 py-3 text-ink-600">{a.doctor?.user?.name}</td>
                      <td className="px-5 py-3 text-ink-600 font-mono-num text-xs">{a.apptDate?.slice(0, 10)} · {a.apptTime}</td>
                      <td className="px-5 py-3"><Badge status={statusLabel[a.status] || a.status} /></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>

        <Card padded={false}>
          <div className="flex items-center justify-between px-5 pt-5 pb-3">
            <h3 className="font-display font-semibold text-ink-900">Latest Patients</h3>
            <button onClick={() => navigate("/patients")} className="text-xs font-medium text-primary-600 hover:text-primary-700 flex items-center gap-1">
              View all <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="divide-y divide-ink-50 max-h-[320px] overflow-y-auto scrollbar-thin">
            {loading ? (
              <div className="px-5 py-4"><TableSkeleton rows={4} cols={1} /></div>
            ) : recentPatients.length === 0 ? (
              <p className="px-5 py-8 text-center text-ink-400 text-sm">No patients yet.</p>
            ) : (
              recentPatients.map((p) => (
                <div key={p.id} className="px-5 py-3 hover:bg-ink-50/60 transition-colors flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-xs font-semibold shrink-0">
                    {p.user?.name?.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-ink-800 truncate">{p.user?.name}</p>
                    <p className="text-xs text-ink-400">{p.department?.name || "Unassigned"}</p>
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
