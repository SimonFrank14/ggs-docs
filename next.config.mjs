import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  output: 'standalone',
  // Jede Seite auch als Markdown: /wlan-drucken/schul-wlan.md (lib/llm.ts)
  async rewrites() {
    return [{ source: '/:path*.md', destination: '/llms.md/:path*' }];
  },
};

export default withMDX(config);
