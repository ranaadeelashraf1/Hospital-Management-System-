import { useMemo, useState } from "react";
import { Search, Eye, FileText, Phone } from "lucide-react";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import { Input } from "../../components/ui/Input";
import { currentDoctor, patients, appointments, prescriptions } from "../../data/mockData";

export default function DoctorPatients() {
  const [search, setSearch] = useState("");
  const [viewPatient, setViewPatient] = useState(null);

  const myPatientNames = useMemo(
    () => [...new Set(appointments.filter((a) => a.doctor === currentDoctor.name).map((a) => a.patient))],
    []
  );
  const myPatients = patients.filter((p) => myPatientNames.includes(p.name));

  const filtered = myPatients.filter(
    (p) => p.name.toLowerCase().includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase())
  );

  const patientHistory = (patientName) => ({
    appointments: appointments.filter((a) => a.patient === patientName && a.doctor === currentDoctor.name),
    prescriptions: prescriptions.filter((r) => r.patient === patientName && r.doctor === currentDoctor.name),
  });

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-semibold text-xl text-ink-900">My Patients</h2>
          <p className="text-sm text-ink-500 mt-0.5">{myPatients.length} patients under your care</p>
        </div>
        <Input icon={Search} placeholder="Search your patients…" value={search} onChange={(e) => setSearch(e.target.value)} className="sm:w-72" />
      </div>

      {filtered.length === 0 ? (
        <Card className="text-center py-12">
          <p className="text-ink-400 text-sm">No patients found.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((p) => (
            <Card key={p.id} hover className="animate-fade-up">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-semibold shrink-0">
                    {p.avatar}
                  </div>
                  <div>
                    <p className="font-medium text-ink-900">{p.name}</p>
                    <p className="text-xs text-ink-400 font-mono-num">{p.id}</p>
                  </div>
                </div>
                <Badge status={p.status} />
              </div>
              <div className="text-sm text-ink-600 border-t border-ink-100 pt-3 space-y-1.5">
                <div className="flex justify-between"><span className="text-ink-400 text-xs">Age / Gender</span><span>{p.age} / {p.gender}</span></div>
                <div className="flex items-center gap-1.5 text-xs text-ink-500"><Phone className="w-3.5 h-3.5" />{p.phone}</div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button size="sm" variant="secondary" icon={Eye} onClick={() => setViewPatient(p)}>View History</Button>
                <Button size="sm" variant="outline" icon={FileText}>Prescribe</Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal open={!!viewPatient} onClose={() => setViewPatient(null)} title="Patient History" size="lg">
        {viewPatient && (
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-lg font-semibold">
                {viewPatient.avatar}
              </div>
              <div>
                <p className="font-display font-semibold text-lg text-ink-900">{viewPatient.name}</p>
                <p className="text-xs text-ink-400 font-mono-num">{viewPatient.id}</p>
              </div>
              <Badge status={viewPatient.status} className="ml-auto" />
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><p className="text-ink-400 text-xs mb-0.5">Age / Gender</p><p className="text-ink-800 font-medium">{viewPatient.age} / {viewPatient.gender}</p></div>
              <div><p className="text-ink-400 text-xs mb-0.5">Phone</p><p className="text-ink-800 font-medium">{viewPatient.phone}</p></div>
              <div><p className="text-ink-400 text-xs mb-0.5">Department</p><p className="text-ink-800 font-medium">{viewPatient.department}</p></div>
              <div><p className="text-ink-400 text-xs mb-0.5">Last Visit</p><p className="text-ink-800 font-medium">{viewPatient.lastVisit}</p></div>
            </div>

            <div>
              <p className="text-sm font-semibold text-ink-800 mb-2">Appointment History</p>
              <div className="space-y-2">
                {patientHistory(viewPatient.name).appointments.map((a) => (
                  <div key={a.id} className="flex items-center justify-between bg-ink-50 rounded-xl px-3.5 py-2.5 text-sm">
                    <span className="text-ink-700 font-mono-num text-xs">{a.date} · {a.time}</span>
                    <Badge status={a.status} />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold text-ink-800 mb-2">Prescriptions Issued</p>
              <div className="space-y-2">
                {patientHistory(viewPatient.name).prescriptions.length === 0 ? (
                  <p className="text-xs text-ink-400">No prescriptions issued yet.</p>
                ) : (
                  patientHistory(viewPatient.name).prescriptions.map((rx) => (
                    <div key={rx.id} className="bg-ink-50 rounded-xl px-3.5 py-2.5">
                      <p className="text-sm font-medium text-ink-800">{rx.diagnosis}</p>
                      <p className="text-xs text-ink-500">{rx.date} · {rx.medicines.length} medicine(s)</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
