import { readFile } from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
import { paths } from '../config.ts';
import type { CityConfig, Edition, EditionFrontmatter } from '../types.ts';
import { normalizeIsoDate, type IsoDate } from './fechas.ts';

/** content/<ciudad>/ediciones */
export function editionsDir(cityId: string, root = process.cwd()): string {
  return path.join(root, paths.content, cityId, 'ediciones');
}

export function editionPath(cityId: string, date: IsoDate, root = process.cwd()): string {
  return path.join(editionsDir(cityId, root), `${date}.md`);
}

/** URL pública de una edición, a partir del dominio de la ciudad. */
export function editionUrl(city: CityConfig, date: IsoDate): string {
  return `${city.brand.domain.replace(/\/$/, '')}/ediciones/${date}/`;
}

export async function readEdition(
  cityId: string,
  date: IsoDate,
  root = process.cwd(),
): Promise<Edition> {
  const file = editionPath(cityId, date, root);
  let raw: string;
  try {
    raw = await readFile(file, 'utf8');
  } catch {
    throw new Error(`No hay edición de ${cityId} para ${date} (${path.relative(root, file)}).`);
  }

  const parsed = matter(raw);
  const data = parsed.data as Omit<EditionFrontmatter, 'fecha'> & { fecha: string | Date };
  return {
    frontmatter: { ...data, fecha: normalizeIsoDate(data.fecha) },
    body: parsed.content.trim(),
  };
}
