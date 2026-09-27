import { describe, expect, it } from 'vitest';
import { safeRedirectTarget } from './redirect';

describe('safeRedirectTarget', () => {
  it('lässt Pfade auf dieser Seite durch', () => {
    expect(safeRedirectTarget('/runbooks/shared-ipad-cache-leeren')).toBe('/runbooks/shared-ipad-cache-leeren');
    expect(safeRedirectTarget('/')).toBe('/');
  });

  it.each(['https://example.org', '//example.org', '/\\example.org', 'runbooks', '', undefined, ['/a']])(
    'schickt %j auf die Startseite',
    (value) => {
      expect(safeRedirectTarget(value)).toBe('/');
    },
  );
});
