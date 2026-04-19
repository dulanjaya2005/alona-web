import { useEffect, useState } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2, Save, Layers } from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import withAuth from '../../components/withAuth';
import Modal from '../../components/Modal';
import ConfirmDialog from '../../components/ConfirmDialog';
import EmptyState from '../../components/EmptyState';
import Spinner from '../../components/Spinner';
import api from '../../utils/api';

const ICON_OPTIONS = [
  'globe', 'code', 'smartphone', 'palette', 'cloud', 'cpu',
  'database', 'shield', 'zap', 'bar-chart', 'lock', 'settings',
];

const EMPTY_FORM = { title: '', description: '', icon: 'code' };

function ServicesPage() {
  const [services, setServices]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing]     = useState(null);
  const [form, setForm]           = useState(EMPTY_FORM);
  const [saving, setSaving]       = useState(false);
  const [confirmId, setConfirmId] = useState(null);
  const [deleting, setDeleting]   = useState(false);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await api.get('/services');
      setServices(res.data.services);
    } catch {
      toast.error('Failed to load services.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchServices(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  };

  const openEdit = (svc) => {
    setEditing(svc);
    setForm({ title: svc.title, description: svc.description, icon: svc.icon || 'code' });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim()) {
      toast.error('Title and description are required.');
      return;
    }
    setSaving(true);
    try {
      if (editing) {
        const res = await api.put(`/services/${editing.id}`, form);
        setServices((prev) => prev.map((s) => s.id === editing.id ? res.data.service : s));
        toast.success('Service updated!');
      } else {
        const res = await api.post('/services', form);
        setServices((prev) => [res.data.service, ...prev]);
        toast.success('Service created!');
      }
      setModalOpen(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save service.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmId) return;
    setDeleting(true);
    try {
      await api.delete(`/services/${confirmId}`);
      setServices((prev) => prev.filter((s) => s.id !== confirmId));
      toast.success('Service deleted.');
    } catch {
      toast.error('Failed to delete service.');
    } finally {
      setDeleting(false);
      setConfirmId(null);
    }
  };

  return (
    <>
      <Head><title>Services — Alona Admin</title></Head>

      <div className="max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-black" style={{ fontFamily: 'var(--font-display)' }}>Services</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              {services.length} service{services.length !== 1 ? 's' : ''} listed
            </p>
          </div>
          <button onClick={openCreate} className="btn-primary py-2.5 px-5 text-xs">
            <Plus size={15} /> Add Service
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24"><Spinner size={32} /></div>
        ) : services.length === 0 ? (
          <div className="admin-card">
            <EmptyState
              icon={Layers}
              title="No services yet"
              description="Add your first service to display it on the public Services page."
              action={
                <button onClick={openCreate} className="btn-outline text-sm mt-4">
                  <Plus size={14} /> Add First Service
                </button>
              }
            />
          </div>
        ) : (
          <div className="space-y-3">
            {services.map((svc, i) => (
              <motion.div
                key={svc.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="admin-card flex items-start gap-4 group"
              >
                <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded text-xs font-bold uppercase"
                  style={{ background: 'rgba(0,255,136,0.08)', border: '1px solid rgba(0,255,136,0.15)', color: 'var(--acid)', fontFamily: 'var(--font-mono)' }}>
                  {svc.icon?.slice(0, 2)}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-bold mb-1" style={{ fontFamily: 'var(--font-display)' }}>{svc.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{svc.description}</p>
                  <p className="text-xs mt-1.5" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', opacity: 0.4 }}>
                    icon: {svc.icon} · id: {svc.id}
                  </p>
                </div>

                <div className="flex gap-2 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEdit(svc)} title="Edit"
                    className="p-2 rounded transition-all"
                    style={{ color: 'var(--text-muted)', border: '1px solid var(--border)' }}
                    onMouseEnter={(e) => { e.currentTarget.style.color='var(--acid)'; e.currentTarget.style.borderColor='rgba(0,255,136,0.35)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color='var(--text-muted)'; e.currentTarget.style.borderColor='var(--border)'; }}>
                    <Pencil size={14} />
                  </button>
                  <button onClick={() => setConfirmId(svc.id)} title="Delete"
                    className="p-2 rounded transition-all"
                    style={{ color: 'var(--text-muted)', border: '1px solid var(--border)' }}
                    onMouseEnter={(e) => { e.currentTarget.style.color='#f87171'; e.currentTarget.style.borderColor='rgba(248,113,113,0.35)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color='var(--text-muted)'; e.currentTarget.style.borderColor='var(--border)'; }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? `Edit: ${editing.title}` : 'Add Service'}>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs mb-2" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', letterSpacing: '0.08em' }}>TITLE *</label>
            <input type="text" placeholder="e.g. Web Development" className="input-field" required
              value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </div>

          <div>
            <label className="block text-xs mb-2" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', letterSpacing: '0.08em' }}>DESCRIPTION *</label>
            <textarea placeholder="Brief description shown on the services page..." rows={4} className="input-field resize-none" required
              value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>

          <div>
            <label className="block text-xs mb-2" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', letterSpacing: '0.08em' }}>ICON KEY</label>
            <div className="flex flex-wrap gap-2">
              {ICON_OPTIONS.map((ico) => {
                const active = form.icon === ico;
                return (
                  <button key={ico} type="button" onClick={() => setForm({ ...form, icon: ico })}
                    className="px-3 py-1.5 text-xs rounded transition-all"
                    style={{
                      fontFamily: 'var(--font-mono)',
                      background: active ? 'var(--acid)' : 'rgba(255,255,255,0.04)',
                      color: active ? 'var(--bg)' : 'var(--text-muted)',
                      border: `1px solid ${active ? 'var(--acid)' : 'var(--border)'}`,
                      fontWeight: active ? 700 : 400,
                    }}>
                    {ico}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={saving} className="btn-primary flex-1 justify-center py-3">
              {saving ? <><Spinner size={16} /> Saving…</> : <><Save size={14} /> Save Service</>}
            </button>
            <button type="button" onClick={() => setModalOpen(false)} className="btn-outline px-6 py-3">Cancel</button>
          </div>
        </form>
      </Modal>

      {/* Delete confirm */}
      <ConfirmDialog
        isOpen={!!confirmId}
        title="Delete Service"
        message="This service will be removed from the public website. This cannot be undone."
        confirmLabel="Delete"
        danger
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setConfirmId(null)}
      />
    </>
  );
}

ServicesPage.getLayout = (page) => <AdminLayout>{page}</AdminLayout>;
export default withAuth(ServicesPage);
