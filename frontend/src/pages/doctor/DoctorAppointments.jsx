import { useEffect, useState } from "react";
import { Check, X } from "lucide-react";
import toast from "react-hot-toast";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import { TableSkeleton } from "../../components/ui/Skeleton";
import { appointmentsApi } from "../../api/appointments";

const statusLabel = { PENDING: "Pending", CONFIRMED: "Confirmed", COMPLETED: "Completed", CANCELLED: "Cancelled" };

export default function DoctorAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = () => {
    setLoading(true);
    appointmentsApi
      .getAll()
      .then(setAppointments)
      .catch((err) => toast.error(err.message || "Failed to load appointments."))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadData(); }, []);

  const handleComplete = async (id) => {
    try {
      await appointmentsApi.updateStatus(id, "COMPLETED");
      toast.success("Marked as completed");
      loadData();
    } catch (err) {
      toast.error(err.message || "Failed to update.");
    }
  };

  const handleCancel = async (id) => {
    try {
      await appointmentsApi.updateStatus(id, "CANCELLED");
      toast.success("Appointment cancelled");
      loadData();
    } catch (err) {
      toast.error(err.message || "Failed to update.");
    }
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
              {loading ? (
                <tr><td colSpan={4} className="px-5 py-6"><TableSkeleton rows={5} cols={4} /></td></tr>
              ) : appointments.length === 0 ? (
                <tr><td colSpan={4} className="px-5 py-10 text-center text-ink-400 text-sm">No appointments yet.</td></tr>
              ) : (
                appointments.map((a) => (
                  <tr key={a.id} className="border-b border-ink-50 last:border-0 hover:bg-ink-50/60 transition-colors">
                    <td className="px-5 py-3 font-medium text-ink-800">{a.patient?.user?.name}</td>
                    <td className="px-5 py-3 text-ink-600 font-mono-num text-xs">{a.apptDate?.slice(0, 10)} · {a.apptTime}</td>
                    <td className="px-5 py-3"><Badge status={statusLabel[a.status] || a.status} /></td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleComplete(a.id)}
                          disabled={a.status === "COMPLETED" || a.status === "CANCELLED"}
                          className="p-2 rounded-lg text-ink-400 hover:text-success-500 hover:bg-success-100/60 disabled:opacity-30 disabled:pointer-events-none"
                          aria-label="Mark completed"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleCancel(a.id)}
                          disabled={a.status === "CANCELLED" || a.status === "COMPLETED"}
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
