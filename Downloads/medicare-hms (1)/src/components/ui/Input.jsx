export function Field({ label, children, error, className = "" }) {
  return (
    <label className={`block mb-4 ${className}`}>
      {label && <span className="block text-sm font-medium text-ink-700 mb-1.5">{label}</span>}
      {children}
      {error && <span className="block text-xs text-danger-500 mt-1">{error}</span>}
    </label>
  );
}

export function Input({ icon: Icon, className = "", ...props }) {
  return (
    <div className="relative">
      {Icon && <Icon className="w-4 h-4 text-ink-400 absolute left-3.5 top-1/2 -translate-y-1/2" />}
      <input
        className={`w-full rounded-xl border border-ink-200 bg-white text-sm text-ink-900 placeholder:text-ink-400 py-2.5 disabled:bg-ink-50 disabled:text-ink-500 disabled:cursor-not-allowed ${
          Icon ? "pl-10 pr-3.5" : "px-3.5"
        } focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 transition-shadow ${className}`}
        {...props}
      />
    </div>
  );
}

export function Select({ icon: Icon, className = "", children, ...props }) {
  return (
    <div className="relative">
      {Icon && <Icon className="w-4 h-4 text-ink-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />}
      <select
        className={`w-full rounded-xl border border-ink-200 bg-white text-sm text-ink-900 py-2.5 appearance-none ${
          Icon ? "pl-10 pr-3.5" : "px-3.5"
        } focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 transition-shadow ${className}`}
        {...props}
      >
        {children}
      </select>
    </div>
  );
}
