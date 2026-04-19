import SEOHead from '../components/SEOHead';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Users, Target, Heart, Award } from 'lucide-react';
import Layout from '../components/Layout';

// ✅ ඔබේ team members මෙතන edit කරන්න
// image: ඔබේ photo URL හෝ /images/team/name.jpg (public folder)
const team = [
  {
    name : 'Imasha Pawan gamage',
    role : 'CEO & Co-founder',
    bio  : 'Full-stack architect with 4+ years in enterprise software. UK Pearson',
    image: '/images/team/imasha.jpg', // ← photo URL මෙතන දාන්න
  },
  {
    name : 'Bathiya Nethsara',
    role : 'CTO',
    bio  : 'Chief Technology Officer. Full-stack developer. 99x Trainee Software Engineer. 3 years Hand on project experience.',
    image: '/images/team/bathiya.jpeg', // ← photo URL මෙතන දාන්න
  },
  {
    name : 'Dulanjaya Thathsara',
    role : 'Head of Full-stack Development',
    bio  : 'Head of Full-stack Development. Full-stack developer. 99x Trainee Software Engineer.3 years Hand on project experience.',
    image: '/images/team/dulanjaya.jpeg', // ← photo URL මෙතන දාන්න
  },

];

const values = [
  { icon: Target, title: 'Precision',   desc: 'We obsess over every detail, from database schema to pixel alignment.' },
  { icon: Heart,  title: 'Care',        desc: 'We treat your project as if it were our own business on the line.' },
  { icon: Users,  title: 'Partnership', desc: 'We work alongside you, not just for you. Transparent and collaborative.' },
  { icon: Award,  title: 'Excellence',  desc: "We refuse to ship code we're not proud of. Quality is non-negotiable." },
];

// Team member card — photo තියෙනවා නම් photo, නැත්නම් initials
function TeamCard({ member, index }) {
  const { name, role, bio, image } = member;
  const initials = name.split(' ').map(n => n[0]).join('');

  return (
    <motion.div
      key={name}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08 }}
      className="p-6 text-center glass glass-hover group"
    >
      {/* Photo හෝ Initials */}
      <div className="relative w-20 h-20 mx-auto mb-4">
        {image ? (
          // Real photo
          <img
            src={image}
            alt={name}
            className="object-cover w-20 h-20 mx-auto transition-transform duration-300 rounded-full group-hover:scale-105"
            style={{
              border: '2px solid rgba(0,255,136,0.3)',
              boxShadow: '0 0 20px rgba(0,255,136,0.1)',
            }}
            onError={(e) => {
              // Photo load නොවුනොත් initials fallback
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}

        {/* Initials fallback — photo නැත්නම් හෝ load error නම් */}
        <div
          className="flex items-center justify-center w-20 h-20 text-2xl font-black rounded-full"
          style={{
            display: image ? 'none' : 'flex',
            background: 'linear-gradient(135deg, rgba(0,255,136,0.2), rgba(99,102,241,0.2))',
            border: '2px solid rgba(0,255,136,0.25)',
            fontFamily: 'var(--font-display)',
            color: 'var(--acid)',
          }}
        >
          {initials}
        </div>

        {/* Online dot */}
        <div
          className="absolute bottom-0.5 right-0.5 w-4 h-4 rounded-full border-2"
          style={{ background: 'var(--acid)', borderColor: 'var(--bg2)' }}
        />
      </div>

      <h3 className="font-bold text-base mb-0.5" style={{ fontFamily: 'var(--font-display)' }}>
        {name}
      </h3>
      <div className="mb-3 text-xs" style={{ color: 'var(--acid)', fontFamily: 'var(--font-mono)' }}>
        {role}
      </div>
      <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
        {bio}
      </p>
    </motion.div>
  );
}

export default function About() {
  return (
    <>
      <SEOHead
        title="About"
        description="Built by builders, for builders. Learn about the Alona Software team, mission, and values."
        path="/about"
      />

      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden grid-bg">
        <div className="px-6 mx-auto max-w-7xl">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div className="mb-6 badge">Our Story</div>
            <h1 className="mb-6 text-5xl font-black md:text-7xl" style={{ fontFamily: 'var(--font-display)', maxWidth: '800px' }}>
              Built by builders,<br /><span className="grad-text">for builders.</span>
            </h1>
            <p className="max-w-2xl text-xl" style={{ color: 'var(--text-muted)', lineHeight: 1.8 }}>
              Alona was founded in 2026 by engineers who were tired of agencies that overpromised and underdelivered. We built the company we wished existed.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission */}
      <section className="section" style={{ background: 'var(--bg2)' }}>
        <div className="px-6 mx-auto max-w-7xl">
          <div className="grid items-center grid-cols-1 gap-16 lg:grid-cols-2">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <div className="mb-6 badge">Mission</div>
              <h2 className="mb-6 text-4xl font-black" style={{ fontFamily: 'var(--font-display)' }}>
                Software that moves<br /><span className="grad-text">business forward.</span>
              </h2>
              <p className="mb-4 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                We started Alona because the world needed a software company that actually cared — about code quality, about deadlines, about outcomes. Not just deliverables.
              </p>
              <p className="leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                Today we're a team of 4+ engineers, designers, and product thinkers working with companies from early-stage startups to Fortune 500s.
              </p>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <div className="grid grid-cols-2 gap-4">
                {[['2026', 'Founded'], ['4+', 'Projects'], ['4+', 'Team Size'], ['1', 'Countries']].map(([val, label]) => (
                  <div key={label} className="p-6 text-center glass">
                    <div className="mb-1 text-3xl font-black" style={{ fontFamily: 'var(--font-display)', color: 'var(--acid)' }}>{val}</div>
                    <div className="text-sm" style={{ color: 'var(--text-muted)' }}>{label}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section grid-bg">
        <div className="px-6 mx-auto max-w-7xl">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-12">
            <div className="mb-4 badge">Our Values</div>
            <h2 className="text-4xl font-black" style={{ fontFamily: 'var(--font-display)' }}>What drives us</h2>
          </motion.div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {values.map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="p-6 glass glass-hover"
              >
                <div className="flex items-center justify-center w-10 h-10 mb-4"
                  style={{ background: 'rgba(0,255,136,0.1)', border: '1px solid rgba(0,255,136,0.2)', clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))' }}>
                  <Icon size={18} style={{ color: 'var(--acid)' }} />
                </div>
                <h3 className="mb-2 font-bold" style={{ fontFamily: 'var(--font-display)' }}>{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section" style={{ background: 'var(--bg2)' }}>
        <div className="px-6 mx-auto max-w-7xl">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-12">
            <div className="mb-4 badge">The Team</div>
            <h2 className="text-4xl font-black" style={{ fontFamily: 'var(--font-display)' }}>
              The people behind the code
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((member, i) => (
              <TeamCard key={member.name} member={member} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 text-center grid-bg">
        <div className="max-w-3xl px-6 mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="mb-6 text-4xl font-black" style={{ fontFamily: 'var(--font-display)' }}>
              Join our growing team
            </h2>
            <p className="mb-8" style={{ color: 'var(--text-muted)' }}>
              We're always looking for talented engineers and designers.
            </p>
            <Link href="/contact" className="btn-primary">
              Work With Us <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}

About.getLayout = (page) => <Layout>{page}</Layout>;
