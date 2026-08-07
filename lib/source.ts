import { loader } from 'fumadocs-core/source';
import { anleitungenDocs, adminDocs } from '@/.source';

export const anleitungenSource = loader({
  baseUrl: '/anleitungen',
  source: {
    files: anleitungenDocs.toFumadocsSource().files(),
  },
});

export const adminSource = loader({
  baseUrl: '/anleitungen/admin',
  source: {
    files: adminDocs.toFumadocsSource().files(),
  },
});
