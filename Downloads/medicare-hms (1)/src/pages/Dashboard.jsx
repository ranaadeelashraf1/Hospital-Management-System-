import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserPlus, CalendarPlus, FileText, Receipt, ArrowUpRight } from "lucide-react";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import StatCard from "../components/ui/StatCard";
import Button from "../components/ui/Button";
import { CardSkeleton, TableSkeleton } from "../components/ui/Skeleton";
import RevenueChart from "../components/charts/RevenueChart";
import DepartmentDonut from "../components/charts/DepartmentDonut";
import { statCards, revenueTrend, departmentSplit, appointments, recentPatients, notifications } from "../data/mockData";

const quickActions = [
  { label: "Add Patient", icon: UserPlus, variant: "primary", to: "/patients" },
  { label: "Book Appointment", icon: CalendarPlus, variant: "accent", to: "/appointments" },
  { label: "New Prescription", icon: FileText, variant: "secondary", to: "/prescriptions" },
  { label: "Create Invoice", icon: Receipt, variant: "secondary", to: "/billing" },
];

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="space-y-6">
      {/* Quick actions */}
      <div className="flex flex-wrap gap-3">
        {quickActions.map((qa) => (
          <Button key={qa.label} variant={qa.variant} icon={qa.icon} onClick={() => navigate(qa.to)}>
            {qa.label}
          </Button>
        ))}
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)
          : statCards.map((s, i) => <StatCard key={s.id} stat={s} index={i} />)}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Card className="xl:col-span-2">
          <div className="flex items-center justify-between mb-1">
            <div>
              <h3 className="font-display font-semibold text-ink-900">Revenue Overview</h3>
              <p className="text-xs text-ink-400 mt-0.5">Monthly revenue trend, last 8 months</p>
            </div>
            <Badge status="Confirmed">+14.6% vs last month</Badge>
          </div>
          {loading ? <div className="h-[280px] flex items-center justify-center"><TableSkeleton rows={6} cols={1} /></div> : <RevenueChart data={revenueTrend} />}
        </Card>

        <Card>
          <h3 className="font-display font-semibold text-ink-900 mb-1">Patients by Department</h3>
          <p className="text-xs text-ink-400 mb-2">Current distribution</p>
          {loading ? <TableSkeleton rows={5} cols={1} /> : <DepartmentDonut data={departmentSplit} />}
        </Card>
      </div>

      {/* Tables */}
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
                ) : (
                  appointments.slice(0, 5).map((a) => (
                    <tr key={a.id} className="border-b border-ink-50 last:border-0 hover:bg-ink-50/60 transition-colors">
                      <td className="px-5 py-3 font-medium text-ink-800">{a.patient}</td>
                      <td className="px-5 py-3 text-ink-600">{a.doctor}</td>
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
            <h3 className="font-display font-semibold text-ink-900">Notifications</h3>
          </div>
          <div className="divide-y divide-ink-50 max-h-[320px] overflow-y-auto scrollbar-thin">
            {notifications.map((n) => (
              <div key={n.id} className="px-5 py-3 hover:bg-ink-50/60 transition-colors">
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
        </Card>
      </div>

      {/* Latest patients */}
      <Card padded={false}>
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <h3 className="font-display font-semibold text-ink-900">Latest Patients</h3>
          <button onClick={() => navigate("/patients")} className="text-xs font-medium text-primary-600 hover:text-primary-700 flex items-center gap-1">
            View all <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-ink-400 text-xs uppercase tracking-wide border-y border-ink-100">
                <th className="px-5 py-2.5 font-medium">Patient</th>
                <th className="px-5 py-2.5 font-medium">ID</th>
                <th className="px-5 py-2.5 font-medium">Department</th>
                <th className="px-5 py-2.5 font-medium">Last Visit</th>
                <th className="px-5 py-2.5 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentPatients.map((p) => (
                <tr key={p.id} className="border-b border-ink-50 last:border-0 hover:bg-ink-50/60 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-xs font-semibold shrink-0">
                        {p.avatar}
                      </div>
                      <span className="font-medium text-ink-800">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-ink-500 font-mono-num text-xs">{p.id}</td>
                  <td className="px-5 py-3 text-ink-600">{p.department}</td>
                  <td className="px-5 py-3 text-ink-600 font-mono-num text-xs">{p.lastVisit}</td>
                  <td className="px-5 py-3"><Badge status={p.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
