import { useEffect, useState } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2, Save, Briefcase, ExternalLink, Github, Search } from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import withAuth from '../../components/withAuth';
import Modal from '../../components/Modal';
import ConfirmDialog from '../../components/ConfirmDialog';
import EmptyState from '../../components/EmptyState';
import Spinner from '../../components/Spinner';
import { Tag } from '../../components/Tag';
import api from '../../utils/api';

const EMPTY_FORM = {
  title: '', description: '', image: '',
  tech_stack: '', demo_url: '', github_url: '',
};

/* Small labelled input */
function Field({ label, required, children }) {
  return (
    <div>
      <label className="block text-xs mb-2"
        style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', letterSpacing: '0.08em' }}>
        {label}{required && ' *'}
      </label>
      {children}
    </div>
  );
}

function ProjectsPage() {
  const [projects, setProjects]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing]     = useState(null);
  const [form, setForm]           = useState(EMPTY_FORM);
  const [saving, setSaving]       = useState(false);
  const [confirmId, setConfirmId] = useState(null);
  const [deleting, setDeleting]   = useState(false);

  /* ── data ── */
  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await api.get('/projects');
      setProjects(res.data.projects);
    } catch {
      toast.error('Failed to load projects.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProjects(); }, []);

  const filtered = projects.filter((p) => {
    const q = search.toLowerCase();
    return !q || p.title.toLowerCase().includes(q) || p.tech_stack.toLowerCase().includes(q);
  });

  /* ── modal helpers ── */
  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  };

  const openEdit = (proj) => {
    setEditing(proj);
    setForm({
      title:      proj.title,
      description: proj.description,
      image:      proj.image      || '',
      tech_stack: proj.tech_stack,
      demo_url:   proj.demo_url   || '',
      github_url: proj.github_url || '',
    });
    setModalOpen(true);
  };

  /* ── save ── */
  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim() || !form.tech_stack.trim()) {
      toast.error('Title, description, and tech stack are required.');
      return;
    }
    setSaving(true);
    try {
      if (editing) {
        const res = await api.put(`/projects/${editing.id}`, form);
        setProjects((prev) => prev.map((p) => p.id === editing.id ? res.data.project : p));
        toast.success('Project updated!');
      } else {
        const res = await api.post('/projects', form);
        setProjects((prev) => [res.data.project, ...prev]);
        toast.success('Project created!');
      }
      setModalOpen(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save project.');
    } finally {
      setSaving(false);
    }
  };

  /* ── delete ── */
  const handleDelete = async () => {
    if (!confirmId) return;
    setDeleting(true);
    try {
      await api.delete(`/projects/${confirmId}`);
      setProjects((prev) => prev.filter((p) => p.id !== confirmId));
      toast.success('Project deleted.');
    } catch {
      toast.error('Failed to delete project.');
    } finally {
      setDeleting(false);
      setConfirmId(null);
    }
  };

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  /* ── render ── */
  return (
    <>
      <Head><title>Projects — Alona Admin</title></Head>

      <div className="max-w-5xl">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 flex-wrap mb-6">
          <div>
            <h1 className="text-3xl font-black" style={{ fontFamily: 'var(--font-display)' }}>Projects</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              {projects.length} project{projects.length !== 1 ? 's' : ''} in portfolio
            </p>
          </div>
          <div className="flex gap-3 flex-wrap items-center">
            {/* Search */}
            <div className="relative">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="Search…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-field text-sm py-2 pl-8 pr-3 w-44"
              />
            </div>
            <button onClick={openCreate} className="btn-primary py-2.5 px-5 text-xs">
              <Plus size={15} /> Add Project
            </button>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-24"><Spinner size={32} /></div>
        ) : filtered.length === 0 ? (
          <div className="admin-card">
            <EmptyState
              icon={Briefcase}
              title={search ? 'No projects match your search' : 'No projects yet'}
              description={search ? 'Try a different search term.' : 'Add your first project to populate the portfolio page.'}
              action={!search && (
                <button onClick={openCreate} className="btn-outline text-sm mt-4">
                  <Plus size={14} /> Add First Project
                </button>
              )}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((proj, i) => (
              <motion.div
                key={proj.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="admin-card overflow-hidden p-0 group"
              >
                {/* Thumbnail */}
                <div className="relative overflow-hidden" style={{ height: '140px', background: 'var(--bg3)' }}>
                  {proj.image ? (
                    <img src={proj.image} alt={proj.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Briefcase size={28} style={{ color: 'var(--text-muted)', opacity: 0.3 }} />
                    </div>
                  )}
                  {/* Hover action overlay */}
                  <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    style={{ background: 'rgba(0,0,0,0.55)' }}>
                    <button onClick={() => openEdit(proj)}
                      className="w-9 h-9 flex items-center justify-center rounded-full transition-all"
                      style={{ background: 'var(--acid)', color: 'var(--bg)' }}>
                      <Pencil size={14} />
                    </button>
                    <button onClick={() => setConfirmId(proj.id)}
                      className="w-9 h-9 flex items-center justify-center rounded-full transition-all"
                      style={{ background: 'rgba(248,113,113,0.9)', color: '#fff' }}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Info */}
                <div className="p-5">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-bold leading-tight" style={{ fontFamily: 'var(--font-display)' }}>{proj.title}</h3>
                    <div className="flex gap-1.5 flex-shrink-0">
                      {proj.demo_url && (
                        <a href={proj.demo_url} target="_blank" rel="noreferrer" title="Live demo"
                          className="p-1.5 rounded transition-colors"
                          style={{ color: 'var(--text-muted)', border: '1px solid var(--border)' }}
                          onMouseEnter={(e) => { e.currentTarget.style.color='var(--acid)'; e.currentTarget.style.borderColor='rgba(0,255,136,0.3)'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.color='var(--text-muted)'; e.currentTarget.style.borderColor='var(--border)'; }}>
                          <ExternalLink size={12} />
                        </a>
                      )}
                      {proj.github_url && (
                        <a href={proj.github_url} target="_blank" rel="noreferrer" title="GitHub"
                          className="p-1.5 rounded transition-colors"
                          style={{ color: 'var(--text-muted)', border: '1px solid var(--border)' }}
                          onMouseEnter={(e) => { e.currentTarget.style.color='var(--text)'; e.currentTarget.style.borderColor='rgba(255,255,255,0.2)'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.color='var(--text-muted)'; e.currentTarget.style.borderColor='var(--border)'; }}>
                          <Github size={12} />
                        </a>
                      )}
                    </div>
                  </div>

                  <p className="text-xs leading-relaxed mb-3 line-clamp-2" style={{ color: 'var(--text-muted)' }}>
                    {proj.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5">
                    {proj.tech_stack.split(',').map((t) => (
                      <Tag key={t} color="acid">{t.trim()}</Tag>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Create / Edit modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? `Edit: ${editing.title}` : 'Add Project'}
        size="lg"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="TITLE" required>
              <input type="text" placeholder="Project name" className="input-field" required
                value={form.title} onChange={set('title')} />
            </Field>
            <Field label="IMAGE URL">
              <input type="url" placeholder="https://…" className="input-field"
                value={form.image} onChange={set('image')} />
            </Field>
          </div>

          <Field label="DESCRIPTION" required>
            <textarea placeholder="What did you build? What problem does it solve?" rows={3}
              className="input-field resize-none" required
              value={form.description} onChange={set('description')} />
          </Field>

          <Field label="TECH STACK (comma-separated)" required>
            <input type="text" placeholder="React, Node.js, MySQL, Docker" className="input-field" required
              value={form.tech_stack} onChange={set('tech_stack')} />
          </Field>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="DEMO URL">
              <input type="url" placeholder="https://…" className="input-field"
                value={form.demo_url} onChange={set('demo_url')} />
            </Field>
            <Field label="GITHUB URL">
              <input type="url" placeholder="https://github.com/…" className="input-field"
                value={form.github_url} onChange={set('github_url')} />
            </Field>
          </div>

          {/* Image preview */}
          {form.image && (
            <div className="rounded overflow-hidden" style={{ height: '120px', background: 'var(--bg3)' }}>
              <img src={form.image} alt="preview" className="w-full h-full object-cover" onError={(e) => { e.target.style.display='none'; }} />
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={saving} className="btn-primary flex-1 justify-center py-3">
              {saving ? <><Spinner size={16} /> Saving…</> : <><Save size={14} /> Save Project</>}
            </button>
            <button type="button" onClick={() => setModalOpen(false)} className="btn-outline px-6 py-3">Cancel</button>
          </div>
        </form>
      </Modal>

      {/* Delete confirm */}
      <ConfirmDialog
        isOpen={!!confirmId}
        title="Delete Project"
        message="This project will be removed from your portfolio permanently. This cannot be undone."
        confirmLabel="Delete"
        danger
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setConfirmId(null)}
      />
    </>
  );
}

ProjectsPage.getLayout = (page) => <AdminLayout>{page}</AdminLayout>;
export default withAuth(ProjectsPage);
