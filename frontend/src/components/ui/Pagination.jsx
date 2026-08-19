import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({ page, totalPages, onChange, totalItems, pageSize }) {
  if (totalPages <= 1) return null;

  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalItems);

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1
  );

  return (
    <div className="flex items-center justify-between px-1 py-4 flex-wrap gap-3">
      <p className="text-sm text-ink-500">
        Showing <span className="font-medium text-ink-700">{start}-{end}</span> of{" "}
        <span className="font-medium text-ink-700">{totalItems}</span>
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onChange(Math.max(1, page - 1))}
          disabled={page === 1}
          className="p-2 rounded-lg border border-ink-200 text-ink-500 hover:bg-ink-50 disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label="Previous page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        {pages.map((p, idx) => (
          <div key={p} className="flex items-center">
            {idx > 0 && pages[idx - 1] !== p - 1 && <span className="px-1 text-ink-300">…</span>}
            <button
              onClick={() => onChange(p)}
              className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                p === page ? "bg-primary-600 text-white" : "text-ink-600 hover:bg-ink-100"
              }`}
            >
              {p}
            </button>
          </div>
        ))}
        <button
          onClick={() => onChange(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
          className="p-2 rounded-lg border border-ink-200 text-ink-500 hover:bg-ink-50 disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label="Next page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
