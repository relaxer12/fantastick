/** @type {import('next').NextConfig} */

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
  // Tell crawlers not to index API/internal routes via header (belt + suspenders with robots.txt)
  {
    key: 'X-Robots-Tag',
    value: 'noindex, nofollow',
    // Applied only to /api/* via the matcher below
  },
];

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pub-426ed2c6f024444c8b80fb544d13a890.r2.dev',
      },
      // Legacy — remove once all placeholders are replaced
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
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
