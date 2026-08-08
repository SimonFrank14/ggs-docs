import { loader } from 'fumadocs-core/source';
import { docs } from '@/.source';

// fumadocs-mdx 11.10.1 widerspricht sich zwischen Laufzeit und Typdeklaration:
// - Laufzeit (node_modules/fumadocs-mdx/dist/chunk-UOOPSLFY.js:45-51,
//   createMDXSource): `files` ist eine Funktion, die die Datei-Liste erzeugt.
// - Typdeklaration (node_modules/fumadocs-core/dist/builder-5BHIAfCi.d.ts:146-147,
//   interface Source): `files` sei bereits ein Array.
// Wir folgen der Laufzeit (sonst erhält `loader` eine Funktion statt eines
// Arrays und stürzt beim internen `.map()` ab) und casten nur an dieser einen
// Stelle, um den daraus entstehenden Typkonflikt aufzulösen.
type FumadocsSource = ReturnType<typeof docs.toFumadocsSource>;
const rawSource = docs.toFumadocsSource() as unknown as {
  files: () => FumadocsSource['files'];
};

export const docsSource = loader({
  baseUrl: '/',
  source: {
    files: rawSource.files(),
  },
});
