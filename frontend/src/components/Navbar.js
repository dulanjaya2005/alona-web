import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Zap } from 'lucide-react';

// ✅ ඔබේ logo settings මෙතන වෙනස් කරන්න
// Logo image දාන්නේ: frontend/public/logo.png
// ඉන් පස්සේ LOGO_IMAGE = '/logo.png' කරන්න
const LOGO_IMAGE = '/logo.png';  // ← ඔබේ file name
const LOGO_TEXT   = 'ALONA web';   // ← ඔබේ company name
const LOGO_WIDTH  = 110;       // ← logo width (pixels)
const LOGO_HEIGHT = 40;        // ← logo height (pixels)

const navLinks = [
  { href: '/',         label: 'Home'     },
  { href: '/services', label: 'Services' },
  { href: '/projects', label: 'Projects' },
  { href: '/about',    label: 'About'    },
  { href: '/contact',  label: 'Contact'  },
];

// Logo component — image තියෙනවා නම් image, නැත්නම් text
function Logo() {
  if (LOGO_IMAGE) {
    return (
      <Image
        src={LOGO_IMAGE}
        alt={LOGO_TEXT}
        width={LOGO_WIDTH}
        height={LOGO_HEIGHT}
        className="object-contain transition-opacity duration-200 group-hover:opacity-80"
        priority
      />
    );
  }

  // Default text logo
  return (
    <div className="flex items-center gap-2">
      <div
        className="flex items-center justify-center flex-shrink-0 w-8 h-8"
        style={{
          background : 'var(--acid)',
          clipPath   : 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))',
        }}
      >
        <Zap size={16} color="#0a0a0f" strokeWidth={2.5} />
      </div>
      <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.2rem' }}>
        {LOGO_TEXT}<span style={{ color: 'var(--acid)' }}>.</span>
      </span>
    </div>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [router.pathname]);

  return (
    <>
      <motion.nav
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'py-3 backdrop-blur-xl border-b border-white/5' : 'py-5'
        }`}
        style={{ background: scrolled ? 'rgba(10,10,15,0.9)' : 'transparent' }}
      >
        <div className="flex items-center justify-between px-6 mx-auto max-w-7xl">

          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <Logo />
          </Link>

          {/* Desktop nav */}
          <div className="items-center hidden gap-1 md:flex">
            {navLinks.map((link) => {
              const isActive = router.pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative px-4 py-2 text-sm font-medium transition-colors duration-200"
                  style={{
                    fontFamily : 'var(--font-display)',
                    color      : isActive ? 'var(--acid)' : 'rgba(240,240,245,0.7)',
                    letterSpacing: '0.05em',
                  }}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-indicator"
                      className="absolute inset-0 rounded"
                      style={{
                        background  : 'rgba(0,255,136,0.08)',
                        border      : '1px solid rgba(0,255,136,0.15)',
                      }}
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                    />
                  )}
                  <span className="relative z-10">{link.label}</span>
                </Link>
              );
            })}
          </div>

          {/* CTA button */}
          <div className="items-center hidden gap-4 md:flex">
            <Link href="/contact" className="btn-primary text-xs py-2.5 px-5">
              Start Project
            </Link>
          </div>

          {/* Mobile menu toggle */}
          <button
            className="p-2 transition-colors md:hidden"
            style={{ color: 'var(--acid)' }}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed left-0 right-0 z-40 border-b top-16"
            style={{
              background  : 'rgba(10,10,15,0.98)',
              borderColor : 'var(--border)',
              backdropFilter: 'blur(20px)',
            }}
          >
            <div className="flex flex-col gap-1 px-6 py-6 mx-auto max-w-7xl">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    href={link.href}
                    className="block px-4 py-3 text-sm font-medium transition-all rounded"
                    style={{
                      fontFamily : 'var(--font-display)',
                      color      : router.pathname === link.href ? 'var(--acid)' : 'rgba(240,240,245,0.8)',
                      background : router.pathname === link.href ? 'rgba(0,255,136,0.08)' : 'transparent',
                      letterSpacing: '0.05em',
                    }}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <div className="pt-4 mt-4" style={{ borderTop: '1px solid var(--border)' }}>
                <Link href="/contact" className="justify-center w-full btn-primary">
                  Start Project
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}