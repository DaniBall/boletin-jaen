import { describe, expect, it } from 'vitest';
import { hasEdition, inSeason, isFriday, normalizeIsoDate } from '../pipeline/lib/fechas.ts';

describe('hasEdition', () => {
  it('hay edición de lunes a viernes', () => {
    expect(hasEdition('2026-09-18', [])).toBe(true); // viernes
  });

  it('no hay edición el fin de semana', () => {
    expect(hasEdition('2026-09-19', [])).toBe(false); // sábado
    expect(hasEdition('2026-09-20', [])).toBe(false); // domingo
  });

  it('no hay edición en un festivo de esa ciudad', () => {
    expect(hasEdition('2026-09-18', ['2026-09-18'])).toBe(false);
  });
});

describe('isFriday', () => {
  it('detecta el viernes, que es el día de «Este finde»', () => {
    expect(isFriday('2026-09-18')).toBe(true);
    expect(isFriday('2026-09-17')).toBe(false);
  });
});

describe('inSeason', () => {
  const invierno = { from: '11-01', to: '03-31' };
  const verano = { from: '06-01', to: '09-30' };

  it('acepta un tramo que cruza el cambio de año', () => {
    expect(inSeason('2026-12-15', invierno)).toBe(true);
    expect(inSeason('2026-01-15', invierno)).toBe(true);
    expect(inSeason('2026-11-01', invierno)).toBe(true);
    expect(inSeason('2026-03-31', invierno)).toBe(true);
  });

  it('deja fuera lo que no cae en el tramo', () => {
    expect(inSeason('2026-09-18', invierno)).toBe(false);
    expect(inSeason('2026-06-01', invierno)).toBe(false);
  });

  it('funciona con un tramo normal dentro del mismo año', () => {
    expect(inSeason('2026-07-15', verano)).toBe(true);
    expect(inSeason('2026-10-01', verano)).toBe(false);
  });

  it('rechaza un formato que no sea MM-DD', () => {
    expect(() => inSeason('2026-09-18', { from: '2026-11-01', to: '03-31' })).toThrow(
      /Temporada inválida/,
    );
  });
});

describe('normalizeIsoDate', () => {
  it('acepta la cadena tal cual', () => {
    expect(normalizeIsoDate('2026-09-18')).toBe('2026-09-18');
  });

  it('convierte el Date que entrega el YAML sin comillas', () => {
    expect(normalizeIsoDate(new Date('2026-09-18T00:00:00Z'))).toBe('2026-09-18');
  });
});
