import { useEffect, useState, useCallback } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  Search, Trash2, CheckCheck, Circle,
  X, Send, Mail, Clock, RefreshCw,
} from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import withAuth from '../../components/withAuth';
import Pagination from '../../components/Pagination';
import ConfirmDialog from '../../components/ConfirmDialog';
import EmptyState from '../../components/EmptyState';
import Spinner from '../../components/Spinner';
import { StatusBadge } from '../../components/Tag';
import useNotificationStore from '../../store/notificationStore';
import api from '../../utils/api';

const FILTERS = [
  { value: 'all',     label: 'All'     },
  { value: 'unread',  label: 'Unread'  },
  { value: 'read',    label: 'Read'    },
  { value: 'replied', label: 'Replied' },
];

const LIMIT = 10;

function MessagesPage() {
  const [messages, setMessages]     = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [search, setSearch]         = useState('');
  const [filter, setFilter]         = useState('all');
  const [loading, setLoading]       = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [selected, setSelected]     = useState(null);
  const [replyText, setReplyText]   = useState('');
  const [replySaving, setReplySaving] = useState(false);

  const [confirmId, setConfirmId]   = useState(null);
  const [deleting, setDeleting]     = useState(false);

  const { fetchUnreadCount } = useNotificationStore();

  /* ── fetch ── */
  const fetchMessages = useCallback(async (page = 1, showRefresh = false) => {
    if (showRefresh) setRefreshing(true); else setLoading(true);
    try {
      const res = await api.get('/messages', {
        params: { page, limit: LIMIT, search, filter },
      });
      setMessages(res.data.messages);
      setPagination(res.data.pagination);
    } catch {
      toast.error('Failed to load messages.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [search, filter]);

  useEffect(() => {
    const t = setTimeout(() => fetchMessages(1), 300);
    return () => clearTimeout(t);
  }, [search, filter]);

  /* ── open message ── */
  const openMessage = async (msg) => {
    setSelected(msg);
    setReplyText(msg.reply || '');
    if (!msg.is_read) {
      try {
        await api.patch(`/messages/${msg.id}/read`);
        setMessages((prev) => prev.map((m) => m.id === msg.id ? { ...m, is_read: 1 } : m));
        fetchUnreadCount();
      } catch {}
    }
  };

  /* ── toggle read ── */
  const toggleRead = async (msg, e) => {
    e.stopPropagation();
    const endpoint = msg.is_read ? 'unread' : 'read';
    try {
      await api.patch(`/messages/${msg.id}/${endpoint}`);
      const updated = { ...msg, is_read: msg.is_read ? 0 : 1 };
      setMessages((prev) => prev.map((m) => m.id === msg.id ? updated : m));
      if (selected?.id === msg.id) setSelected(updated);
      fetchUnreadCount();
    } catch {
      toast.error('Failed to update read status.');
    }
  };

  /* ── delete ── */
  const handleDelete = async () => {
    if (!confirmId) return;
    setDeleting(true);
    try {
      await api.delete(`/messages/${confirmId}`);
      setMessages((prev) => prev.filter((m) => m.id !== confirmId));
      if (selected?.id === confirmId) setSelected(null);
      fetchUnreadCount();
      toast.success('Message deleted.');
      // Refresh current page
      fetchMessages(pagination.page, false);
    } catch {
      toast.error('Failed to delete message.');
    } finally {
      setDeleting(false);
      setConfirmId(null);
    }
  };

  /* ── reply ── */
  const saveReply = async () => {
    if (!replyText.trim()) { toast.error('Reply cannot be empty.'); return; }
    setReplySaving(true);
    try {
      await api.post('/reply', { messageId: selected.id, reply: replyText });
      const now = new Date().toISOString();
      const updated = { ...selected, reply: replyText, is_read: 1, replied_at: now };
      setSelected(updated);
      setMessages((prev) => prev.map((m) => m.id === selected.id ? updated : m));
      toast.success('Reply saved!');
    } catch {
      toast.error('Failed to save reply.');
    } finally {
      setReplySaving(false);
    }
  };

  /* ── helpers ── */
  const fmtDate  = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const fmtTime  = (d) => new Date(d).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  const msgStatus = (m) => m.reply ? 'replied' : m.is_read ? 'read' : 'unread';

  /* ── render ── */
  return (
    <>
      <Head><title>Messages — Alona Admin</title></Head>

      <div style={{ maxWidth: '1200px' }}>
        {/* Header */}
        <div className="flex items-center justify-between mb-5 gap-3 flex-wrap">
          <div>
            <h1 className="text-3xl font-black" style={{ fontFamily: 'var(--font-display)' }}>Messages</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              {pagination.total} message{pagination.total !== 1 ? 's' : ''} total
            </p>
          </div>
          <button onClick={() => fetchMessages(pagination.page, true)} disabled={refreshing}
            className="flex items-center gap-2 px-3 py-2 rounded text-sm transition-colors"
            style={{ border: '1px solid var(--border)', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}
            onMouseEnter={(e) => { e.currentTarget.style.color='var(--acid)'; e.currentTarget.style.borderColor='rgba(0,255,136,0.3)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color='var(--text-muted)'; e.currentTarget.style.borderColor='var(--border)'; }}>
            <RefreshCw size={13} className={refreshing ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>

        {/* Filter bar */}
        <div className="flex flex-wrap gap-3 mb-5">
          <div className="relative flex-1 min-w-48 max-w-xs">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search name, email, message…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field text-sm py-2 pl-9"
            />
          </div>
          <div className="flex gap-1.5">
            {FILTERS.map((f) => {
              const active = filter === f.value;
              return (
                <button key={f.value} onClick={() => setFilter(f.value)}
                  className="px-3 py-2 text-xs rounded transition-all"
                  style={{
                    fontFamily: 'var(--font-mono)',
                    background: active ? 'var(--acid)' : 'rgba(255,255,255,0.04)',
                    color: active ? 'var(--bg)' : 'var(--text-muted)',
                    border: `1px solid ${active ? 'var(--acid)' : 'var(--border)'}`,
                    fontWeight: active ? 700 : 400,
                  }}>
                  {f.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Two-panel layout */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          {/* ── Left: list ── */}
          <div className="lg:col-span-2 admin-card p-0 overflow-hidden flex flex-col" style={{ minHeight: '520px' }}>
            {loading ? (
              <div className="flex-1 flex items-center justify-center">
                <Spinner size={28} />
              </div>
            ) : messages.length === 0 ? (
              <div className="flex-1">
                <EmptyState
                  icon={Mail}
                  title="No messages found"
                  description={search || filter !== 'all' ? 'Try a different search or filter.' : 'When visitors submit the contact form, messages appear here.'}
                />
              </div>
            ) : (
              <>
                <div className="flex-1 divide-y overflow-y-auto" style={{ borderColor: 'var(--border)' }}>
                  {messages.map((msg) => (
                    <button
                      key={msg.id}
                      onClick={() => openMessage(msg)}
                      className="w-full text-left p-4 transition-colors relative group"
                      style={{ background: selected?.id === msg.id ? 'rgba(255,255,255,0.05)' : 'transparent' }}
                      onMouseEnter={(e) => { if (selected?.id !== msg.id) e.currentTarget.style.background='rgba(255,255,255,0.025)'; }}
                      onMouseLeave={(e) => { if (selected?.id !== msg.id) e.currentTarget.style.background='transparent'; }}
                    >
                      {/* Unread dot */}
                      {!msg.is_read && (
                        <span className="absolute left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full flex-shrink-0"
                          style={{ background: 'var(--acid)' }} />
                      )}

                      <div className="pl-3 pr-8">
                        <div className="flex items-center justify-between gap-1 mb-0.5">
                          <span className="text-sm font-semibold truncate" style={{ fontFamily: 'var(--font-display)', opacity: msg.is_read ? 0.7 : 1 }}>
                            {msg.name}
                          </span>
                          <span className="text-xs flex-shrink-0" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                            {fmtDate(msg.created_at)}
                          </span>
                        </div>
                        <div className="text-xs truncate mb-1" style={{ color: 'var(--acid)' }}>{msg.email}</div>
                        <div className="text-xs truncate mb-2" style={{ color: 'var(--text-muted)' }}>{msg.message}</div>
                        <StatusBadge status={msgStatus(msg)} />
                      </div>

                      {/* Row actions (appear on hover) */}
                      <div className="absolute right-3 top-3 hidden group-hover:flex gap-1"
                        onClick={(e) => e.stopPropagation()}>
                        <button onClick={(e) => toggleRead(msg, e)} title={msg.is_read ? 'Mark unread' : 'Mark read'}
                          className="p-1 rounded transition-colors"
                          style={{ color: 'var(--text-muted)' }}
                          onMouseEnter={(e) => e.currentTarget.style.color='var(--acid)'}
                          onMouseLeave={(e) => e.currentTarget.style.color='var(--text-muted)'}>
                          {msg.is_read ? <Circle size={13} /> : <CheckCheck size={13} />}
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); setConfirmId(msg.id); }} title="Delete"
                          className="p-1 rounded transition-colors"
                          style={{ color: 'var(--text-muted)' }}
                          onMouseEnter={(e) => e.currentTarget.style.color='#f87171'}
                          onMouseLeave={(e) => e.currentTarget.style.color='var(--text-muted)'}>
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Pagination */}
                <div className="px-4 pb-4">
                  <Pagination
                    page={pagination.page}
                    totalPages={pagination.totalPages}
                    total={pagination.total}
                    limit={LIMIT}
                    onChange={(p) => fetchMessages(p)}
                  />
                </div>
              </>
            )}
          </div>

          {/* ── Right: detail / reply ── */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              {selected ? (
                <motion.div
                  key={selected.id}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.22 }}
                  className="admin-card"
                >
                  {/* Detail header */}
                  <div className="flex items-start justify-between mb-5 gap-3">
                    <div>
                      <h3 className="text-lg font-bold mb-0.5" style={{ fontFamily: 'var(--font-display)' }}>
                        {selected.name}
                      </h3>
                      <a href={`mailto:${selected.email}`} className="text-sm hover:underline" style={{ color: 'var(--acid)' }}>
                        {selected.email}
                      </a>
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <Clock size={11} style={{ color: 'var(--text-muted)' }} />
                        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                          {fmtTime(selected.created_at)}
                        </span>
                        <span className="mx-1" style={{ color: 'var(--border)' }}>·</span>
                        <StatusBadge status={msgStatus(selected)} />
                      </div>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button onClick={(e) => toggleRead(selected, e)} title={selected.is_read ? 'Mark unread' : 'Mark read'}
                        className="p-2 rounded transition-all text-xs flex items-center gap-1.5"
                        style={{ border: '1px solid var(--border)', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}
                        onMouseEnter={(e) => { e.currentTarget.style.borderColor='rgba(0,255,136,0.35)'; e.currentTarget.style.color='var(--acid)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.borderColor='var(--border)'; e.currentTarget.style.color='var(--text-muted)'; }}>
                        {selected.is_read ? <Circle size={12} /> : <CheckCheck size={12} />}
                        <span className="hidden sm:inline">{selected.is_read ? 'Unread' : 'Read'}</span>
                      </button>
                      <button onClick={() => setConfirmId(selected.id)} title="Delete"
                        className="p-2 rounded transition-all"
                        style={{ border: '1px solid var(--border)', color: 'var(--text-muted)' }}
                        onMouseEnter={(e) => { e.currentTarget.style.borderColor='rgba(248,113,113,0.35)'; e.currentTarget.style.color='#f87171'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.borderColor='var(--border)'; e.currentTarget.style.color='var(--text-muted)'; }}>
                        <Trash2 size={14} />
                      </button>
                      <button onClick={() => setSelected(null)} title="Close"
                        style={{ color: 'var(--text-muted)' }}
                        onMouseEnter={(e) => e.currentTarget.style.color='var(--text)'}
                        onMouseLeave={(e) => e.currentTarget.style.color='var(--text-muted)'}>
                        <X size={18} />
                      </button>
                    </div>
                  </div>

                  {/* Message body */}
                  <div className="p-4 rounded mb-5 text-sm leading-relaxed"
                    style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid var(--border)', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                    {selected.message}
                  </div>

                  {/* Existing reply display */}
                  {selected.reply && (
                    <div className="mb-5 p-4 rounded"
                      style={{ background: 'rgba(0,255,136,0.04)', border: '1px solid rgba(0,255,136,0.15)' }}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold" style={{ color: 'var(--acid)', fontFamily: 'var(--font-mono)', letterSpacing: '0.08em' }}>
                          YOUR REPLY
                        </span>
                        {selected.replied_at && (
                          <span className="text-xs" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                            {fmtTime(selected.replied_at)}
                          </span>
                        )}
                      </div>
                      <p className="text-sm leading-relaxed" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                        {selected.reply}
                      </p>
                    </div>
                  )}

                  {/* Reply composer */}
                  <div>
                    <label className="block text-xs mb-2"
                      style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', letterSpacing: '0.08em' }}>
                      {selected.reply ? 'EDIT REPLY' : 'WRITE REPLY'}
                    </label>
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      rows={5}
                      className="input-field resize-none mb-3"
                      placeholder="Type your reply here… (saved to database — not emailed)"
                    />
                    <button onClick={saveReply} disabled={replySaving} className="btn-primary">
                      {replySaving ? <><Spinner size={15} /> Saving…</> : <><Send size={14} /> Save Reply</>}
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="empty-detail"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="admin-card flex flex-col items-center justify-center"
                  style={{ minHeight: '320px' }}
                >
                  <Mail size={36} style={{ color: 'var(--text-muted)', marginBottom: '12px', opacity: 0.25 }} />
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    Select a message to read and reply
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Delete confirm */}
      <ConfirmDialog
        isOpen={!!confirmId}
        title="Delete Message"
        message="This message and any reply will be permanently deleted. This cannot be undone."
        confirmLabel="Delete"
        danger
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setConfirmId(null)}
      />
    </>
  );
}

MessagesPage.getLayout = (page) => <AdminLayout>{page}</AdminLayout>;
export default withAuth(MessagesPage);
