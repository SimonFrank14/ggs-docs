import { defineDocs, defineConfig } from 'fumadocs-mdx/config';
import { rehypeCode } from 'fumadocs-core/mdx-plugins';

export const anleitungen = defineDocs({
  dir: 'content/anleitungen',
});

export const admin = defineDocs({
  dir: 'content/admin',
});

export default defineConfig({
  mdxOptions: {
    rehypePlugins: [rehypeCode],
  },
});
