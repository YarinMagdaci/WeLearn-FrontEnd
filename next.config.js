/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "res.cloudinary.com",
      "randomuser.me",
      "https://player.vdocipher.com",
      "https://js.stripe.com",
      "https://m.stripe.network",
    ],
  },
};

module.exports = nextConfig;
