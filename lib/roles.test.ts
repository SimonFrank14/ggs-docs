import { describe, expect, it } from 'vitest';
import { DOC_ROLES, isDocRole, mapWpRoles } from './roles';

describe('DOC_ROLES', () => {
  it('enthält genau die sechs vereinbarten Werte', () => {
    expect([...DOC_ROLES]).toEqual([
      'public', 'eltern', 'schueler', 'lehrer', 'verwaltung', 'admin',
    ]);
  });
});

describe('isDocRole', () => {
  it('erkennt gültige Rollen', () => {
    expect(isDocRole('lehrer')).toBe(true);
    expect(isDocRole('admin')).toBe(true);
  });

  it('weist Unbekanntes ab', () => {
    expect(isDocRole('hausmeister')).toBe(false);
    expect(isDocRole('')).toBe(false);
    expect(isDocRole(null)).toBe(false);
    expect(isDocRole(42)).toBe(false);
  });
});

describe('mapWpRoles', () => {
  it('bildet den WordPress-Administrator auf admin ab', () => {
    expect(mapWpRoles(['administrator'])).toEqual(['admin']);
  });

  it('bildet mehrere WP-Rollen zusammen ab, ohne Duplikate', () => {
    const result = mapWpRoles([
      'pms_subscription_plan_1456',
      'pms_subscription_plan_11698',
      'pms_subscription_plan_1456',
    ]);
    expect([...result].sort()).toEqual(['eltern', 'lehrer']);
  });

  it('bildet Schüler und Oberstufe beide auf schueler ab', () => {
    expect(mapWpRoles(['pms_subscription_plan_1455'])).toEqual(['schueler']);
    expect(mapWpRoles(['pms_subscription_plan_3799'])).toEqual(['schueler']);
  });

  it('gibt Stundenplanern keine Doku-Rolle', () => {
    expect(mapWpRoles(['stundenplaner'])).toEqual([]);
  });

  it('ignoriert unbekannte WP-Rollen, statt sie durchzureichen', () => {
    expect(mapWpRoles(['irgendwas'])).toEqual([]);
  });

  it('liefert für eine leere Eingabe keine Rollen', () => {
    expect(mapWpRoles([])).toEqual([]);
  });
});
