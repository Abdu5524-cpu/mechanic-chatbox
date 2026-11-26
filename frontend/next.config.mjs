/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export: the site is plain HTML/JS served from a CDN.
  // All Claude calls happen on the backend, so nothing secret is bundled here.
  output: "export",
  reactStrictMode: true,
  poweredByHeader: false,
};

export default nextConfig;
