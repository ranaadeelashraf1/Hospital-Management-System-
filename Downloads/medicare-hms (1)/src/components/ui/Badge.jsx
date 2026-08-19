const statusMap = {
  // appointment statuses
  Confirmed: "bg-primary-100 text-primary-700",
  Pending: "bg-warning-100 text-warning-500",
  Completed: "bg-success-100 text-success-500",
  Cancelled: "bg-danger-100 text-danger-500",
  // patient statuses
  Admitted: "bg-accent-100 text-accent-700",
  Outpatient: "bg-primary-100 text-primary-700",
  Discharged: "bg-ink-100 text-ink-600",
  // doctor availability
  Available: "bg-success-100 text-success-500",
  "On Leave": "bg-warning-100 text-warning-500",
  "In Surgery": "bg-danger-100 text-danger-500",
  // billing
  Paid: "bg-success-100 text-success-500",
  Unpaid: "bg-danger-100 text-danger-500",
};

export default function Badge({ status, children, className = "" }) {
  const label = children ?? status;
  const style = statusMap[status] || "bg-ink-100 text-ink-600";
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${style} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
      {label}
    </span>
  );
}
