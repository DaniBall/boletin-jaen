import { getCollection, type CollectionEntry } from 'astro:content';

export type Edicion = CollectionEntry<'ediciones'>;

/** Ediciones publicadas, de la más reciente a la más antigua. */
export async function edicionesPublicadas(): Promise<Edicion[]> {
  const todas = await getCollection('ediciones', ({ data }) => data.estado === 'publicada');
  return todas.sort((a, b) => b.data.fecha.localeCompare(a.data.fecha));
}

export async function ultimaEdicion(): Promise<Edicion | undefined> {
  return (await edicionesPublicadas())[0];
}
