import { useEffect, useState, useRef } from 'react';
import SEOHead from '../components/SEOHead';
import Link from 'next/link';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { ArrowRight, Zap, Code2, Smartphone, Palette, Cloud, Globe, ChevronDown } from 'lucide-react';
import Layout from '../components/Layout';
import api from '../utils/api';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }
  }),
};

const iconMap = { globe: Globe, code: Code2, smartphone: Smartphone, palette: Palette, cloud: Cloud, cpu: Zap };

const stats = [
  { value: '150+', label: 'Projects Delivered' },
  { value: '98%', label: 'Client Satisfaction' },
  { value: '8+', label: 'Years Experience' },
  { value: '40+', label: 'Team Members' },
];

const words = ['Scalable', 'Modern', 'Fast', 'Elegant'];

export default function Home({ services }) {
  const [wordIndex, setWordIndex] = useState(0);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  useEffect(() => {
    const timer = setInterval(() => setWordIndex((i) => (i + 1) % words.length), 2500);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <SEOHead
        title="Home"
        description="We build blazing-fast, scalable web and mobile applications for forward-thinking companies."
        path="/"
      />

      {/* Hero */}
      <section ref={heroRef} className="relative min-h-screen flex items-center grid-bg overflow-hidden">
        {/* Background orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl"
            style={{ background: 'radial-gradient(circle, var(--acid), transparent)' }} />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-8 blur-3xl"
            style={{ background: 'radial-gradient(circle, var(--electric), transparent)' }} />
        </div>

        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="max-w-7xl mx-auto px-6 pt-28 pb-16 w-full"
        >
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}>
            <div className="badge mb-8 inline-flex">
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--acid)' }} />
              Available for new projects
            </div>
          </motion.div>

          <motion.h1
            variants={fadeUp} initial="hidden" animate="visible" custom={1}
            className="text-5xl md:text-7xl xl:text-8xl font-black leading-none mb-6"
            style={{ fontFamily: 'var(--font-display)', maxWidth: '900px' }}
          >
            We Build{' '}
            <span className="relative inline-block overflow-hidden" style={{ height: '1.1em', verticalAlign: 'bottom' }}>
              <AnimatePresence mode="wait">
                <motion.span
                  key={wordIndex}
                  initial={{ y: '100%', opacity: 0 }}
                  animate={{ y: '0%', opacity: 1 }}
                  exit={{ y: '-100%', opacity: 0 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="grad-text block"
                >
                  {words[wordIndex]}
                </motion.span>
              </AnimatePresence>
            </span>
            <br />
            Digital Products
          </motion.h1>

          <motion.p
            variants={fadeUp} initial="hidden" animate="visible" custom={2}
            className="text-lg md:text-xl mb-10 max-w-xl"
            style={{ color: 'var(--text-muted)', lineHeight: 1.8 }}
          >
            From concept to deployment — we craft high-performance web apps, mobile products, and cloud systems for companies that refuse to settle.
          </motion.p>

          <motion.div
            variants={fadeUp} initial="hidden" animate="visible" custom={3}
            className="flex flex-wrap gap-4"
          >
            <Link href="/contact" className="btn-primary">
              Start a Project <ArrowRight size={16} />
            </Link>
            <Link href="/projects" className="btn-outline">
              View Our Work
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={fadeUp} initial="hidden" animate="visible" custom={4}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20"
          >
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + i * 0.1, duration: 0.5 }}
              >
                <div className="text-3xl md:text-4xl font-black mb-1" style={{ fontFamily: 'var(--font-display)', color: 'var(--acid)' }}>
                  {stat.value}
                </div>
                <div className="text-sm" style={{ color: 'var(--text-muted)' }}>{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <span className="text-xs" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', letterSpacing: '0.1em' }}>SCROLL</span>
          <motion.div animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
            <ChevronDown size={16} style={{ color: 'var(--acid)' }} />
          </motion.div>
        </motion.div>
      </section>

      {/* Services Preview */}
      <section className="section" style={{ background: 'var(--bg2)' }}>
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}
            className="mb-16"
          >
            <motion.div variants={fadeUp} custom={0} className="badge mb-4">What We Do</motion.div>
            <motion.h2 variants={fadeUp} custom={1} className="text-4xl md:text-5xl font-black mb-4" style={{ fontFamily: 'var(--font-display)' }}>
              Our Services
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="text-lg max-w-xl" style={{ color: 'var(--text-muted)' }}>
              End-to-end digital solutions engineered for performance and built to last.
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(services || []).slice(0, 6).map((service, i) => {
              const Icon = iconMap[service.icon] || Code2;
              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.1 }}
                  transition={{ delay: i * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="glass glass-hover p-6 group cursor-default"
                >
                  <div className="w-10 h-10 flex items-center justify-center rounded mb-4 transition-all duration-300 group-hover:scale-110"
                    style={{ background: 'rgba(0,255,136,0.1)', border: '1px solid rgba(0,255,136,0.2)' }}>
                    <Icon size={18} style={{ color: 'var(--acid)' }} />
                  </div>
                  <h3 className="text-lg font-bold mb-2" style={{ fontFamily: 'var(--font-display)' }}>{service.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{service.description}</p>
                </motion.div>
              );
            })}
          </div>

          <motion.div
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link href="/services" className="btn-outline">
              View All Services <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* About / Philosophy */}
      <section className="section grid-bg">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="badge mb-6">Who We Are</div>
              <h2 className="text-4xl md:text-5xl font-black mb-6" style={{ fontFamily: 'var(--font-display)' }}>
                Code-first,<br />
                <span className="grad-text">design-obsessed.</span>
              </h2>
              <p className="text-base mb-4 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                We're a team of senior engineers and product designers who believe software should be both beautiful and bulletproof. Every line of code we write is intentional.
              </p>
              <p className="text-base mb-8 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                We partner with startups and enterprises to ship products that their users love — on time and on budget.
              </p>
              <Link href="/about" className="btn-outline">
                Our Story <ArrowRight size={16} />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="grid grid-cols-2 gap-4"
            >
              {[
                { title: 'Discovery', desc: 'Deep-dive into your requirements and user needs.' },
                { title: 'Architecture', desc: 'Design scalable systems that grow with you.' },
                { title: 'Engineering', desc: 'Pixel-perfect builds with rigorous testing.' },
                { title: 'Launch', desc: 'Zero-downtime deployments and ongoing support.' },
              ].map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="glass p-5"
                >
                  <div className="text-xs font-bold mb-2" style={{ color: 'var(--acid)', fontFamily: 'var(--font-mono)' }}>
                    0{i + 1}
                  </div>
                  <h4 className="font-bold mb-1" style={{ fontFamily: 'var(--font-display)' }}>{item.title}</h4>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>{item.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-24" style={{ background: 'var(--bg2)' }}>
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-4xl md:text-6xl font-black mb-6" style={{ fontFamily: 'var(--font-display)' }}>
              Ready to build<br /><span className="grad-text">something great?</span>
            </h2>
            <p className="text-lg mb-10" style={{ color: 'var(--text-muted)' }}>
              Tell us about your project and let's make it happen.
            </p>
            <Link href="/contact" className="btn-primary text-base px-10 py-4">
              Get In Touch <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}

Home.getLayout = (page) => <Layout>{page}</Layout>;

export async function getServerSideProps() {
  try {
    const res = await api.get('/services');
    return { props: { services: res.data.services || [] } };
  } catch {
    return { props: { services: [] } };
  }
}
