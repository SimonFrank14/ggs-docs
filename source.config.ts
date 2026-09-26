import { defineDocs, defineConfig, frontmatterSchema } from 'fumadocs-mdx/config';
import { checkDocFrontmatter, docAccessFields } from './lib/runbook';

export const docs = defineDocs({
  dir: 'content/docs',
  docs: {
    schema: frontmatterSchema.extend(docAccessFields).superRefine(checkDocFrontmatter),
  },
});

export default defineConfig();
