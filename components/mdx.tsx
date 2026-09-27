import { ImageZoom, type ImageZoomProps } from 'fumadocs-ui/components/image-zoom';
import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';
import { KiAblauf } from './ki-support/ablauf';
import { KiFreigabe } from './ki-support/freigabe';
import { KiGrenzen } from './ki-support/grenzen';
import { KiPlatzhalter } from './ki-support/platzhalter';

// `children` setzt ImageZoom selbst, der Typ verlangt es trotzdem
const zoomLabels = {
  a11yNameButtonZoom: 'Bild vergrößern',
  a11yNameButtonUnzoom: 'Bild verkleinern',
} as ImageZoomProps['rmiz'];

/** Komponenten, die in jeder MDX-Seite ohne Import verfügbar sind. */
export const mdxComponents: MDXComponents = {
  ...defaultMdxComponents,
  // Screenshots per Tippen/Klick vergrößern, vor allem auf dem Handy
  img: (props) => (
    <ImageZoom
      {...(props as ImageZoomProps)}
      rmiz={zoomLabels}
    />
  ),
  KiAblauf,
  KiFreigabe,
  KiGrenzen,
  KiPlatzhalter,
};
