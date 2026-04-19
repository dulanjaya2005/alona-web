import Link from 'next/link';
import Image from 'next/image';
import { Zap, Github, Twitter, Linkedin } from 'lucide-react';

// ✅ ඔබේ settings මෙතන වෙනස් කරන්න
const LOGO_IMAGE    = '/logo.png';            // ← '/logo.png' කරන්න logo image දාන්නේ නම්
const LOGO_TEXT     = 'ALONA';         // ← ඔබේ company name
const LOGO_WIDTH    = 110;             // ← logo width
const LOGO_HEIGHT   = 40;              // ← logo height
const COMPANY_NAME  = 'Alona Software'; // ← copyright name
const DESCRIPTION   = 'We build high-performance digital products that scale. From concept to deployment, we make your vision a reality.';

// ✅ Social media links වෙනස් කරන්න
const SOCIAL_LINKS = [
  { icon: Github,   href: '#' },  // ← ඔබේ GitHub URL
  { icon: Twitter,  href: '#' },  // ← ඔබේ Twitter URL
  { icon: Linkedin, href: '#' },  // ← ඔබේ LinkedIn URL
];

// ✅ Footer links වෙනස් කරන්න
const footerLinks = {
  Company: [
    { label: 'About',    href: '/about'    },
    { label: 'Projects', href: '/projects' },
    { label: 'Services', href: '/services' },
    { label: 'Contact',  href: '/contact'  },
  ],
  Services: [
    { label: 'Web Development', href: '/services' },
    { label: 'Mobile Apps',     href: '/services' },
    { label: 'UI/UX Design',    href: '/services' },
    { label: 'Cloud Solutions', href: '/services' },
  ],
};

// Logo component — image තියෙනවා නම් image, නැත්නම් text
function FooterLogo() {
  if (LOGO_IMAGE) {
    return (
      <Image
        src={LOGO_IMAGE}
        alt={LOGO_TEXT}
        width={LOGO_WIDTH}
        height={LOGO_HEIGHT}
        className="object-contain"
      />
    );
  }

  return (
    <div className="flex items-center gap-2">
      <div
        className="flex items-center justify-center w-8 h-8"
        style={{
          background: 'var(--acid)',
          clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))',
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

export default function Footer() {
  return (
    <footer style={{ background: 'var(--bg2)', borderTop: '1px solid var(--border)' }}>
      <div className="px-6 py-16 mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-12 mb-12 md:grid-cols-4">

          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4 w-fit">
              <FooterLogo />
            </Link>

            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.8, maxWidth: '320px' }}>
              {DESCRIPTION}
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-3 mt-6">
              {SOCIAL_LINKS.map(({ icon: Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center transition-all duration-200 rounded w-9 h-9"
                  style={{ border: '1px solid var(--border)', color: 'var(--text-muted)' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--acid)';
                    e.currentTarget.style.color = 'var(--acid)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border)';
                    e.currentTarget.style.color = 'var(--text-muted)';
                  }}
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h4 style={{
                fontFamily   : 'var(--font-display)',
                fontSize     : '0.8rem',
                letterSpacing: '0.12em',
                color        : 'var(--acid)',
                marginBottom : '16px',
                textTransform: 'uppercase',
              }}>
                {section}
              </h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="block text-sm transition-colors duration-200 w-fit"
                      style={{ color: 'var(--text-muted)' }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          className="flex flex-col items-center justify-between gap-4 pt-8 md:flex-row"
          style={{ borderTop: '1px solid var(--border)' }}
        >
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}>
            © {new Date().getFullYear()} {COMPANY_NAME}. All rights reserved.
          </p>
          <div />
        </div>
      </div>
    </footer>
  );
}