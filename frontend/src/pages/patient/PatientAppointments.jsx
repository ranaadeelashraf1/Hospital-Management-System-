import { useEffect, useState } from "react";
import { Plus, X, RefreshCw, Stethoscope } from "lucide-react";
import toast from "react-hot-toast";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import { Field, Input, Select } from "../../components/ui/Input";
import { CardSkeleton } from "../../components/ui/Skeleton";
import { appointmentsApi } from "../../api/appointments";
import { doctorsApi } from "../../api/doctors";
import AppointmentSlotSelect from "../../components/appointments/AppointmentSlotSelect";

const statusLabel = { PENDING: "Pending", CONFIRMED: "Confirmed", COMPLETED: "Completed", CANCELLED: "Cancelled" };

export default function PatientAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookOpen, setBookOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [rescheduleTarget, setRescheduleTarget] = useState(null);
  const [booking, setBooking] = useState({ doctorId: "", date: "", time: "" });

  const loadData = async () => {
    setLoading(true);
    try {
      const [appts, docs] = await Promise.all([appointmentsApi.getAll(), doctorsApi.getAll()]);
      setAppointments(appts);
      setDoctors(docs);
    } catch (err) {
      toast.error(err.message || "Failed to load appointments.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleBook = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await appointmentsApi.create({
        doctorId: booking.doctorId,
        apptDate: booking.date,
        apptTime: booking.time,
      });
      toast.success("Appointment request sent!");
      setBookOpen(false);
      setBooking({ doctorId: "", date: "", time: "" });
      loadData();
    } catch (err) {
      toast.error(err.message || "Failed to book appointment.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = async (id) => {
    try {
      await appointmentsApi.updateStatus(id, "CANCELLED");
      toast.success("Appointment cancelled");
      loadData();
    } catch (err) {
      toast.error(err.message || "Failed to cancel.");
    }
  };

  const handleReschedule = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    try {
      await appointmentsApi.reschedule(rescheduleTarget.id, {
        apptDate: form.get("date"),
        apptTime: form.get("time"),
      });
      toast.success("Reschedule request sent");
      setRescheduleTarget(null);
      loadData();
    } catch (err) {
      toast.error(err.message || "Failed to reschedule.");
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-semibold text-xl text-ink-900">My Appointments</h2>
          <p className="text-sm text-ink-500 mt-0.5">{appointments.length} appointments on record</p>
        </div>
        <Button icon={Plus} onClick={() => setBookOpen(true)}>Book Appointment</Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{Array.from({ length: 2 }).map((_, i) => <CardSkeleton key={i} />)}</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {appointments.length === 0 ? (
            <Card className="sm:col-span-2 text-center py-12">
              <p className="text-ink-400 text-sm">You have no appointments yet. Book your first one!</p>
            </Card>
          ) : (
            appointments.map((a) => (
              <Card key={a.id} hover className="animate-fade-up">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-primary-100 flex items-center justify-center shrink-0">
                      <Stethoscope className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <p className="font-medium text-ink-900">{a.doctor?.user?.name}</p>
                      <p className="text-xs text-ink-500">{a.doctor?.specialization}</p>
                    </div>
                  </div>
                  <Badge status={statusLabel[a.status] || a.status} />
                </div>
                <p className="text-sm text-ink-600 font-mono-num border-t border-ink-100 pt-3">{a.apptDate?.slice(0, 10)} · {a.apptTime}</p>
                <div className="flex gap-2 mt-4">
                  <Button size="sm" variant="secondary" icon={RefreshCw} disabled={a.status === "CANCELLED"} onClick={() => setRescheduleTarget(a)}>
                    Reschedule
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    icon={X}
                    disabled={a.status === "CANCELLED"}
                    onClick={() => handleCancel(a.id)}
                    className="!text-danger-500 !border-danger-100 hover:!bg-danger-100/40"
                  >
                    Cancel
                  </Button>
                </div>
              </Card>
            ))
          )}
        </div>
      )}

      <Modal open={bookOpen} onClose={() => setBookOpen(false)} title="Book an Appointment" size="lg">
        <form id="patient-book-form" onSubmit={handleBook}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
            <Field label="Doctor" className="sm:col-span-2">
              <Select name="doctorId" value={booking.doctorId} onChange={(e) => setBooking({ doctorId: e.target.value, date: booking.date, time: "" })} required>
                <option value="">Select a doctor</option>
                {doctors.map((d) => <option key={d.id} value={d.id}>{d.user?.name} — {d.specialization}</option>)}
              </Select>
            </Field>
            <Field label="Preferred Date"><Input name="date" type="date" value={booking.date} onChange={(e) => setBooking({ ...booking, date: e.target.value, time: "" })} required /></Field>
            <Field label="Available 30-minute slot"><AppointmentSlotSelect doctorId={booking.doctorId} date={booking.date} value={booking.time} onChange={(e) => setBooking({ ...booking, time: e.target.value })} /></Field>
          </div>
        </form>
        <div className="flex justify-end gap-3 pt-2">
          <Button variant="secondary" onClick={() => setBookOpen(false)}>Cancel</Button>
          <Button type="submit" form="patient-book-form" loading={saving}>Request Appointment</Button>
        </div>
      </Modal>

      <Modal open={!!rescheduleTarget} onClose={() => setRescheduleTarget(null)} title="Reschedule Appointment">
        <form id="patient-reschedule-form" onSubmit={handleReschedule}>
          <p className="text-sm text-ink-500 mb-4">
            Rescheduling your visit with <span className="font-medium text-ink-800">{rescheduleTarget?.doctor?.user?.name}</span>
          </p>
          <Field label="New Date"><Input name="date" type="date" defaultValue={rescheduleTarget?.apptDate?.slice(0, 10)} required /></Field>
          <Field label="New Time"><Input name="time" type="time" required /></Field>
        </form>
        <div className="flex justify-end gap-3 pt-2">
          <Button variant="secondary" onClick={() => setRescheduleTarget(null)}>Cancel</Button>
          <Button type="submit" form="patient-reschedule-form">Save Changes</Button>
        </div>
      </Modal>
    </div>
  );
}
