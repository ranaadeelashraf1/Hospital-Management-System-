import { TrendingUp, TrendingDown, Users, UserRound, CalendarClock, Wallet } from "lucide-react";
import Card from "./Card";

const icons = {
  "Total Patients": Users,
  "Total Doctors": UserRound,
  "Today's Appointments": CalendarClock,
  "Total Revenue": Wallet,
};

function Sparkline({ data, trend }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * 100;
      const y = 28 - ((v - min) / (max - min || 1)) * 24;
      return `${x},${y}`;
    })
    .join(" ");
  const color = trend === "up" ? "#0d9488" : "#dc2626";

  return (
    <svg viewBox="0 0 100 28" className="w-20 h-7" preserveAspectRatio="none">
      <polyline points={points} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function StatCard({ stat, index = 0 }) {
  const Icon = icons[stat.label] || Users;
  const TrendIcon = stat.trend === "up" ? TrendingUp : TrendingDown;
  const trendColor = stat.trend === "up" ? "text-success-500" : "text-danger-500";

  return (
    <Card hover className="animate-fade-up" style={{ animationDelay: `${index * 60}ms` }}>
      <div className="flex items-start justify-between">
        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-soft">
          <Icon className="w-5 h-5 text-white" />
        </div>
        <Sparkline data={stat.spark} trend={stat.trend} />
      </div>
      <p className="text-sm text-ink-500 mt-4">{stat.label}</p>
      <div className="flex items-end justify-between mt-1">
        <p className="text-2xl font-display font-semibold text-ink-900 font-mono-num">{stat.value}</p>
        <span className={`flex items-center gap-0.5 text-xs font-medium ${trendColor}`}>
          <TrendIcon className="w-3.5 h-3.5" />
          {stat.change}
        </span>
      </div>
    </Card>
  );
}
