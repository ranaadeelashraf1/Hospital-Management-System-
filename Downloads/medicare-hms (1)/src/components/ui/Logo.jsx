export default function Logo({ collapsed = false, className = "" }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-600 to-accent-600 flex items-center justify-center shrink-0 shadow-soft">
        <svg viewBox="0 0 48 24" className="w-6 h-4" fill="none">
          <polyline
            className="vitals-line"
            points="0,12 10,12 14,3 18,21 22,12 48,12"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      {!collapsed && (
        <div className="leading-tight">
          <p className="font-display font-bold text-ink-900 text-[15px]">MediCare</p>
          <p className="text-[11px] text-ink-400 font-medium tracking-wide">HOSPITAL SYSTEM</p>
        </div>
      )}
    </div>
  );
}
