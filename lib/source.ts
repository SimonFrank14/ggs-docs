import { loader } from 'fumadocs-core/source';
import { createMDXSource } from 'fumadocs-mdx';
import { anleitungenDocs, adminDocs } from '@/.source';

export const anleitungenSource = loader({
  baseUrl: '/anleitungen',
  source: createMDXSource(anleitungenDocs),
});

export const adminSource = loader({
  baseUrl: '/anleitungen/admin',
  source: createMDXSource(adminDocs),
});
