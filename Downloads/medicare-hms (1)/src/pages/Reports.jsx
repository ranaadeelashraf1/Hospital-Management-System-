import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Download } from "lucide-react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import RevenueChart from "../components/charts/RevenueChart";
import DepartmentDonut from "../components/charts/DepartmentDonut";
import { revenueTrend, departmentSplit } from "../data/mockData";

function ApptTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white rounded-xl shadow-lifted border border-ink-100 px-3.5 py-2.5 text-xs">
      <p className="font-semibold text-ink-800 mb-1">{label}</p>
      <p className="text-accent-600 font-mono-num">Appointments: {payload[0].value}</p>
    </div>
  );
}

export default function Reports() {
  return (
    <div className="space-y-5">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-semibold text-xl text-ink-900">Reports</h2>
          <p className="text-sm text-ink-500 mt-0.5">Operational and financial insights</p>
        </div>
        <Button variant="secondary" icon={Download}>Export Report</Button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Card className="xl:col-span-2">
          <h3 className="font-display font-semibold text-ink-900 mb-1">Revenue Trend</h3>
          <p className="text-xs text-ink-400 mb-2">Last 8 months</p>
          <RevenueChart data={revenueTrend} />
        </Card>
        <Card>
          <h3 className="font-display font-semibold text-ink-900 mb-1">Patients by Department</h3>
          <p className="text-xs text-ink-400 mb-2">Current distribution</p>
          <DepartmentDonut data={departmentSplit} />
        </Card>
      </div>

      <Card>
        <h3 className="font-display font-semibold text-ink-900 mb-1">Appointments per Month</h3>
        <p className="text-xs text-ink-400 mb-4">Volume trend, last 8 months</p>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={revenueTrend} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
            <Tooltip content={<ApptTooltip />} cursor={{ fill: "#f1f5f9" }} />
            <Bar dataKey="appointments" fill="#0d9488" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
