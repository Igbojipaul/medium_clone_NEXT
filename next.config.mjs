/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["localhost"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      new URL("http://localhost:8000/media/**"),
      new URL("https://upload.wikimedia.org/**"),
    ],
  },
};

export default nextConfig;
