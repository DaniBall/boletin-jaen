import type { SectionDef } from '../pipeline/types.ts';

/**
 * Las secciones que comparten todas las ciudades, en el orden de la edición.
 * Cada ciudad las extiende con las suyas: `[...seccionesComunes('Jaén'), aceite]`.
 *
 * Vive en `ciudades/` y no en `pipeline/` porque lleva el nombre de la ciudad
 * dentro: el motor no conoce ninguna (regla 8).
 */
export function seccionesComunes(cityName: string): SectionDef[] {
  return [
    { id: 'tiempo', title: '☀️ El tiempo', writer: 'code' },
    { id: 'agenda', title: `📅 Hoy en ${cityName}`, writer: 'ai' },
    { id: 'finde', title: '🎉 Este finde', writer: 'ai' },
    { id: 'movilidad', title: '🚧 Movilidad', writer: 'ai' },
    { id: 'te_afecta', title: '📰 Te afecta', writer: 'ai' },
    { id: 'farmacias', title: '💊 Farmacias de guardia', writer: 'code' },
    { id: 'carburantes', title: '⛽ Gasolina más barata', writer: 'code' },
  ];
}
