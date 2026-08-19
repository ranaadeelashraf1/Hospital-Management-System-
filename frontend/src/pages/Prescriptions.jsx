import { useEffect, useState } from "react";
import { Pill, Stethoscope, CalendarDays } from "lucide-react";
import toast from "react-hot-toast";
import Card from "../components/ui/Card";
import { CardSkeleton } from "../components/ui/Skeleton";
import { prescriptionsApi } from "../api/prescriptions";

function normalize(rx) {
  return {
    id: rx.id,
    patient: rx.patient?.user?.name || "—",
    doctor: rx.doctor?.user?.name || "—",
    date: rx.issuedDate?.slice(0, 10),
    diagnosis: rx.diagnosis,
    medicines: rx.medicines || [],
    instructions: rx.instructions,
  };
}

export default function Prescriptions() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    prescriptionsApi
      .getAll()
      .then((data) => setPrescriptions(data.map(normalize)))
      .catch((err) => toast.error(err.message || "Failed to load prescriptions."))
      .finally(() => setLoading(false));
  }, []);

  const filtered = prescriptions.filter(
    (rx) => rx.patient.toLowerCase().includes(search.toLowerCase()) || rx.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-semibold text-xl text-ink-900">Prescriptions</h2>
          <p className="text-sm text-ink-500 mt-0.5">{prescriptions.length} prescriptions issued hospital-wide</p>
        </div>
        <input
          type="text"
          placeholder="Search by patient…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 lg:w-72 rounded-xl border border-ink-200 bg-white text-sm px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500/40"
        />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <Card className="text-center py-12"><p className="text-ink-400 text-sm">No prescriptions found.</p></Card>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {filtered.map((rx) => (
            <Card key={rx.id} hover className="animate-fade-up">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-display font-semibold text-ink-900">{rx.patient}</p>
                  <p className="text-xs text-ink-400 font-mono-num mt-0.5">{rx.id.slice(0, 8)}</p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-primary-50 text-primary-700 text-xs font-medium">
                  {rx.diagnosis}
                </span>
              </div>

              <div className="flex items-center gap-4 text-xs text-ink-500 mb-4">
                <div className="flex items-center gap-1.5"><Stethoscope className="w-3.5 h-3.5" />{rx.doctor}</div>
                <div className="flex items-center gap-1.5"><CalendarDays className="w-3.5 h-3.5" />{rx.date}</div>
              </div>

              <div className="space-y-2 mb-4">
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
    </div>
  );
}
