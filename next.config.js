// next.config.js (CommonJS, works with JS projects)
const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: false,
  cacheOnFrontEndNav: true,
  workboxOptions: {
    navigateFallback: "/offline",
    runtimeCaching: [
      {
        urlPattern: ({ request }) => request.mode === "navigate",
        handler: "NetworkFirst",
        options: {
          cacheName: "html-pages",
          networkTimeoutSeconds: 3,
          expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 },
          matchOptions: { ignoreSearch: true },
        },
      },
      {
        urlPattern: /^\/_next\/static\/.*/i,
        handler: "CacheFirst",
        options: {
          cacheName: "next-static",
          expiration: { maxEntries: 64, maxAgeSeconds: 60 * 60 * 24 * 30 },
        },
      },
      {
        urlPattern: ({ request, url }) =>
          request.destination === "image" ||
          url.pathname.startsWith("/images/"),
        handler: "StaleWhileRevalidate",
        options: {
          cacheName: "images",
          expiration: { maxEntries: 128, maxAgeSeconds: 60 * 60 * 24 * 30 },
        },
      },
      {
        urlPattern:
          /https:\/\/fonts\.(?:gstatic|googleapis)\.com\/|\/fonts\/.*\.(?:woff2?|ttf|otf)$/i,
        handler: "CacheFirst",
        options: {
          cacheName: "fonts",
          expiration: { maxEntries: 32, maxAgeSeconds: 60 * 60 * 24 * 365 },
        },
      },
      {
        urlPattern: /\/api\/.*|https:\/\/api\.spawnpoint\.app\/.*/i,
        handler: "NetworkFirst",
        options: {
          cacheName: "api",
          networkTimeoutSeconds: 4,
          expiration: { maxEntries: 64, maxAgeSeconds: 60 * 10 },
        },
      },
    ],
  },
});

const nextConfig = {
  reactStrictMode: true,
  // output: "standalone", // uncomment if you want standalone build
};

module.exports = withPWA(nextConfig);
