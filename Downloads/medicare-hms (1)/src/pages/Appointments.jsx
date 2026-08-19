import { useMemo, useState } from "react";
import { Plus, ChevronLeft, ChevronRight, X, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Modal from "../components/ui/Modal";
import { Field, Input, Select } from "../components/ui/Input";
import { appointments as initialAppointments, doctors, patients } from "../data/mockData";

function MiniCalendar({ selectedDate, setSelectedDate, markedDates }) {
  const [viewDate, setViewDate] = useState(new Date(2026, 7, 1)); // Aug 2026
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
  const [appointments, setAppointments] = useState(initialAppointments);
  const [selectedDate, setSelectedDate] = useState("2026-08-05");
  const [bookOpen, setBookOpen] = useState(false);
  const [rescheduleTarget, setRescheduleTarget] = useState(null);

  const markedDates = useMemo(() => new Set(appointments.map((a) => a.date)), [appointments]);
  const dayAppointments = appointments.filter((a) => a.date === selectedDate);

  const handleBook = (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const newAppt = {
      id: `AP-${500 + appointments.length + 1}`,
      patient: form.get("patient"),
      doctor: form.get("doctor"),
      department: form.get("department"),
      date: form.get("date"),
      time: form.get("time"),
      status: "Pending",
    };
    setAppointments([newAppt, ...appointments]);
    setBookOpen(false);
    toast.success("Appointment booked successfully");
  };

  const handleCancel = (id) => {
    setAppointments(appointments.map((a) => (a.id === id ? { ...a, status: "Cancelled" } : a)));
    toast.success("Appointment cancelled");
  };

  const handleReschedule = (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    setAppointments(
      appointments.map((a) =>
        a.id === rescheduleTarget.id
          ? { ...a, date: form.get("date"), time: form.get("time"), status: "Pending" }
          : a
      )
    );
    setRescheduleTarget(null);
    toast.success("Appointment rescheduled");
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
                {dayAppointments.length === 0 ? (
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
            <Field label="Patient">
              <Select name="patient" defaultValue={patients[0].name}>
                {patients.map((p) => <option key={p.id}>{p.name}</option>)}
              </Select>
            </Field>
            <Field label="Doctor">
              <Select name="doctor" defaultValue={doctors[0].name}>
                {doctors.map((d) => <option key={d.id}>{d.name}</option>)}
              </Select>
            </Field>
            <Field label="Department">
              <Select name="department" defaultValue="Cardiology">
                {[...new Set(doctors.map((d) => d.specialization))].map((s) => <option key={s}>{s}</option>)}
              </Select>
            </Field>
            <Field label="Date"><Input name="date" type="date" defaultValue="2026-08-05" required /></Field>
            <Field label="Time" className="sm:col-span-2"><Input name="time" type="time" required /></Field>
          </div>
        </form>
        <div className="flex justify-end gap-3 pt-2">
          <Button variant="secondary" onClick={() => setBookOpen(false)}>Cancel</Button>
          <Button type="submit" form="book-appt-form">Confirm Booking</Button>
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
