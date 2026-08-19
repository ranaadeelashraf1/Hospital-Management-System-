import { useState } from "react";
import { Plus, X, RefreshCw, Stethoscope } from "lucide-react";
import toast from "react-hot-toast";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import { Field, Input, Select } from "../../components/ui/Input";
import { currentPatient, appointments as allAppointments, doctors } from "../../data/mockData";

export default function PatientAppointments() {
  const [appointments, setAppointments] = useState(
    allAppointments.filter((a) => a.patient === currentPatient.name)
  );
  const [bookOpen, setBookOpen] = useState(false);
  const [rescheduleTarget, setRescheduleTarget] = useState(null);

  const handleBook = (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const doctorName = form.get("doctor");
    const doctor = doctors.find((d) => d.name === doctorName);
    const newAppt = {
      id: `AP-${600 + appointments.length + 1}`,
      patient: currentPatient.name,
      doctor: doctorName,
      department: doctor?.specialization.replace("ist", "").replace("Surgeon", "Orthopedics") || "General",
      date: form.get("date"),
      time: form.get("time"),
      status: "Pending",
    };
    setAppointments([newAppt, ...appointments]);
    setBookOpen(false);
    toast.success("Appointment request sent!");
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
        a.id === rescheduleTarget.id ? { ...a, date: form.get("date"), time: form.get("time"), status: "Pending" } : a
      )
    );
    setRescheduleTarget(null);
    toast.success("Reschedule request sent");
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
                    <p className="font-medium text-ink-900">{a.doctor}</p>
                    <p className="text-xs text-ink-500">{a.department}</p>
                  </div>
                </div>
                <Badge status={a.status} />
              </div>
              <p className="text-sm text-ink-600 font-mono-num border-t border-ink-100 pt-3">{a.date} · {a.time}</p>
              <div className="flex gap-2 mt-4">
                <Button
                  size="sm"
                  variant="secondary"
                  icon={RefreshCw}
                  disabled={a.status === "Cancelled"}
                  onClick={() => setRescheduleTarget(a)}
                >
                  Reschedule
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  icon={X}
                  disabled={a.status === "Cancelled"}
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

      <Modal open={bookOpen} onClose={() => setBookOpen(false)} title="Book an Appointment" size="lg">
        <form id="patient-book-form" onSubmit={handleBook}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
            <Field label="Doctor" className="sm:col-span-2">
              <Select name="doctor" defaultValue={doctors[0].name}>
                {doctors.map((d) => <option key={d.id}>{d.name} — {d.specialization}</option>)}
              </Select>
            </Field>
            <Field label="Preferred Date"><Input name="date" type="date" defaultValue="2026-08-10" required /></Field>
            <Field label="Preferred Time"><Input name="time" type="time" required /></Field>
          </div>
        </form>
        <div className="flex justify-end gap-3 pt-2">
          <Button variant="secondary" onClick={() => setBookOpen(false)}>Cancel</Button>
          <Button type="submit" form="patient-book-form">Request Appointment</Button>
        </div>
      </Modal>

      <Modal open={!!rescheduleTarget} onClose={() => setRescheduleTarget(null)} title="Reschedule Appointment">
        <form id="patient-reschedule-form" onSubmit={handleReschedule}>
          <p className="text-sm text-ink-500 mb-4">
            Rescheduling your visit with <span className="font-medium text-ink-800">{rescheduleTarget?.doctor}</span>
          </p>
          <Field label="New Date"><Input name="date" type="date" defaultValue={rescheduleTarget?.date} required /></Field>
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
