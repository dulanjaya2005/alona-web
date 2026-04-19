import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

/**
 * ConfirmDialog — replaces native confirm() with a styled modal.
 * Usage:
 *   <ConfirmDialog
 *     isOpen={confirmOpen}
 *     title="Delete Service"
 *     message="Are you sure you want to delete this service? This cannot be undone."
 *     confirmLabel="Delete"
 *     danger
 *     onConfirm={handleConfirmedDelete}
 *     onCancel={() => setConfirmOpen(false)}
 *   />
 */
export default function ConfirmDialog({
  isOpen,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  danger = false,
  onConfirm,
  onCancel,
  loading = false,
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)' }}
          onClick={onCancel}
        >
          <motion.div
            initial={{ scale: 0.88, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.88, opacity: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 350 }}
            className="admin-card w-full max-w-sm text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="w-12 h-12 flex items-center justify-center rounded-full mx-auto mb-4"
              style={{
                background: danger ? 'rgba(255,68,68,0.1)' : 'rgba(0,255,136,0.1)',
                border: `1px solid ${danger ? 'rgba(255,68,68,0.3)' : 'rgba(0,255,136,0.3)'}`,
              }}
            >
              <AlertTriangle size={22} style={{ color: danger ? '#ff4444' : 'var(--acid)' }} />
            </div>

            <h3 className="text-lg font-bold mb-2" style={{ fontFamily: 'var(--font-display)' }}>
              {title}
            </h3>
            <p className="text-sm mb-6" style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>
              {message}
            </p>

            <div className="flex gap-3">
              <button
                onClick={onCancel}
                className="btn-outline flex-1 py-2.5 text-sm"
                disabled={loading}
              >
                {cancelLabel}
              </button>
              <button
                onClick={onConfirm}
                disabled={loading}
                className="flex-1 py-2.5 text-sm font-bold flex items-center justify-center gap-2 transition-all"
                style={{
                  background: danger ? '#ff4444' : 'var(--acid)',
                  color: '#fff',
                  fontFamily: 'var(--font-display)',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))',
                  opacity: loading ? 0.7 : 1,
                }}
              >
                {loading ? (
                  <span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} />
                ) : confirmLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
