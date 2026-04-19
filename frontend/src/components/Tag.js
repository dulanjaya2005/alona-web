/**
 * Tag — small label chip (for tech stacks, status indicators, etc.)
 */
export function Tag({ children, color = 'acid', className = '' }) {
  const palettes = {
    acid: { bg: 'rgba(0,255,136,0.07)', border: 'rgba(0,255,136,0.18)', text: 'var(--acid)' },
    indigo: { bg: 'rgba(99,102,241,0.1)', border: 'rgba(99,102,241,0.25)', text: '#818cf8' },
    amber: { bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.25)', text: '#fbbf24' },
    red: { bg: 'rgba(255,68,68,0.1)', border: 'rgba(255,68,68,0.25)', text: '#f87171' },
    cyan: { bg: 'rgba(6,182,212,0.1)', border: 'rgba(6,182,212,0.25)', text: '#22d3ee' },
    muted: { bg: 'rgba(255,255,255,0.05)', border: 'rgba(255,255,255,0.1)', text: 'var(--text-muted)' },
  };

  const { bg, border, text } = palettes[color] ?? palettes.acid;

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 text-xs rounded ${className}`}
      style={{
        background: bg,
        border: `1px solid ${border}`,
        color: text,
        fontFamily: 'var(--font-mono)',
        lineHeight: 1.6,
      }}
    >
      {children}
    </span>
  );
}

/**
 * StatusBadge — read/unread/replied indicator
 */
export function StatusBadge({ status }) {
  const map = {
    unread: { label: 'Unread', color: 'amber' },
    read: { label: 'Read', color: 'muted' },
    replied: { label: 'Replied', color: 'acid' },
  };

  const { label, color } = map[status] ?? map.read;
  return <Tag color={color}>{label}</Tag>;
}
