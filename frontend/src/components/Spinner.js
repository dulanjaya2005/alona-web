/**
 * Spinner — loading indicator
 * @param {number} size  — px size (default 24)
 * @param {string} color — CSS color (default var(--acid))
 */
export default function Spinner({ size = 24, color = 'var(--acid)', className = '' }) {
  return (
    <div
      className={`inline-block flex-shrink-0 ${className}`}
      style={{
        width: size,
        height: size,
        border: `2px solid ${color}30`,
        borderTopColor: color,
        borderRadius: '50%',
        animation: 'spin 0.65s linear infinite',
      }}
    />
  );
}
