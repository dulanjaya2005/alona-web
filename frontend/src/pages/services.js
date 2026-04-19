import SEOHead from '../components/SEOHead';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Code2, Smartphone, Palette, Cloud, Globe, Zap, ArrowRight, CheckCircle } from 'lucide-react';
import Layout from '../components/Layout';
import api from '../utils/api';

const iconMap = { globe: Globe, code: Code2, smartphone: Smartphone, palette: Palette, cloud: Cloud, cpu: Zap };

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] }
  }),
};

const techStack = ['React', 'Next.js', 'Node.js', 'Python',  'AWS', 'Docker', 'PostgreSQL', 'MySQL', ];

export default function Services({ services }) {
  return (
    <>
      <SEOHead
        title="Services"
        description="End-to-end digital services — web development, mobile apps, UI/UX design, and cloud solutions."
        path="/services"
      />

      {/* Header */}
      <section className="relative pt-32 pb-20 overflow-hidden grid-bg">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-5 blur-3xl pointer-events-none"
          style={{ background: 'radial-gradient(circle, var(--acid), transparent)' }} />

        <div className="px-6 mx-auto max-w-7xl">
          <motion.div initial="hidden" animate="visible">
            <motion.div variants={fadeUp} custom={0} className="mb-6 badge">Our Expertise</motion.div>
            <motion.h1 variants={fadeUp} custom={1} className="mb-6 text-5xl font-black md:text-7xl" style={{ fontFamily: 'var(--font-display)' }}>
              What We <span className="grad-text">Build</span>
            </motion.h1>
            <motion.p variants={fadeUp} custom={2} className="max-w-2xl text-xl" style={{ color: 'var(--text-muted)', lineHeight: 1.8 }}>
              Full-spectrum digital services — from pixel-perfect UIs to scalable cloud infrastructure.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section" style={{ background: 'var(--bg2)' }}>
        <div className="px-6 mx-auto max-w-7xl">
          {services.length === 0 ? (
            <div className="py-20 text-center" style={{ color: 'var(--text-muted)' }}>
              No services found. Check back soon.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {services.map((service, i) => {
                const Icon = iconMap[service.icon] || Code2;
                return (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.1 }}
                    transition={{ delay: i * 0.07, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="p-8 glass glass-hover group"
                  >
                    <div className="flex items-center justify-center w-12 h-12 mb-6 transition-all duration-300 group-hover:scale-110"
                      style={{
                        background: 'rgba(0,255,136,0.08)',
                        border: '1px solid rgba(0,255,136,0.15)',
                        clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))',
                      }}>
                      <Icon size={20} style={{ color: 'var(--acid)' }} />
                    </div>
                    <div className="mb-3 text-xs" style={{ color: 'var(--acid)', fontFamily: 'var(--font-mono)' }}>
                      {String(i + 1).padStart(2, '0')}
                    </div>
                    <h3 className="mb-3 text-xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
                      {service.title}
                    </h3>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                      {service.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Tech Stack */}
      <section className="section grid-bg">
        <div className="px-6 mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6 }}
            className="mb-12 text-center"
          >
            <div className="mx-auto mb-4 badge w-fit">Technologies</div>
            <h2 className="mb-4 text-3xl font-black md:text-4xl" style={{ fontFamily: 'var(--font-display)' }}>
              Our Tech Stack
            </h2>
            <p style={{ color: 'var(--text-muted)' }}>The tools we use to build exceptional products.</p>
          </motion.div>
          <div className="flex flex-wrap justify-center gap-3">
            {techStack.map((tech, i) => (
              <motion.div
                key={tech}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
                className="px-4 py-2 text-sm transition-all duration-200 cursor-default glass hover:border-acid"
                style={{ fontFamily: 'var(--font-mono)' }}
                whileHover={{ y: -2, borderColor: 'rgba(0,255,136,0.4)', color: 'var(--acid)' }}
              >
                {tech}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section" style={{ background: 'var(--bg2)' }}>
        <div className="px-6 mx-auto max-w-7xl">
          <div className="grid items-center grid-cols-1 gap-16 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <div className="mb-6 badge">Why Alona</div>
              <h2 className="mb-8 text-4xl font-black" style={{ fontFamily: 'var(--font-display)' }}>
                The Alona<br /><span className="grad-text">Advantage</span>
              </h2>
              <div className="space-y-4">
                {[
                  'Senior engineers with 5+ years average experience',
                  'Agile delivery — ship in weeks, not months',
                  'Full transparency with real-time project dashboards',
                  'Dedicated account manager for every client',
                  'Post-launch support and maintenance included',
                  '100% ownership of code and IP transferred to you',
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.07 }}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle size={18} style={{ color: 'var(--acid)', flexShrink: 0, marginTop: '2px' }} />
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>{item}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="p-8 text-center glass acid-glow"
            >
              <div className="mb-2 text-6xl font-black" style={{ fontFamily: 'var(--font-display)', color: 'var(--acid)' }}>3+</div>
              <div className="mb-6 text-lg font-bold" style={{ fontFamily: 'var(--font-display)' }}>Projects Shipped</div>
              <div className="grid grid-cols-2 gap-4">
                {[['98%', 'On-Time Delivery'], ['4.9/5', 'Avg. Rating'], ['1+', 'Years Active'], ['4+', 'Team Members']].map(([val, label]) => (
                  <div key={label} className="p-4 glass">
                    <div className="text-2xl font-black" style={{ fontFamily: 'var(--font-display)', color: 'var(--acid)' }}>{val}</div>
                    <div className="mt-1 text-xs" style={{ color: 'var(--text-muted)' }}>{label}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 text-center grid-bg">
        <div className="max-w-3xl px-6 mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="mb-6 text-4xl font-black md:text-5xl" style={{ fontFamily: 'var(--font-display)' }}>
              Have a project in mind?
            </h2>
            <p className="mb-8" style={{ color: 'var(--text-muted)' }}>Let's discuss how we can help you achieve your goals.</p>
            <Link href="/contact" className="btn-primary">
              Contact Us <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}

Services.getLayout = (page) => <Layout>{page}</Layout>;

export async function getServerSideProps() {
  try {
    const res = await api.get('/services');
    return { props: { services: res.data.services || [] } };
  } catch {
    return { props: { services: [] } };
  }
}
