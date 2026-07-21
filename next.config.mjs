/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/lawfirm',
  // Optional: also serve under the root path
  // For dev with Traefik sub-path, we only need basePath
  experimental: {
    // Helps with long compile under low memory
  },
  // Standalone build output for production
  output: undefined,
};

export default nextConfig;
