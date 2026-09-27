import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';
import { KiAblauf } from './ki-support/ablauf';
import { KiFreigabe } from './ki-support/freigabe';
import { KiGrenzen } from './ki-support/grenzen';
import { KiPlatzhalter } from './ki-support/platzhalter';

/** Komponenten, die in jeder MDX-Seite ohne Import verfügbar sind. */
export const mdxComponents: MDXComponents = {
  ...defaultMdxComponents,
  KiAblauf,
  KiFreigabe,
  KiGrenzen,
  KiPlatzhalter,
};
