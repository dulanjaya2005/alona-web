import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Zap, Eye, EyeOff, Lock, User } from 'lucide-react';
import useAuthStore from '../../store/authStore';

// ✅ SECRET KEY — මේක ඔබට ඕන ඕනෑම දෙයකට වෙනස් කරන්න
// Admin login access කරන්න URL: /admin/login?key=alona2024secret
const ADMIN_SECRET_KEY = process.env.NEXT_PUBLIC_ADMIN_KEY || 'alona2024secret';

export default function AdminLogin() {
  const router = useRouter();
  const { login, isLoading } = useAuthStore();
  const [form, setForm]         = useState({ username: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [allowed, setAllowed]   = useState(false); // secret key valid ද?

  useEffect(() => {
    // Already logged in නම් dashboard එකට
    const token = localStorage.getItem('alona_admin_token');
    if (token) { router.replace('/admin'); return; }

    // URL key check — router.query ready වෙනකන් wait කරන්න
    if (!router.isReady) return;

    const { key } = router.query;
    if (key === ADMIN_SECRET_KEY) {
      setAllowed(true);
    } else {
      // Wrong key හෝ key නෑ — 404 redirect
      router.replace('/404');
    }
  }, [router.isReady, router.query]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username || !form.password) {
      toast.error('Please fill in all fields.');
      return;
    }
    const result = await login(form.username, form.password);
    if (result.success) {
      toast.success('Welcome back!');
      router.push('/admin');
    } else {
      toast.error(result.message || 'Invalid credentials.');
    }
  };

  // Key check වෙනකන් blank screen
  if (!allowed) {
    return (
      <div style={{ background: 'var(--bg)', minHeight: '100vh' }} />
    );
  }

  return (
    <>
      <Head>
        <title>Login</title>
        {/* Google index කරන්නේ නෑ */}
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div
        className="min-h-screen flex items-center justify-center grid-bg relative overflow-hidden"
        style={{ background: 'var(--bg)' }}
      >
        {/* Background glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl pointer-events-none"
          style={{ background: 'radial-gradient(circle, var(--acid), transparent)', opacity: 0.08 }}
        />

        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md px-6"
        >
          {/* Logo */}
          <div className="text-center mb-8">
            <div
              className="w-12 h-12 flex items-center justify-center mx-auto mb-4"
              style={{
                background: 'var(--acid)',
                clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))',
              }}
            >
              <Zap size={22} color="#0a0a0f" strokeWidth={2.5} />
            </div>
            <h1 className="text-2xl font-black mb-1" style={{ fontFamily: 'var(--font-display)' }}>
              Admin Access
            </h1>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              Authorized personnel only
            </p>
          </div>

          <form onSubmit={handleSubmit} className="glass p-8 space-y-5">
            {/* Username */}
            <div>
              <label
                className="block text-xs mb-2"
                style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', letterSpacing: '0.08em' }}
              >
                USERNAME
              </label>
              <div className="relative">
                <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  placeholder="Username"
                  className="input-field pl-10"
                  autoComplete="username"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                className="block text-xs mb-2"
                style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', letterSpacing: '0.08em' }}
              >
                PASSWORD
              </label>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  className="input-field pl-10 pr-10"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: 'var(--text-muted)' }}
                >
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={isLoading} className="btn-primary w-full justify-center mt-2">
              {isLoading
                ? <><div className="spinner" /> Signing in...</>
                : <><Lock size={15} /> Sign In</>
              }
            </button>
          </form>
        </motion.div>
      </div>
    </>
  );
}
