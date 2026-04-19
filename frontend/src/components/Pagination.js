import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Pagination — reusable pagination bar.
 * @param {number} page        — current page (1-based)
 * @param {number} totalPages  — total pages
 * @param {number} total       — total record count
 * @param {number} limit       — records per page
 * @param {function} onChange  — called with new page number
 */
export default function Pagination({ page, totalPages, total, limit, onChange }) {
  if (totalPages <= 1) return null;

  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  // Build page range: always show first, last, current ±1
  const pages = new Set([1, totalPages, page, page - 1, page + 1].filter(p => p >= 1 && p <= totalPages));
  const sorted = [...pages].sort((a, b) => a - b);

  return (
    <div className="flex items-center justify-between flex-wrap gap-3 pt-4 mt-4"
      style={{ borderTop: '1px solid var(--border)' }}>
      <span className="text-xs" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
        {from}–{to} of {total}
      </span>

      <div className="flex items-center gap-1">
        {/* Prev */}
        <button
          onClick={() => onChange(page - 1)}
          disabled={page <= 1}
          className="w-7 h-7 flex items-center justify-center rounded transition-colors disabled:opacity-30"
          style={{ border: '1px solid var(--border)', color: 'var(--text-muted)' }}
          onMouseEnter={(e) => { if (page > 1) e.currentTarget.style.borderColor = 'rgba(0,255,136,0.3)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; }}
        >
          <ChevronLeft size={13} />
        </button>

        {/* Page buttons */}
        {sorted.map((p, i) => {
          const prev = sorted[i - 1];
          return (
            <span key={p} className="flex items-center gap-1">
              {prev && p - prev > 1 && (
                <span className="text-xs px-1" style={{ color: 'var(--text-muted)' }}>…</span>
              )}
              <button
                onClick={() => onChange(p)}
                className="w-7 h-7 flex items-center justify-center rounded text-xs transition-all"
                style={{
                  fontFamily: 'var(--font-mono)',
                  background: p === page ? 'var(--acid)' : 'transparent',
                  color: p === page ? 'var(--bg)' : 'var(--text-muted)',
                  border: `1px solid ${p === page ? 'var(--acid)' : 'var(--border)'}`,
                  fontWeight: p === page ? 700 : 400,
                }}
              >
                {p}
              </button>
            </span>
          );
        })}

        {/* Next */}
        <button
          onClick={() => onChange(page + 1)}
          disabled={page >= totalPages}
          className="w-7 h-7 flex items-center justify-center rounded transition-colors disabled:opacity-30"
          style={{ border: '1px solid var(--border)', color: 'var(--text-muted)' }}
          onMouseEnter={(e) => { if (page < totalPages) e.currentTarget.style.borderColor = 'rgba(0,255,136,0.3)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; }}
        >
          <ChevronRight size={13} />
        </button>
      </div>
    </div>
  );
}
