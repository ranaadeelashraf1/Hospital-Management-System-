import { useEffect, useMemo, useState } from "react";
import { Plus, ChevronLeft, ChevronRight, X, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Modal from "../components/ui/Modal";
import { Field, Input, Select } from "../components/ui/Input";
import { TableSkeleton } from "../components/ui/Skeleton";
import { appointmentsApi } from "../api/appointments";
import { doctorsApi } from "../api/doctors";
import { patientsApi } from "../api/patients";
import AppointmentSlotSelect from "../components/appointments/AppointmentSlotSelect";

const statusLabel = { PENDING: "Pending", CONFIRMED: "Confirmed", COMPLETED: "Completed", CANCELLED: "Cancelled" };

function normalize(a) {
  return {
    id: a.id,
    patient: a.patient?.user?.name || "—",
    doctor: a.doctor?.user?.name || "—",
    date: a.apptDate?.slice(0, 10),
    time: a.apptTime,
    status: statusLabel[a.status] || a.status,
  };
}

function MiniCalendar({ selectedDate, setSelectedDate, markedDates }) {
  const [viewDate, setViewDate] = useState(new Date());
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthLabel = viewDate.toLocaleString("default", { month: "long", year: "numeric" });

  const cells = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];
  const toDateStr = (d) => `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <button onClick={() => setViewDate(new Date(year, month - 1, 1))} className="p-1.5 rounded-lg hover:bg-ink-100 text-ink-500">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <p className="font-medium text-sm text-ink-800">{monthLabel}</p>
        <button onClick={() => setViewDate(new Date(year, month + 1, 1))} className="p-1.5 rounded-lg hover:bg-ink-100 text-ink-500">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
      <div className="grid grid-cols-7 text-center text-[11px] text-ink-400 mb-1.5">
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => <div key={i}>{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((d, i) => {
          if (!d) return <div key={i} />;
          const dateStr = toDateStr(d);
          const isSelected = dateStr === selectedDate;
          const hasAppt = markedDates.has(dateStr);
          return (
            <button
              key={i}
              onClick={() => setSelectedDate(dateStr)}
              className={`relative aspect-square rounded-lg text-xs font-medium flex items-center justify-center transition-colors ${
                isSelected ? "bg-primary-600 text-white" : "text-ink-600 hover:bg-ink-100"
              }`}
            >
              {d}
              {hasAppt && !isSelected && <span className="absolute bottom-1 w-1 h-1 rounded-full bg-accent-500" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
  const [bookOpen, setBookOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [rescheduleTarget, setRescheduleTarget] = useState(null);
  const [booking, setBooking] = useState({ patientId: "", doctorId: "", date: "", time: "" });

  const loadData = async () => {
    setLoading(true);
    try {
      const [apptsRes, docsRes, patsRes] = await Promise.all([
        appointmentsApi.getAll(),
        doctorsApi.getAll(),
        patientsApi.getAll({ limit: 1000 }),
      ]);
      setAppointments(apptsRes.map(normalize));
      setDoctors(docsRes);
      setPatients(patsRes);
    } catch (err) {
      toast.error(err.message || "Failed to load appointments.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const markedDates = useMemo(() => new Set(appointments.map((a) => a.date)), [appointments]);
  const dayAppointments = appointments.filter((a) => a.date === selectedDate);

  const handleBook = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await appointmentsApi.create({
        patientId: booking.patientId,
        doctorId: booking.doctorId,
        apptDate: booking.date,
        apptTime: booking.time,
      });
      toast.success("Appointment booked successfully");
      setBookOpen(false);
      setBooking({ patientId: "", doctorId: "", date: "", time: "" });
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
      toast.error(err.message || "Failed to cancel appointment.");
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
      toast.success("Appointment rescheduled");
      setRescheduleTarget(null);
      loadData();
    } catch (err) {
      toast.error(err.message || "Failed to reschedule.");
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-semibold text-xl text-ink-900">Appointments</h2>
          <p className="text-sm text-ink-500 mt-0.5">{appointments.length} total appointments</p>
        </div>
        <Button icon={Plus} onClick={() => setBookOpen(true)}>Book Appointment</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card>
          <MiniCalendar selectedDate={selectedDate} setSelectedDate={setSelectedDate} markedDates={markedDates} />
          <div className="mt-4 pt-4 border-t border-ink-100">
            <p className="text-xs font-medium text-ink-500 mb-2">{dayAppointments.length} appointment(s) on {selectedDate}</p>
          </div>
        </Card>

        <Card className="lg:col-span-2" padded={false}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-ink-400 text-xs uppercase tracking-wide border-b border-ink-100">
                  <th className="px-5 py-3 font-medium">Patient</th>
                  <th className="px-5 py-3 font-medium">Doctor</th>
                  <th className="px-5 py-3 font-medium">Time</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={5} className="px-5 py-6"><TableSkeleton rows={4} cols={5} /></td></tr>
                ) : dayAppointments.length === 0 ? (
                  <tr><td colSpan={5} className="px-5 py-10 text-center text-ink-400 text-sm">No appointments on this date.</td></tr>
                ) : (
                  dayAppointments.map((a) => (
                    <tr key={a.id} className="border-b border-ink-50 last:border-0 hover:bg-ink-50/60 transition-colors">
                      <td className="px-5 py-3 font-medium text-ink-800">{a.patient}</td>
                      <td className="px-5 py-3 text-ink-600">{a.doctor}</td>
                      <td className="px-5 py-3 text-ink-600 font-mono-num text-xs">{a.time}</td>
                      <td className="px-5 py-3"><Badge status={a.status} /></td>
                      <td className="px-5 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setRescheduleTarget(a)}
                            disabled={a.status === "Cancelled"}
                            className="p-2 rounded-lg text-ink-400 hover:text-primary-600 hover:bg-primary-50 disabled:opacity-30 disabled:pointer-events-none"
                            aria-label="Reschedule"
                          >
                            <RefreshCw className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleCancel(a.id)}
                            disabled={a.status === "Cancelled"}
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

      {/* Book appointment modal */}
      <Modal open={bookOpen} onClose={() => setBookOpen(false)} title="Book Appointment" size="lg">
        <form id="book-appt-form" onSubmit={handleBook}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
            <Field label="Patient" className="sm:col-span-2">
              <Select name="patientId" value={booking.patientId} onChange={(e) => setBooking({ ...booking, patientId: e.target.value })} required>
                <option value="">Select a patient</option>
                {patients.map((p) => <option key={p.id} value={p.id}>{p.user?.name}</option>)}
              </Select>
            </Field>
            <Field label="Doctor" className="sm:col-span-2">
              <Select name="doctorId" value={booking.doctorId} onChange={(e) => setBooking({ ...booking, doctorId: e.target.value, time: "" })} required>
                <option value="">Select a doctor</option>
                {doctors.map((d) => <option key={d.id} value={d.id}>{d.user?.name} — {d.specialization}</option>)}
              </Select>
            </Field>
            <Field label="Date"><Input name="date" type="date" value={booking.date} onChange={(e) => setBooking({ ...booking, date: e.target.value, time: "" })} required /></Field>
            <Field label="Available 30-minute slot"><AppointmentSlotSelect doctorId={booking.doctorId} date={booking.date} value={booking.time} onChange={(e) => setBooking({ ...booking, time: e.target.value })} /></Field>
          </div>
        </form>
        <div className="flex justify-end gap-3 pt-2">
          <Button variant="secondary" onClick={() => setBookOpen(false)}>Cancel</Button>
          <Button type="submit" form="book-appt-form" loading={saving}>Confirm Booking</Button>
        </div>
      </Modal>

      {/* Reschedule modal */}
      <Modal open={!!rescheduleTarget} onClose={() => setRescheduleTarget(null)} title="Reschedule Appointment">
        <form id="reschedule-form" onSubmit={handleReschedule}>
          <p className="text-sm text-ink-500 mb-4">
            Rescheduling for <span className="font-medium text-ink-800">{rescheduleTarget?.patient}</span> with{" "}
            <span className="font-medium text-ink-800">{rescheduleTarget?.doctor}</span>
          </p>
          <Field label="New Date"><Input name="date" type="date" defaultValue={rescheduleTarget?.date} required /></Field>
          <Field label="New Time"><Input name="time" type="time" required /></Field>
        </form>
        <div className="flex justify-end gap-3 pt-2">
          <Button variant="secondary" onClick={() => setRescheduleTarget(null)}>Cancel</Button>
          <Button type="submit" form="reschedule-form">Save Changes</Button>
        </div>
      </Modal>
    </div>
  );
}
