/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Fully static export (written to out/) for hosting on a static site, e.g. Render.
  output: "export",
  // Emit cart/index.html instead of cart.html so clean URLs work on any static host.
  trailingSlash: true,
};
export default nextConfig;
