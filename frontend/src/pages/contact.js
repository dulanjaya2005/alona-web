import { useState } from 'react';
import SEOHead from '../components/SEOHead';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Send, Mail, MapPin, Clock, CheckCircle } from 'lucide-react';
import Layout from '../components/Layout';
import api from '../utils/api';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] } }),
};

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast.error('Please fill in all fields.');
      return;
    }
    setLoading(true);
    try {
      await api.post('/contact', form);
      setSubmitted(true);
      toast.success('Message sent! We\'ll be in touch soon.');
      setForm({ name: '', email: '', message: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEOHead
        title="Contact"
        description="Get in touch with the Alona Software team. We respond within 24 hours."
        path="/contact"
      />

      {/* Header */}
      <section className="pt-32 pb-16 grid-bg">
        <div className="px-6 mx-auto max-w-7xl">
          <motion.div initial="hidden" animate="visible">
            <motion.div variants={fadeUp} custom={0} className="mb-6 badge">Get In Touch</motion.div>
            <motion.h1 variants={fadeUp} custom={1} className="mb-4 text-5xl font-black md:text-7xl" style={{ fontFamily: 'var(--font-display)' }}>
              Let's <span className="grad-text">Talk</span>
            </motion.h1>
            <motion.p variants={fadeUp} custom={2} className="max-w-lg text-xl" style={{ color: 'var(--text-muted)', lineHeight: 1.8 }}>
              Tell us about your project. We read every message and respond within 24 hours.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Contact section */}
      <section className="section" style={{ background: 'var(--bg2)' }}>
        <div className="px-6 mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-5">

            {/* Info */}
            <motion.div
              className="lg:col-span-2"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
            >
              <div className="space-y-8">
                {[
                  { icon: Mail, title: 'Email', value: 'alonaweb.gmail.com', sub: 'We respond within 24h' },
                  { icon: MapPin, title: 'Location', value: 'Remote-first', sub: 'Serving clients globally' },
                  { icon: Clock, title: 'Working Hours', value: 'Mon–Fri, 9–6 EST', sub: 'We reply to urgent msgs anytime' },
                ].map(({ icon: Icon, title, value, sub }) => (
                  <div key={title} className="flex items-start gap-4">
                    <div className="flex items-center justify-center flex-shrink-0 w-10 h-10"
                      style={{
                        background: 'rgba(0,255,136,0.08)',
                        border: '1px solid rgba(0,255,136,0.15)',
                        clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))',
                      }}>
                      <Icon size={16} style={{ color: 'var(--acid)' }} />
                    </div>
                    <div>
                      <div className="text-xs mb-0.5" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{title}</div>
                      <div className="text-sm font-semibold" style={{ fontFamily: 'var(--font-display)' }}>{value}</div>
                      <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{sub}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-6 mt-12 glass">
                <h3 className="mb-3 font-bold" style={{ fontFamily: 'var(--font-display)' }}>What happens next?</h3>
                <div className="space-y-3">
                  {[
                    'We review your message within 24 hours',
                    'Schedule a free 30-min discovery call',
                    'Receive a detailed proposal & timeline',
                    'Kick off your project!',
                  ].map((step, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="flex items-center justify-center flex-shrink-0 w-5 h-5 text-xs font-bold rounded-full"
                        style={{ background: 'rgba(0,255,136,0.15)', color: 'var(--acid)', fontFamily: 'var(--font-mono)' }}>
                        {i + 1}
                      </div>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Form */}
            <motion.div
              className="lg:col-span-3"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
            >
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center h-full p-12 text-center glass"
                >
                  <div className="flex items-center justify-center w-16 h-16 mb-6 rounded-full"
                    style={{ background: 'rgba(0,255,136,0.1)', border: '2px solid var(--acid)' }}>
                    <CheckCircle size={30} style={{ color: 'var(--acid)' }} />
                  </div>
                  <h3 className="mb-3 text-2xl font-black" style={{ fontFamily: 'var(--font-display)' }}>
                    Message Received!
                  </h3>
                  <p style={{ color: 'var(--text-muted)', maxWidth: '300px', lineHeight: 1.8 }}>
                    Thank you for reaching out. We'll get back to you within 24 hours.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-8 btn-outline"
                  >
                    Send Another Message
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="p-8 space-y-6 glass">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                      <label className="block mb-2 text-xs" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', letterSpacing: '0.08em' }}>
                        YOUR NAME *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="John Smith"
                        className="input-field"
                        required
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-xs" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', letterSpacing: '0.08em' }}>
                        EMAIL ADDRESS *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="john@company.com"
                        className="input-field"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block mb-2 text-xs" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', letterSpacing: '0.08em' }}>
                      YOUR MESSAGE *
                    </label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Tell us about your project — what you want to build, your timeline, and any specific requirements..."
                      rows={7}
                      className="resize-none input-field"
                      required
                    />
                  </div>

                  <button type="submit" disabled={loading} className="justify-center w-full btn-primary">
                    {loading ? (
                      <>
                        <div className="spinner" />
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message <Send size={16} />
                      </>
                    )}
                  </button>

                  <p className="text-xs text-center" style={{ color: 'var(--text-muted)' }}>
                    No spam. Your info is never shared with third parties.
                  </p>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}

Contact.getLayout = (page) => <Layout>{page}</Layout>;
