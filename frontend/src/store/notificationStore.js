import { create } from 'zustand';
import api from '../utils/api';

const useNotificationStore = create((set, get) => ({
  unreadCount: 0,
  lastChecked: null,

  fetchUnreadCount: async () => {
    try {
      const res = await api.get('/messages/stats');
      set({ unreadCount: res.data.stats.unreadMessages });
    } catch {}
  },

  startPolling: () => {
    // Poll every 30 seconds for new messages
    const interval = setInterval(async () => {
      try {
        const res = await api.get('/messages/stats');
        const newCount = res.data.stats.unreadMessages;
        const prev = get().unreadCount;
        if (newCount > prev) {
          // Play notification sound
          if (typeof window !== 'undefined' && window.AudioContext) {
            try {
              const ctx = new (window.AudioContext || window.webkitAudioContext)();
              const osc = ctx.createOscillator();
              const gain = ctx.createGain();
              osc.connect(gain);
              gain.connect(ctx.destination);
              osc.frequency.value = 880;
              osc.type = 'sine';
              gain.gain.setValueAtTime(0.3, ctx.currentTime);
              gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
              osc.start(ctx.currentTime);
              osc.stop(ctx.currentTime + 0.3);
            } catch {}
          }
        }
        set({ unreadCount: newCount });
      } catch {}
    }, 30000);

    return () => clearInterval(interval);
  },

  decrementUnread: () => set((state) => ({ unreadCount: Math.max(0, state.unreadCount - 1) })),
  resetUnread: () => set({ unreadCount: 0 }),
}));

export default useNotificationStore;
