/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://apis.google.com https://www.gstatic.com https://www.googletagmanager.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' data: https://fonts.gstatic.com",
              "img-src 'self' data: blob: https://*.googleusercontent.com https://www.gstatic.com https://www.google.com",
              "connect-src 'self' https://*.googleapis.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://firestore.googleapis.com https://www.googleapis.com https://*.firebaseio.com https://*.firebaseapp.com https://*.web.app",
              "frame-src 'self' https://accounts.google.com https://*.firebaseapp.com https://*.web.app",
              "child-src 'self' https://accounts.google.com https://*.firebaseapp.com https://*.web.app",
              "frame-ancestors 'self' https://urai-admin-73155349.firebaseapp.com https://urai-admin-73155349.web.app https://urai-admin.web.app",
              "form-action 'self' https://accounts.google.com",
            ].join('; '),
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'geolocation=(), microphone=(), camera=()',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
