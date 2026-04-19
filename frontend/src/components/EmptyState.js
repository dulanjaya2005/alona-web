import { motion } from 'framer-motion';

/**
 * EmptyState — displayed when lists have no items.
 */
export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-20 text-center"
    >
      {Icon && (
        <div
          className="w-16 h-16 flex items-center justify-center rounded-full mb-4"
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid var(--border)',
          }}
        >
          <Icon size={28} style={{ color: 'var(--text-muted)', opacity: 0.5 }} />
        </div>
      )}
      <h3
        className="text-lg font-bold mb-2"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        {title}
      </h3>
      {description && (
        <p
          className="text-sm mb-6 max-w-xs"
          style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}
        >
          {description}
        </p>
      )}
      {action}
    </motion.div>
  );
}
