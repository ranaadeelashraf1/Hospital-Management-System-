import { useMemo, useState } from "react";
import { Search, SlidersHorizontal, Phone, Mail, Clock, Star } from "lucide-react";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import { Input, Select } from "../components/ui/Input";
import { CardSkeleton } from "../components/ui/Skeleton";
import { doctors } from "../data/mockData";

export default function Doctors() {
  const [search, setSearch] = useState("");
  const [specFilter, setSpecFilter] = useState("All");
  const [loading] = useState(false);

  const specializations = ["All", ...new Set(doctors.map((d) => d.specialization))];

  const filtered = useMemo(() => {
    return doctors.filter((d) => {
      const matchesSearch = d.name.toLowerCase().includes(search.toLowerCase());
      const matchesSpec = specFilter === "All" || d.specialization === specFilter;
      return matchesSearch && matchesSpec;
    });
  }, [search, specFilter]);

  return (
    <div className="space-y-5">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-semibold text-xl text-ink-900">Doctors</h2>
          <p className="text-sm text-ink-500 mt-0.5">{filtered.length} doctors on staff</p>
        </div>
        <div className="flex gap-3 w-full lg:w-auto">
          <Input icon={Search} placeholder="Search doctors…" value={search} onChange={(e) => setSearch(e.target.value)} className="lg:w-64" />
          <Select icon={SlidersHorizontal} value={specFilter} onChange={(e) => setSpecFilter(e.target.value)} className="min-w-[180px]">
            {specializations.map((s) => <option key={s} value={s}>{s}</option>)}
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)
          : filtered.map((d) => (
              <Card key={d.id} hover className="animate-fade-up">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-display font-semibold text-lg shrink-0">
                      {d.avatar}
                    </div>
                    <div>
                      <p className="font-display font-semibold text-ink-900">{d.name}</p>
                      <p className="text-xs text-ink-500">{d.specialization}</p>
                    </div>
                  </div>
                  <Badge status={d.status} />
                </div>

                <div className="flex items-center gap-1 mb-3 text-warning-500">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`w-3.5 h-3.5 ${i < Math.round(d.rating) ? "fill-current" : "text-ink-200"}`} />
                  ))}
                  <span className="text-xs text-ink-500 ml-1">{d.rating}</span>
                </div>

                <div className="space-y-2 text-sm text-ink-600 border-t border-ink-100 pt-3">
                  <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-ink-400 shrink-0" /><span className="text-xs">{d.availability}</span></div>
                  <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-ink-400 shrink-0" /><span className="text-xs">{d.phone}</span></div>
                  <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-ink-400 shrink-0" /><span className="text-xs truncate">{d.email}</span></div>
                </div>

                <div className="flex items-center justify-between mt-4 pt-3 border-t border-ink-100">
                  <span className="text-xs text-ink-400">{d.experience} experience</span>
                  <Button size="sm" variant="outline">View Profile</Button>
                </div>
              </Card>
            ))}
      </div>

      {!loading && filtered.length === 0 && (
        <Card className="text-center py-12">
          <p className="text-ink-400 text-sm">No doctors match your search.</p>
        </Card>
      )}
    </div>
  );
}
