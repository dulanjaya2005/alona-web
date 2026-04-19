import { useState } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Lock, Save, Eye, EyeOff, ShieldCheck, Info } from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import withAuth from '../../components/withAuth';
import Spinner from '../../components/Spinner';
import useAuthStore from '../../store/authStore';
import api from '../../utils/api';

const EMPTY_PW = { currentPassword: '', newPassword: '', confirmPassword: '' };

function SettingsPage() {
  const { admin } = useAuthStore();
  const [pwForm, setPwForm]       = useState(EMPTY_PW);
  const [pwSaving, setPwSaving]   = useState(false);
  const [showPw, setShowPw]       = useState({ current: false, next: false, confirm: false });

  const toggleShow = (key) => setShowPw((p) => ({ ...p, [key]: !p[key] }));

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (pwForm.newPassword !== pwForm.confirmPassword) {
      toast.error('New passwords do not match.');
      return;
    }
    if (pwForm.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters.');
      return;
    }
    if (pwForm.newPassword === pwForm.currentPassword) {
      toast.error('New password must be different from the current one.');
      return;
    }

    setPwSaving(true);
    try {
      await api.put('/auth/change-password', {
        currentPassword: pwForm.currentPassword,
        newPassword    : pwForm.newPassword,
      });
      toast.success('Password changed successfully!');
      setPwForm(EMPTY_PW);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password.');
    } finally {
      setPwSaving(false);
    }
  };

  /* password strength */
  const strength = (() => {
    const p = pwForm.newPassword;
    if (!p) return null;
    let score = 0;
    if (p.length >= 8) score++;
    if (p.length >= 12) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    if (score <= 1) return { label: 'Weak',   color: '#f87171', width: '25%'  };
    if (score <= 3) return { label: 'Fair',   color: '#fbbf24', width: '55%'  };
    if (score === 4) return { label: 'Good',  color: '#34d399', width: '80%'  };
    return              { label: 'Strong', color: '#00ff88', width: '100%' };
  })();

  const PwField = ({ label, fieldKey, storeKey, placeholder }) => (
    <div>
      <label className="block text-xs mb-2"
        style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', letterSpacing: '0.08em' }}>
        {label}
      </label>
      <div className="relative">
        <input
          type={showPw[storeKey] ? 'text' : 'password'}
          placeholder={placeholder}
          value={pwForm[fieldKey]}
          onChange={(e) => setPwForm({ ...pwForm, [fieldKey]: e.target.value })}
          className="input-field pr-10"
          required
        />
        <button
          type="button"
          onClick={() => toggleShow(storeKey)}
          className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
          style={{ color: 'var(--text-muted)' }}
          onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text)'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
        >
          {showPw[storeKey] ? <EyeOff size={15} /> : <Eye size={15} />}
        </button>
      </div>
    </div>
  );

  return (
    <>
      <Head><title>Settings — Alona Admin</title></Head>

      <div className="max-w-2xl">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-black" style={{ fontFamily: 'var(--font-display)' }}>Settings</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Manage your admin account</p>
        </motion.div>

        {/* Account info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          className="admin-card mb-5"
        >
          <div className="flex items-center gap-3 mb-1">
            <Info size={16} style={{ color: 'var(--acid)' }} />
            <h2 className="font-bold" style={{ fontFamily: 'var(--font-display)' }}>Account Info</h2>
          </div>
          <p className="text-sm mb-5" style={{ color: 'var(--text-muted)' }}>Your current admin account details.</p>

          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Username',  value: admin?.username || '—' },
              { label: 'Role',      value: 'Administrator'        },
              { label: 'Admin ID',  value: `#${admin?.id || '—'}` },
              { label: 'Session',   value: 'JWT (7 days)'         },
            ].map(({ label, value }) => (
              <div key={label} className="p-3 rounded"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)' }}>
                <div className="text-xs mb-1" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  {label}
                </div>
                <div className="font-semibold text-sm" style={{ fontFamily: 'var(--font-display)' }}>
                  {value}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Change password */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="admin-card"
        >
          <div className="flex items-center gap-3 mb-1">
            <Lock size={16} style={{ color: 'var(--acid)' }} />
            <h2 className="font-bold" style={{ fontFamily: 'var(--font-display)' }}>Change Password</h2>
          </div>
          <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
            Choose a strong password of at least 6 characters.
          </p>

          <form onSubmit={handlePasswordChange} className="space-y-4">
            <PwField label="CURRENT PASSWORD" fieldKey="currentPassword" storeKey="current" placeholder="Your current password" />

            <div className="pt-2" style={{ borderTop: '1px solid var(--border)' }}>
              <PwField label="NEW PASSWORD" fieldKey="newPassword" storeKey="next" placeholder="Min. 6 characters" />
              {/* Strength bar */}
              {strength && (
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                      Strength
                    </span>
                    <span className="text-xs font-bold" style={{ color: strength.color, fontFamily: 'var(--font-mono)' }}>
                      {strength.label}
                    </span>
                  </div>
                  <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{ width: strength.width, background: strength.color }}
                    />
                  </div>
                </div>
              )}
            </div>

            <PwField label="CONFIRM NEW PASSWORD" fieldKey="confirmPassword" storeKey="confirm" placeholder="Repeat new password" />

            {/* Match indicator */}
            {pwForm.newPassword && pwForm.confirmPassword && (
              <p className="text-xs flex items-center gap-1.5"
                style={{ color: pwForm.newPassword === pwForm.confirmPassword ? '#00ff88' : '#f87171' }}>
                <ShieldCheck size={13} />
                {pwForm.newPassword === pwForm.confirmPassword ? 'Passwords match' : 'Passwords do not match'}
              </p>
            )}

            <button type="submit" disabled={pwSaving} className="btn-primary mt-2">
              {pwSaving ? <><Spinner size={15} /> Saving…</> : <><Save size={14} /> Update Password</>}
            </button>
          </form>
        </motion.div>

        {/* Danger zone */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="admin-card mt-5"
          style={{ borderColor: 'rgba(248,113,113,0.2)' }}
        >
          <h2 className="font-bold mb-1" style={{ fontFamily: 'var(--font-display)', color: '#f87171' }}>
            Danger Zone
          </h2>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            To add new admin users, connect to the database and run:
          </p>
          <pre className="text-xs mt-3 p-3 rounded overflow-x-auto"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', fontFamily: 'var(--font-mono)', color: '#f87171' }}>
{`INSERT INTO admins (username, password)
VALUES ('newadmin', '<bcrypt_hash>');`}
          </pre>
          <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
            Generate a bcrypt hash at: <a href="https://bcrypt-generator.com" target="_blank" rel="noreferrer"
              style={{ color: 'var(--acid)' }}>bcrypt-generator.com</a>
          </p>
        </motion.div>
      </div>
    </>
  );
}

SettingsPage.getLayout = (page) => <AdminLayout>{page}</AdminLayout>;
export default withAuth(SettingsPage);
