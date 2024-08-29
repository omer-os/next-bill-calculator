const withPWA = require("@ducanh2912/next-pwa").default({
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  swcMinify: true,
  dest: "public",
  
  workboxOptions: {
    disableDevLogs: true,
  },
  // ... other options you like
});
/** @type {import('next').NextConfig} */
const nextConfig = {
  // ... other options you like
};

module.exports = withPWA(nextConfig);