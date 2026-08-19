import { useState } from "react";
import { Pill, Plus, Trash2, CalendarDays } from "lucide-react";
import toast from "react-hot-toast";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import { Field, Input, Select } from "../../components/ui/Input";
import { currentDoctor, prescriptions as initialRx, appointments } from "../../data/mockData";

export default function DoctorPrescriptions() {
  const [prescriptions, setPrescriptions] = useState(initialRx.filter((r) => r.doctor === currentDoctor.name));
  const [writeOpen, setWriteOpen] = useState(false);
  const [medicines, setMedicines] = useState([{ name: "", dosage: "", duration: "" }]);

  const myPatientNames = [...new Set(appointments.filter((a) => a.doctor === currentDoctor.name).map((a) => a.patient))];

  const addMedicineRow = () => setMedicines([...medicines, { name: "", dosage: "", duration: "" }]);
  const removeMedicineRow = (i) => setMedicines(medicines.filter((_, idx) => idx !== i));
  const updateMedicine = (i, field, value) => {
    const copy = [...medicines];
    copy[i][field] = value;
    setMedicines(copy);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const newRx = {
      id: `RX-${9010 + prescriptions.length}`,
      patient: form.get("patient"),
      doctor: currentDoctor.name,
      date: new Date().toISOString().slice(0, 10),
      diagnosis: form.get("diagnosis"),
      medicines: medicines.filter((m) => m.name),
      instructions: form.get("instructions"),
    };
    setPrescriptions([newRx, ...prescriptions]);
    setWriteOpen(false);
    setMedicines([{ name: "", dosage: "", duration: "" }]);
    toast.success("Prescription issued successfully");
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-semibold text-xl text-ink-900">Prescriptions</h2>
          <p className="text-sm text-ink-500 mt-0.5">{prescriptions.length} issued by you</p>
        </div>
        <Button icon={Plus} onClick={() => setWriteOpen(true)}>Write Prescription</Button>
      </div>

      {prescriptions.length === 0 ? (
        <Card className="text-center py-12">
          <p className="text-ink-400 text-sm">You haven't issued any prescriptions yet.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {prescriptions.map((rx) => (
            <Card key={rx.id} hover className="animate-fade-up">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-display font-semibold text-ink-900">{rx.patient}</p>
                  <p className="text-xs text-ink-400 font-mono-num mt-0.5">{rx.id}</p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-primary-50 text-primary-700 text-xs font-medium">{rx.diagnosis}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-ink-500 mb-4"><CalendarDays className="w-3.5 h-3.5" />{rx.date}</div>
              <div className="space-y-2 mb-3">
                {rx.medicines.map((m, i) => (
                  <div key={i} className="flex items-start gap-2.5 bg-ink-50 rounded-xl px-3.5 py-2.5">
                    <Pill className="w-4 h-4 text-accent-600 mt-0.5 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-ink-800">{m.name}</p>
                      <p className="text-xs text-ink-500">{m.dosage} · {m.duration}</p>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-ink-500 border-t border-ink-100 pt-3 leading-relaxed">
                <span className="font-medium text-ink-700">Instructions: </span>{rx.instructions}
              </p>
            </Card>
          ))}
        </div>
      )}

      <Modal open={writeOpen} onClose={() => setWriteOpen(false)} title="Write New Prescription" size="lg">
        <form id="write-rx-form" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
            <Field label="Patient">
              <Select name="patient" defaultValue={myPatientNames[0] || ""}>
                {myPatientNames.map((n) => <option key={n}>{n}</option>)}
              </Select>
            </Field>
            <Field label="Diagnosis"><Input name="diagnosis" required placeholder="e.g. Acute Bronchitis" /></Field>
          </div>

          <p className="text-sm font-medium text-ink-700 mb-2">Medicines</p>
          <div className="space-y-2 mb-3">
            {medicines.map((m, i) => (
              <div key={i} className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2 items-center">
                <Input placeholder="Medicine name" value={m.name} onChange={(e) => updateMedicine(i, "name", e.target.value)} />
                <Input placeholder="Dosage" value={m.dosage} onChange={(e) => updateMedicine(i, "dosage", e.target.value)} />
                <Input placeholder="Duration" value={m.duration} onChange={(e) => updateMedicine(i, "duration", e.target.value)} />
                <button
                  type="button"
                  onClick={() => removeMedicineRow(i)}
                  disabled={medicines.length === 1}
                  className="p-2 rounded-lg text-ink-400 hover:text-danger-500 hover:bg-danger-100/60 disabled:opacity-30"
                  aria-label="Remove medicine"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
          <Button type="button" size="sm" variant="secondary" icon={Plus} onClick={addMedicineRow} className="mb-4">Add Medicine</Button>

          <Field label="Instructions">
            <textarea
              name="instructions"
              rows={3}
              required
              placeholder="e.g. Take with food. Avoid dairy. Follow up in 2 weeks."
              className="w-full rounded-xl border border-ink-200 bg-white text-sm text-ink-900 placeholder:text-ink-400 px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 transition-shadow resize-none"
            />
          </Field>
        </form>
        <div className="flex justify-end gap-3 pt-2">
          <Button variant="secondary" onClick={() => setWriteOpen(false)}>Cancel</Button>
          <Button type="submit" form="write-rx-form">Issue Prescription</Button>
        </div>
      </Modal>
    </div>
  );
}
