import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  MessageSquare, Layers, Briefcase, Mail,
  CheckCircle, Clock, ArrowRight, TrendingUp, Eye,
} from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import withAuth from '../../components/withAuth';
import Spinner from '../../components/Spinner';
import { StatusBadge } from '../../components/Tag';
import api from '../../utils/api';

/* ── Stat card ── */
function StatCard({ icon: Icon, label, value, sub, color = 'var(--acid)', href, delay = 0 }) {
  const inner = (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.45 }}
      className="admin-card group cursor-default transition-all duration-200"
      style={{ borderColor: 'var(--border)' }}
      onMouseEnter={(e) => href && (e.currentTarget.style.borderColor = color + '40')}
      onMouseLeave={(e) => href && (e.currentTarget.style.borderColor = 'var(--border)')}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="w-9 h-9 flex items-center justify-center rounded"
          style={{ background: `${color}14`, border: `1px solid ${color}28` }}>
          <Icon size={16} style={{ color }} />
        </div>
        {href && <ArrowRight size={13} style={{ color: 'var(--text-muted)', opacity: 0 }} className="group-hover:opacity-100 transition-opacity" />}
      </div>
      <div className="text-3xl font-black mb-0.5" style={{ fontFamily: 'var(--font-display)', color }}>
        {value === null ? <Spinner size={22} color={color} /> : value}
      </div>
      <div className="font-semibold text-sm" style={{ fontFamily: 'var(--font-display)' }}>{label}</div>
      {sub && <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{sub}</div>}
    </motion.div>
  );
  return href ? <Link href={href}>{inner}</Link> : inner;
}

/* ── Message row ── */
function MessageRow({ msg }) {
  const status = msg.reply ? 'replied' : msg.is_read ? 'read' : 'unread';
  return (
    <Link href="/admin/messages">
      <div className="flex items-start gap-3 px-4 py-3 rounded cursor-pointer transition-colors hover:bg-white/5 group">
        {/* Unread dot */}
        <div className="mt-1.5 flex-shrink-0">
          {!msg.is_read
            ? <div className="w-2 h-2 rounded-full" style={{ background: 'var(--acid)' }} />
            : <div className="w-2 h-2 rounded-full" style={{ background: 'var(--border)' }} />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="font-semibold text-sm truncate" style={{ fontFamily: 'var(--font-display)' }}>
              {msg.name}
            </span>
            <span className="text-xs flex-shrink-0" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              {new Date(msg.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
          </div>
          <div className="text-xs truncate mt-0.5" style={{ color: 'var(--acid)', opacity: 0.8 }}>{msg.email}</div>
          <div className="text-xs truncate mt-0.5" style={{ color: 'var(--text-muted)' }}>{msg.message}</div>
          <div className="mt-1.5"><StatusBadge status={status} /></div>
        </div>
      </div>
    </Link>
  );
}

/* ── Dashboard ── */
function AdminDashboard() {
  const [stats, setStats]               = useState(null);
  const [recentMessages, setMessages]   = useState([]);
  const [loadingMsgs, setLoadingMsgs]   = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [sRes, mRes] = await Promise.all([
          api.get('/messages/stats'),
          api.get('/messages', { params: { page: 1, limit: 6 } }),
        ]);
        setStats(sRes.data.stats);
        setMessages(mRes.data.messages || []);
      } catch {
        toast.error('Failed to load dashboard data.');
      } finally {
        setLoadingMsgs(false);
      }
    };
    load();
  }, []);

  const quickActions = [
    { label: 'View Messages',   sub: `${stats?.unreadMessages ?? '…'} unread`,  href: '/admin/messages', icon: MessageSquare, color: 'var(--acid)'  },
    { label: 'Manage Services', sub: `${stats?.totalServices  ?? '…'} services`, href: '/admin/services', icon: Layers,         color: '#818cf8'      },
    { label: 'Manage Projects', sub: `${stats?.totalProjects  ?? '…'} projects`, href: '/admin/projects', icon: Briefcase,      color: '#22d3ee'      },
  ];

  return (
    <>
      <Head><title>Dashboard — Alona Admin</title></Head>

      <div className="max-w-5xl space-y-6">

        {/* Page header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-black" style={{ fontFamily: 'var(--font-display)' }}>Dashboard</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </motion.div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={MessageSquare} label="Total Messages"  value={stats?.totalMessages}  sub="All time"         delay={0}    href="/admin/messages" />
          <StatCard icon={Mail}          label="Unread"          value={stats?.unreadMessages} sub="Need attention"   delay={0.05} href="/admin/messages" color="#fbbf24" />
          <StatCard icon={Briefcase}     label="Projects"        value={stats?.totalProjects}  sub="In portfolio"     delay={0.1}  href="/admin/projects" color="#818cf8" />
          <StatCard icon={Layers}        label="Services"        value={stats?.totalServices}  sub="Live on site"     delay={0.15} href="/admin/services" color="#22d3ee" />
        </div>

        {/* Quick actions + recent messages */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* Quick actions */}
          <div className="space-y-3">
            <h2 className="text-sm font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              Quick Actions
            </h2>
            {quickActions.map(({ label, sub, href, icon: Icon, color }, i) => (
              <motion.div key={href} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.06 }}>
                <Link href={href}>
                  <div className="admin-card flex items-center gap-3 cursor-pointer group transition-all"
                    style={{ padding: '14px 16px' }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = color + '40'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; }}>
                    <div className="w-9 h-9 flex items-center justify-center rounded flex-shrink-0"
                      style={{ background: color + '14', border: `1px solid ${color}28` }}>
                      <Icon size={16} style={{ color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm" style={{ fontFamily: 'var(--font-display)' }}>{label}</div>
                      <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{sub}</div>
                    </div>
                    <ArrowRight size={14} style={{ color: 'var(--text-muted)', flexShrink: 0 }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </Link>
              </motion.div>
            ))}

            {/* Site links */}
            <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.38 }}>
              <div className="admin-card" style={{ padding: '14px 16px' }}>
                <div className="text-xs font-bold mb-3" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  Public Pages
                </div>
                <div className="space-y-1.5">
                  {['/', '/services', '/projects', '/contact'].map((path) => (
                    <a key={path} href={path} target="_blank" rel="noreferrer"
                      className="flex items-center justify-between text-xs px-2 py-1.5 rounded transition-colors hover:bg-white/5 group"
                      style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                      {path === '/' ? '/home' : path}
                      <Eye size={11} className="opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--acid)' }} />
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Recent messages */}
          <motion.div
            className="lg:col-span-2 admin-card overflow-hidden"
            style={{ padding: 0 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <div className="flex items-center justify-between px-4 pt-4 pb-3"
              style={{ borderBottom: '1px solid var(--border)' }}>
              <h2 className="font-bold" style={{ fontFamily: 'var(--font-display)' }}>Recent Messages</h2>
              <Link href="/admin/messages"
                className="text-xs flex items-center gap-1 transition-colors"
                style={{ color: 'var(--acid)', fontFamily: 'var(--font-mono)' }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}>
                View all <ArrowRight size={11} />
              </Link>
            </div>

            {loadingMsgs ? (
              <div className="flex items-center justify-center py-12">
                <Spinner size={24} />
              </div>
            ) : recentMessages.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center px-6">
                <Mail size={28} style={{ color: 'var(--text-muted)', opacity: 0.25, marginBottom: 10 }} />
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No messages yet</p>
                <p className="text-xs mt-1" style={{ color: 'var(--text-muted)', opacity: 0.6 }}>
                  They'll appear here when visitors submit the contact form.
                </p>
              </div>
            ) : (
              <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
                {recentMessages.map((msg) => (
                  <MessageRow key={msg.id} msg={msg} />
                ))}
              </div>
            )}

            {recentMessages.length > 0 && (
              <div className="px-4 py-3" style={{ borderTop: '1px solid var(--border)' }}>
                <Link href="/admin/messages">
                  <button className="w-full text-xs py-2 rounded transition-all"
                    style={{ border: '1px solid var(--border)', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(0,255,136,0.3)'; e.currentTarget.style.color = 'var(--acid)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)'; }}>
                    View all messages →
                  </button>
                </Link>
              </div>
            )}
          </motion.div>
        </div>

        {/* Summary bar */}
        <motion.div
          className="admin-card"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          style={{ padding: '14px 20px' }}
        >
          <div className="flex flex-wrap gap-6 items-center">
            <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
              <CheckCircle size={13} style={{ color: 'var(--acid)' }} />
              <span>{stats?.repliedMessages ?? '…'} replied</span>
            </div>
            <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
              <Clock size={13} style={{ color: '#fbbf24' }} />
              <span>{stats?.unreadMessages ?? '…'} awaiting reply</span>
            </div>
            <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
              <TrendingUp size={13} style={{ color: '#818cf8' }} />
              <span>{stats?.totalMessages ?? '…'} total enquiries</span>
            </div>
            <div className="ml-auto">
              <Link href="/admin/messages">
                <button className="btn-primary py-1.5 px-4 text-xs">
                  Open Inbox <ArrowRight size={12} />
                </button>
              </Link>
            </div>
          </div>
        </motion.div>

      </div>
    </>
  );
}

AdminDashboard.getLayout = (page) => <AdminLayout>{page}</AdminLayout>;
export default withAuth(AdminDashboard);
