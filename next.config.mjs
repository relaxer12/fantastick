/** @type {import('next').NextConfig} */

// ─── Content Security Policy ──────────────────────────────────────────────────
// Controls which origins the browser is allowed to load resources from.
// This is the last line of defence against XSS data exfiltration.
//
// Limitations:
//   • script-src requires 'unsafe-inline' because Next.js App Router injects
//     inline hydration scripts. A nonce-based CSP would remove this requirement
//     but needs a middleware rewrite — left as a future hardening step.
//   • 'unsafe-eval' is intentionally excluded (not needed in production builds).
//
// What this still protects against even with 'unsafe-inline':
//   • connect-src  — prevents exfiltrating data via fetch/XHR to attacker domains
//   • img-src      — prevents pixel-tracking / data-URI exfiltration via images
//   • object-src   — blocks Flash / legacy plugin attacks
//   • base-uri     — prevents <base> tag hijacking
//   • frame-src    — prevents the page from embedding external iframes
const R2_PUBLIC_HOSTNAME = 'pub-426ed2c6f024444c8b80fb544d13a890.r2.dev';

const cspDirectives = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  // R2 (primary photo storage) + Cloudinary (order image processing)
  `img-src 'self' data: https://${R2_PUBLIC_HOSTNAME} https://res.cloudinary.com`,
  // next/font/google self-hosts at build time — no external font CDN needed
  "font-src 'self' data:",
  // All API calls are same-origin; no client-side Stripe.js (checkout is a server-side redirect)
  "connect-src 'self'",
  "frame-src 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "media-src 'none'",
].join('; ');

const securityHeaders = [
  // Prevent clickjacking — only this origin can frame the site
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN',
  },
  // Stop MIME-type sniffing
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  // Limit referrer data sent to third parties
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  // Restrict access to browser features we don't use
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  },
  // Force HTTPS for 2 years, include subdomains
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  // Content Security Policy — restrict resource origins to prevent XSS exfiltration
  {
    key: 'Content-Security-Policy',
    value: cspDirectives,
  },
  // Tell crawlers not to index API/internal routes via header (belt + suspenders with robots.txt)
  {
    key: 'X-Robots-Tag',
    value: 'noindex, nofollow',
    // Applied only to /api/* via the matcher below
  },
];

const nextConfig = {
  images: {
    // Cache optimized images for 30 days instead of the default 60 seconds.
    // This is the primary lever for reducing Vercel Image Optimization cache writes.
    minimumCacheTTL: 2592000,

    // Restrict to 3 breakpoints instead of the default 8.
    // Photography site — desktop/tablet/mobile is all we need.
    // Fewer breakpoints = fewer unique cached variants per image.
    deviceSizes: [640, 1080, 1920],
    imageSizes: [256, 512],

    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pub-426ed2c6f024444c8b80fb544d13a890.r2.dev',
      },
      // Cloudinary kept for order-image processing (prepareOrderImage)
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      // picsum removed — placeholder replaced with R2 asset
    ],
  },

  async headers() {
    return [
      {
        // Apply core security headers to all routes
        source: '/(.*)',
        headers: securityHeaders.filter((h) => h.key !== 'X-Robots-Tag'),
      },
      {
        // Block indexing of API routes specifically
        source: '/api/(.*)',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
      },
    ];
  },
};

export default nextConfig;
