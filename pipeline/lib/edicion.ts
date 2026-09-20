import { readFile } from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
import { brand, paths } from '../config.ts';
import type { Edition, EditionFrontmatter } from '../types.ts';
import { normalizeIsoDate, type IsoDate } from './fechas.ts';

export function editionPath(date: IsoDate, root = process.cwd()): string {
  return path.join(root, paths.editions, `${date}.md`);
}

/** URL pública de una edición, a partir de la marca. */
export function editionUrl(date: IsoDate): string {
  const base = `${brand.site.replace(/\/$/, '')}${brand.base.replace(/\/$/, '')}`;
  return `${base}/ediciones/${date}/`;
}

export async function readEdition(date: IsoDate, root = process.cwd()): Promise<Edition> {
  const file = editionPath(date, root);
  let raw: string;
  try {
    raw = await readFile(file, 'utf8');
  } catch {
    throw new Error(`No hay edición para ${date} (${path.relative(root, file)}).`);
  }

  const parsed = matter(raw);
  const data = parsed.data as Omit<EditionFrontmatter, 'fecha'> & { fecha: string | Date };
  return {
    frontmatter: { ...data, fecha: normalizeIsoDate(data.fecha) },
    body: parsed.content.trim(),
  };
}
