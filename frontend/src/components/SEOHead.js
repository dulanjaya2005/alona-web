import Head from 'next/head';

const SITE_NAME = 'Alona Software';
const SITE_URL  = process.env.NEXT_PUBLIC_SITE_URL || 'https://alona.dev';
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-default.png`;

/**
 * SEOHead — drop-in Head component with full Open Graph + Twitter card support.
 *
 * Usage:
 *   <SEOHead
 *     title="Services"
 *     description="End-to-end digital services engineered for performance."
 *     path="/services"
 *   />
 */
export default function SEOHead({
  title,
  description = 'We build blazing-fast, scalable web and mobile applications for forward-thinking companies.',
  path = '',
  ogImage = DEFAULT_OG_IMAGE,
  noIndex = false,
}) {
  const fullTitle = title ? `${title} — ${SITE_NAME}` : `${SITE_NAME} — Digital Products That Scale`;
  const canonical = `${SITE_URL}${path}`;

  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description"        content={description} />
      <link rel="canonical"           href={canonical} />
      {noIndex && <meta name="robots" content="noindex,nofollow" />}

      {/* Open Graph */}
      <meta property="og:type"        content="website" />
      <meta property="og:site_name"   content={SITE_NAME} />
      <meta property="og:title"       content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url"         content={canonical} />
      <meta property="og:image"       content={ogImage} />
      <meta property="og:image:width"  content="1200" />
      <meta property="og:image:height" content="630" />

      {/* Twitter Card */}
      <meta name="twitter:card"        content="summary_large_image" />
      <meta name="twitter:title"       content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image"       content={ogImage} />

      {/* Misc */}
      <meta name="viewport"  content="width=device-width, initial-scale=1" />
      <meta name="theme-color" content="#0a0a0f" />
    </Head>
  );
}
