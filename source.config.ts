import { defineDocs, defineConfig, frontmatterSchema } from 'fumadocs-mdx/config';
import { checkDocFrontmatter, docAccessFields } from './lib/runbook';

export const docs = defineDocs({
  dir: 'content/docs',
  docs: {
    schema: frontmatterSchema.extend(docAccessFields).superRefine(checkDocFrontmatter),
  },
  // Nur meta.json ist Navigation. Outstatic legt im selben Baum schema.json
  // (pro Sammlung) und metadata.json ab; ohne diese Einschränkung liest
  // fumadocs jede JSON-Datei als Navigationsdatei.
  meta: {
    files: ['**/meta.json'],
  },
});

export default defineConfig();
