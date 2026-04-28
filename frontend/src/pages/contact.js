import SEOHead from '../components/SEOHead';
import { motion } from 'framer-motion';
import { Mail, MapPin, Clock } from 'lucide-react';
import Layout from '../components/Layout';

// ✅ ඔබේ WhatsApp number මෙතන දාන්න
const WHATSAPP_NUMBER  = '94760785715'; // 0771234567 → 94771234567
const WHATSAPP_MESSAGE = 'Hello! I would like to discuss a project with you.';

const fadeUp = {
  hidden  : { opacity: 0, y: 30 },
  visible : (i = 0) => ({
    opacity    : 1,
    y          : 0,
    transition : { delay: i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  }),
};

const openWhatsApp = () => {
  const encoded = encodeURIComponent(WHATSAPP_MESSAGE);
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`, '_blank');
};

export default function Contact() {
  return (
    <>
      <SEOHead
        title="Contact"
        description="Get in touch with the Alona Software team via WhatsApp."
        path="/contact"
      />

      {/* Header */}
      <section className="pt-32 pb-16 grid-bg">
        <div className="px-6 mx-auto max-w-7xl">
          <motion.div initial="hidden" animate="visible">
            <motion.div variants={fadeUp} custom={0} className="mb-6 badge">Get In Touch</motion.div>
            <motion.h1
              variants={fadeUp} custom={1}
              className="mb-4 text-5xl font-black md:text-7xl"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Let's <span className="grad-text">Talk</span>
            </motion.h1>
            <motion.p
              variants={fadeUp} custom={2}
              className="max-w-lg text-xl"
              style={{ color: 'var(--text-muted)', lineHeight: 1.8 }}
            >
              We're just a message away. Reach out via WhatsApp and we'll get back to you quickly.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Contact section */}
      <section className="section" style={{ background: 'var(--bg2)' }}>
        <div className="max-w-5xl px-6 mx-auto">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">

            {/* ── Info panel ── */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              className="space-y-6"
            >
              {/* Contact info cards */}
              {[
                { icon: Mail,   title: 'Email',         value: 'alonaweb@gmail.com',   sub: 'We respond within 24h'           },
                { icon: MapPin, title: 'Location',      value: 'Remote-first',          sub: 'Serving clients globally'        },
                { icon: Clock,  title: 'Working Hours', value: 'Mon–Fri, 9–6 EST',      sub: 'We reply to urgent msgs anytime' },
              ].map(({ icon: Icon, title, value, sub }, i) => (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.1 }}
                  className="flex items-start gap-4 p-5 glass"
                >
                  <div
                    className="flex items-center justify-center flex-shrink-0 w-10 h-10"
                    style={{
                      background : 'rgba(0,255,136,0.08)',
                      border     : '1px solid rgba(0,255,136,0.15)',
                      clipPath   : 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))',
                    }}
                  >
                    <Icon size={16} style={{ color: 'var(--acid)' }} />
                  </div>
                  <div>
                    <div className="text-xs mb-0.5" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                      {title}
                    </div>
                    <div className="text-sm font-semibold" style={{ fontFamily: 'var(--font-display)' }}>
                      {value}
                    </div>
                    <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                      {sub}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* ── WhatsApp panel ── */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              className="flex flex-col items-center justify-center p-8 text-center glass"
            >
              {/* WhatsApp icon circle */}
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
                className="flex items-center justify-center w-24 h-24 mb-6 rounded-full"
                style={{
                  background : 'rgba(37,211,102,0.12)',
                  border     : '2px solid rgba(37,211,102,0.3)',
                }}
              >
                <svg width="48" height="48" viewBox="0 0 24 24" fill="#25D366">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </motion.div>

              <h3 className="mb-2 text-2xl font-black" style={{ fontFamily: 'var(--font-display)' }}>
                Chat on WhatsApp
              </h3>
              <p className="max-w-xs mb-8 text-sm" style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>
                Click the button below to start a conversation with us directly on WhatsApp. We typically reply within minutes!
              </p>

              {/* Main WhatsApp button */}
              <button
                onClick={openWhatsApp}
                className="flex items-center justify-center w-full gap-3 px-8 py-4 text-base font-bold transition-all duration-200 rounded"
                style={{
                  background   : '#25D366',
                  color        : '#fff',
                  fontFamily   : 'var(--font-display)',
                  letterSpacing: '0.05em',
                  border       : 'none',
                  cursor       : 'pointer',
                  fontSize     : '1rem',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background  = '#1ebe5d';
                  e.currentTarget.style.transform   = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow   = '0 10px 30px rgba(37,211,102,0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background  = '#25D366';
                  e.currentTarget.style.transform   = 'translateY(0)';
                  e.currentTarget.style.boxShadow   = 'none';
                }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                WhatsApp එකෙන් Contact කරන්න
              </button>

              {/* Online indicator */}
              <div className="flex items-center gap-2 mt-4">
                <span
                  className="w-2 h-2 rounded-full animate-pulse"
                  style={{ background: '#25D366' }}
                />
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  Usually replies within minutes
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}

Contact.getLayout = (page) => <Layout>{page}</Layout>;