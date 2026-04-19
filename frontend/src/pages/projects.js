import { useState } from 'react';
import SEOHead from '../components/SEOHead';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ExternalLink, Github, Layers } from 'lucide-react';
import Layout from '../components/Layout';
import api from '../utils/api';

export default function Projects({ projects }) {
  const [filter, setFilter] = useState('All');

  // Extract unique tech tags
  const allTags = ['All', ...new Set(
    projects.flatMap(p => p.tech_stack.split(',').map(t => t.trim()))
  )];

  const filtered = filter === 'All'
    ? projects
    : projects.filter(p => p.tech_stack.split(',').map(t => t.trim()).includes(filter));

  return (
    <>
      <SEOHead
        title="Projects"
        description="Our portfolio of web, mobile, and cloud projects — built for performance and scale."
        path="/projects"
      />

      {/* Header */}
      <section className="pt-32 pb-20 grid-bg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 opacity-5 blur-3xl pointer-events-none"
          style={{ background: 'radial-gradient(circle, var(--electric), transparent)' }} />
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div className="badge mb-6">Portfolio</div>
            <h1 className="text-5xl md:text-7xl font-black mb-6" style={{ fontFamily: 'var(--font-display)' }}>
              Our <span className="grad-text">Work</span>
            </h1>
            <p className="text-xl max-w-xl" style={{ color: 'var(--text-muted)', lineHeight: 1.8 }}>
              A curated selection of projects we've built — each one a story of challenges solved and goals exceeded.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter chips */}
      <section style={{ background: 'var(--bg2)', borderBottom: '1px solid var(--border)' }}>
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-wrap gap-2">
            {allTags.slice(0, 12).map((tag) => (
              <button
                key={tag}
                onClick={() => setFilter(tag)}
                className="px-4 py-1.5 text-xs rounded transition-all duration-200"
                style={{
                  fontFamily: 'var(--font-mono)',
                  background: filter === tag ? 'var(--acid)' : 'rgba(255,255,255,0.04)',
                  color: filter === tag ? 'var(--bg)' : 'var(--text-muted)',
                  border: `1px solid ${filter === tag ? 'var(--acid)' : 'var(--border)'}`,
                  fontWeight: filter === tag ? 700 : 400,
                }}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Projects grid */}
      <section className="section" style={{ background: 'var(--bg)' }}>
        <div className="max-w-7xl mx-auto px-6">
          {filtered.length === 0 ? (
            <div className="text-center py-20" style={{ color: 'var(--text-muted)' }}>
              No projects match this filter.
            </div>
          ) : (
            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <AnimatePresence mode="popLayout">
                {filtered.map((project, i) => (
                  <motion.div
                    key={project.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: i * 0.06, duration: 0.5 }}
                    className="glass glass-hover overflow-hidden group"
                  >
                    {/* Image */}
                    <div className="relative overflow-hidden" style={{ height: '240px', background: 'var(--bg3)' }}>
                      {project.image ? (
                        <img
                          src={project.image}
                          alt={project.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Layers size={40} style={{ color: 'var(--text-muted)' }} />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      {/* Hover actions */}
                      <div className="absolute bottom-4 right-4 flex gap-2 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                        {project.demo_url && (
                          <a href={project.demo_url} target="_blank" rel="noreferrer"
                            className="w-9 h-9 flex items-center justify-center rounded"
                            style={{ background: 'var(--acid)', color: 'var(--bg)' }}
                            onClick={(e) => e.stopPropagation()}>
                            <ExternalLink size={14} />
                          </a>
                        )}
                        {project.github_url && (
                          <a href={project.github_url} target="_blank" rel="noreferrer"
                            className="w-9 h-9 flex items-center justify-center rounded"
                            style={{ background: 'rgba(255,255,255,0.1)', color: 'white' }}
                            onClick={(e) => e.stopPropagation()}>
                            <Github size={14} />
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                        {project.title}
                      </h3>
                      <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-muted)' }}>
                        {project.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {project.tech_stack.split(',').map((tech) => (
                          <span
                            key={tech}
                            className="px-2 py-1 text-xs rounded"
                            style={{
                              background: 'rgba(0,255,136,0.06)',
                              border: '1px solid rgba(0,255,136,0.15)',
                              color: 'var(--acid)',
                              fontFamily: 'var(--font-mono)',
                            }}
                          >
                            {tech.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 text-center" style={{ background: 'var(--bg2)' }}>
        <div className="max-w-3xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-4xl font-black mb-4" style={{ fontFamily: 'var(--font-display)' }}>
              Want to be next?
            </h2>
            <p className="mb-8" style={{ color: 'var(--text-muted)' }}>
              Let's build your next great product together.
            </p>
            <Link href="/contact" className="btn-primary">
              Start a Project <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}

Projects.getLayout = (page) => <Layout>{page}</Layout>;

export async function getServerSideProps() {
  try {
    const res = await api.get('/projects');
    return { props: { projects: res.data.projects || [] } };
  } catch {
    return { props: { projects: [] } };
  }
}
