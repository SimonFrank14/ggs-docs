import { defineDocs, defineConfig } from 'fumadocs-mdx/config';
import { rehypeCode } from 'fumadocs-core/mdx-plugins';

export const anleitungenDocs = defineDocs({
  dir: 'content/anleitungen',
});

export const adminDocs = defineDocs({
  dir: 'content/admin',
});

export default defineConfig({
  mdxOptions: {
    rehypePlugins: [rehypeCode],
  },
});
