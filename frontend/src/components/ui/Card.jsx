export default function Card({ children, className = "", hover = false, padded = true }) {
  return (
    <div
      className={`bg-white rounded-2xl border border-ink-100 shadow-soft ${
        hover ? "transition-all duration-200 hover:shadow-card hover:-translate-y-0.5" : ""
      } ${padded ? "p-5" : ""} ${className}`}
    >
      {children}
    </div>
  );
}
