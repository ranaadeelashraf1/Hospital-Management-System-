import { useEffect, useState } from "react";
import { Pill, Stethoscope, CalendarDays } from "lucide-react";
import toast from "react-hot-toast";
import Card from "../../components/ui/Card";
import { CardSkeleton } from "../../components/ui/Skeleton";
import { prescriptionsApi } from "../../api/prescriptions";

export default function PatientPrescriptions() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    prescriptionsApi
      .getAll()
      .then(setPrescriptions)
      .catch((err) => toast.error(err.message || "Failed to load prescriptions."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-display font-semibold text-xl text-ink-900">My Prescriptions</h2>
        <p className="text-sm text-ink-500 mt-0.5">{prescriptions.length} prescriptions on file</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">{Array.from({ length: 2 }).map((_, i) => <CardSkeleton key={i} />)}</div>
      ) : prescriptions.length === 0 ? (
        <Card className="text-center py-12"><p className="text-ink-400 text-sm">No prescriptions yet.</p></Card>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {prescriptions.map((rx) => (
            <Card key={rx.id} hover className="animate-fade-up">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-display font-semibold text-ink-900">{rx.diagnosis}</p>
                  <p className="text-xs text-ink-400 font-mono-num mt-0.5">{rx.id.slice(0, 8)}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs text-ink-500 mb-4">
                <div className="flex items-center gap-1.5"><Stethoscope className="w-3.5 h-3.5" />{rx.doctor?.user?.name}</div>
                <div className="flex items-center gap-1.5"><CalendarDays className="w-3.5 h-3.5" />{rx.issuedDate?.slice(0, 10)}</div>
              </div>
              <div className="space-y-2 mb-4">
                {(rx.medicines || []).map((m, i) => (
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
