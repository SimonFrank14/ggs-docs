import { createMDXSource } from 'fumadocs-mdx';
import { loader } from 'fumadocs-core/source';
import { anleitungen, admin } from '@/.source';

export const anleitungenSource = loader({
  baseUrl: '/anleitungen',
  source: createMDXSource(anleitungen.docs, anleitungen.meta),
});

export const adminSource = loader({
  baseUrl: '/anleitungen/admin',
  source: createMDXSource(admin.docs, admin.meta),
});
