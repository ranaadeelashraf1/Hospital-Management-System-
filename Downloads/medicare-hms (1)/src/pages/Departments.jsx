import { HeartPulse, Brain, Bone, Baby, Sparkles, Scan, ArrowUpRight, Stethoscope, Users } from "lucide-react";
import Card from "../components/ui/Card";
import { departments } from "../data/mockData";

const icons = { HeartPulse, Brain, Bone, Baby, Sparkles, Scan };

export default function Departments() {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-display font-semibold text-xl text-ink-900">Departments</h2>
        <p className="text-sm text-ink-500 mt-0.5">{departments.length} active departments</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {departments.map((d) => {
          const Icon = icons[d.icon] || Stethoscope;
          return (
            <Card key={d.id} hover className="animate-fade-up">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-500 to-primary-600 flex items-center justify-center">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <button className="p-1.5 rounded-lg text-ink-400 hover:text-primary-600 hover:bg-primary-50">
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
              <h3 className="font-display font-semibold text-ink-900">{d.name}</h3>
              <p className="text-xs text-ink-500 mt-0.5">Head: {d.head}</p>

              <div className="flex items-center gap-4 mt-4 pt-4 border-t border-ink-100">
                <div className="flex items-center gap-1.5 text-sm text-ink-600">
                  <Stethoscope className="w-4 h-4 text-primary-500" />
                  <span className="font-mono-num font-medium">{d.doctors}</span>
                  <span className="text-xs text-ink-400">doctors</span>
                </div>
                <div className="flex items-center gap-1.5 text-sm text-ink-600">
                  <Users className="w-4 h-4 text-accent-500" />
                  <span className="font-mono-num font-medium">{d.patients}</span>
                  <span className="text-xs text-ink-400">patients</span>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
