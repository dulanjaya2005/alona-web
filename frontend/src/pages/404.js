import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import Layout from '../components/Layout';

export default function NotFound() {
  return (
    <>
      <Head><title>404 — Alona Software</title></Head>
      <div className="min-h-screen flex items-center justify-center grid-bg">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center px-6"
        >
          <div className="text-8xl font-black mb-4 grad-text" style={{ fontFamily: 'var(--font-display)' }}>404</div>
          <h1 className="text-2xl font-bold mb-3" style={{ fontFamily: 'var(--font-display)' }}>Page not found</h1>
          <p className="mb-8" style={{ color: 'var(--text-muted)' }}>The page you're looking for doesn't exist.</p>
          <Link href="/" className="btn-primary">
            <ArrowLeft size={16} /> Back to Home
          </Link>
        </motion.div>
      </div>
    </>
  );
}

NotFound.getLayout = (page) => <Layout>{page}</Layout>;
