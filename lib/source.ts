import { loader } from 'fumadocs-core/source';
import { docs } from '@/.source';

export const docsSource = loader({
  baseUrl: '/',
  source: docs.toFumadocsSource(),
});
