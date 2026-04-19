import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, MessageSquare, Briefcase, Layers,
  LogOut, Zap, Bell, Menu, X, ChevronRight, Settings
} from 'lucide-react';
import useAuthStore from '../store/authStore';
import useNotificationStore from '../store/notificationStore';

const navItems = [
  { href: '/admin',          label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/messages', label: 'Messages',  icon: MessageSquare,  badge: true },
  { href: '/admin/services', label: 'Services',  icon: Layers },
  { href: '/admin/projects', label: 'Projects',  icon: Briefcase },
  { href: '/admin/settings', label: 'Settings',  icon: Settings },
];

export default function AdminLayout({ children }) {
  const router = useRouter();
  const { admin, logout } = useAuthStore();
  const { unreadCount, fetchUnreadCount, startPolling } = useNotificationStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    fetchUnreadCount();
    const stop = startPolling();
    return stop;
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/admin/login');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b" style={{ borderColor: 'var(--border)' }}>
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 flex items-center justify-center"
            style={{ background: 'var(--acid)', clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))' }}>
            <Zap size={13} color="#0a0a0f" strokeWidth={2.5} />
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800 }}>
            ALONA <span style={{ color: 'var(--acid)', fontSize: '0.7rem', fontFamily: 'var(--font-mono)' }}>ADMIN</span>
          </span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(({ href, label, icon: Icon, badge }) => {
          const isActive = router.pathname === href;
          return (
            <Link key={href} href={href} onClick={() => setSidebarOpen(false)}>
              <div className={`admin-sidebar-item ${isActive ? 'active' : ''}`}>
                <Icon size={16} />
                <span className="flex-1">{label}</span>
                {badge && unreadCount > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full text-xs font-bold"
                    style={{ background: 'var(--acid)', color: 'var(--bg)', fontFamily: 'var(--font-mono)', minWidth: '20px', textAlign: 'center' }}>
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
                {isActive && <ChevronRight size={14} style={{ color: 'var(--acid)' }} />}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="p-4 border-t" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-3 mb-3 px-2">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
            style={{ background: 'rgba(0,255,136,0.15)', color: 'var(--acid)', fontFamily: 'var(--font-display)' }}>
            {admin?.username?.[0]?.toUpperCase() || 'A'}
          </div>
          <div>
            <div className="text-sm font-semibold">{admin?.username || 'Admin'}</div>
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Administrator</div>
          </div>
        </div>
        <button onClick={handleLogout} className="admin-sidebar-item w-full text-left" style={{ color: 'rgba(255,80,80,0.7)' }}>
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--bg)', fontFamily: 'var(--font-body)' }}>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-60 flex-shrink-0 border-r" style={{ background: 'var(--bg2)', borderColor: 'var(--border)' }}>
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 md:hidden"
              style={{ background: 'rgba(0,0,0,0.6)' }}
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -240 }} animate={{ x: 0 }} exit={{ x: -240 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed left-0 top-0 bottom-0 z-50 w-60 flex flex-col md:hidden border-r"
              style={{ background: 'var(--bg2)', borderColor: 'var(--border)' }}
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-14 flex items-center justify-between px-6 border-b sticky top-0 z-30"
          style={{ background: 'rgba(17,17,24,0.95)', borderColor: 'var(--border)', backdropFilter: 'blur(12px)' }}>
          <button className="md:hidden p-1" onClick={() => setSidebarOpen(true)} style={{ color: 'var(--text-muted)' }}>
            <Menu size={20} />
          </button>
          <div className="hidden md:block" />

          <div className="flex items-center gap-3">
            {/* Notification bell */}
            <div className="relative">
              <Link href="/admin/messages">
                <button className="p-2 rounded transition-colors" style={{ color: 'var(--text-muted)' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = 'var(--acid)'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}>
                  <Bell size={18} />
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold"
                      style={{ background: 'var(--acid)', color: 'var(--bg)', fontFamily: 'var(--font-mono)' }}>
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>
              </Link>
            </div>
            <Link href="/" className="text-xs px-3 py-1.5 rounded transition-all"
              style={{ border: '1px solid var(--border)', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--acid)'; e.currentTarget.style.color = 'var(--acid)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)'; }}>
              ← View Site
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
