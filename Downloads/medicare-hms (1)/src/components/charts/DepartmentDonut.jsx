import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const d = payload[0];
  return (
    <div className="bg-white rounded-xl shadow-lifted border border-ink-100 px-3.5 py-2.5 text-xs">
      <p className="font-semibold text-ink-800">{d.name}</p>
      <p className="text-ink-500">{d.value}% of patients</p>
    </div>
  );
}

export default function DepartmentDonut({ data }) {
  return (
    <div className="flex flex-col items-center">
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={3}
            cornerRadius={6}
            strokeWidth={0}
          >
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 w-full mt-2">
        {data.map((d) => (
          <div key={d.name} className="flex items-center gap-2 text-xs text-ink-600">
            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
            <span className="truncate">{d.name}</span>
            <span className="ml-auto font-medium text-ink-800">{d.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
