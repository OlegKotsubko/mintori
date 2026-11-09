/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Fully static export for hosting on a static site, e.g. Render.
  output: "export",
  // Write the export to build/, the directory Render publishes.
  distDir: "build",
  // Emit cart/index.html instead of cart.html so clean URLs work on any static host.
  trailingSlash: true,
};
export default nextConfig;
