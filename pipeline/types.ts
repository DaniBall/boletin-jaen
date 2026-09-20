import type { SectionId } from './config.ts';

export type { SectionId };

export interface Item {
  /** Estable: hash(fuente + url o título). */
  id: string;
  /** Id del colector que lo trajo. */
  source: string;
  section: SectionId;
  title: string;
  /** Texto de la fuente: solo para el prompt, nunca se publica tal cual. */
  summary?: string;
  url?: string;
  /** Eventos. */
  startsAt?: string;
  endsAt?: string;
  place?: string;
  publishedAt?: string;
  /** Secciones deterministas (precios, temperaturas…). */
  data?: Record<string, unknown>;
}

export interface CollectContext {
  /** AAAA-MM-DD en Europe/Madrid. */
  date: string;
}

export interface Collector {
  /** 'aemet', 'ayto-agenda', 'rss-diario-jaen'… */
  id: string;
  section: SectionId;
  collect(ctx: CollectContext): Promise<Item[]>;
}

/** Frontmatter de una edición. */
export interface EditionFrontmatter {
  fecha: string;
  numero: number;
  estado: 'borrador' | 'publicada';
  fuentes: { id: string; nombre: string; url?: string }[];
  avisos?: string[];
}

export interface Edition {
  frontmatter: EditionFrontmatter;
  /** Cuerpo en Markdown, sin frontmatter. */
  body: string;
}
