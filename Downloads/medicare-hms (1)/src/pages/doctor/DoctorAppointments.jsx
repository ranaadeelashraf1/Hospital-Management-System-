import { useState } from "react";
import { Check, X } from "lucide-react";
import toast from "react-hot-toast";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import { currentDoctor, appointments as allAppointments } from "../../data/mockData";

export default function DoctorAppointments() {
  const [appointments, setAppointments] = useState(
    allAppointments.filter((a) => a.doctor === currentDoctor.name)
  );

  const handleComplete = (id) => {
    setAppointments(appointments.map((a) => (a.id === id ? { ...a, status: "Completed" } : a)));
    toast.success("Marked as completed");
  };

  const handleCancel = (id) => {
    setAppointments(appointments.map((a) => (a.id === id ? { ...a, status: "Cancelled" } : a)));
    toast.success("Appointment cancelled");
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-display font-semibold text-xl text-ink-900">My Appointments</h2>
        <p className="text-sm text-ink-500 mt-0.5">{appointments.length} scheduled with your patients</p>
      </div>

      <Card padded={false}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-ink-400 text-xs uppercase tracking-wide border-b border-ink-100">
                <th className="px-5 py-3 font-medium">Patient</th>
                <th className="px-5 py-3 font-medium">Date &amp; Time</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.length === 0 ? (
                <tr><td colSpan={4} className="px-5 py-10 text-center text-ink-400 text-sm">No appointments yet.</td></tr>
              ) : (
                appointments.map((a) => (
                  <tr key={a.id} className="border-b border-ink-50 last:border-0 hover:bg-ink-50/60 transition-colors">
                    <td className="px-5 py-3 font-medium text-ink-800">{a.patient}</td>
                    <td className="px-5 py-3 text-ink-600 font-mono-num text-xs">{a.date} · {a.time}</td>
                    <td className="px-5 py-3"><Badge status={a.status} /></td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleComplete(a.id)}
                          disabled={a.status === "Completed" || a.status === "Cancelled"}
                          className="p-2 rounded-lg text-ink-400 hover:text-success-500 hover:bg-success-100/60 disabled:opacity-30 disabled:pointer-events-none"
                          aria-label="Mark completed"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleCancel(a.id)}
                          disabled={a.status === "Cancelled" || a.status === "Completed"}
                          className="p-2 rounded-lg text-ink-400 hover:text-danger-500 hover:bg-danger-100/60 disabled:opacity-30 disabled:pointer-events-none"
                          aria-label="Cancel"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
