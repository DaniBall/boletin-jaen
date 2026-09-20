import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'zod';
import { normalizeIsoDate } from '../pipeline/lib/fechas.ts';

const ediciones = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './content/ediciones' }),
  schema: z.object({
    // El YAML sin comillas entrega un Date; se normaliza a AAAA-MM-DD.
    fecha: z.union([z.string(), z.date()]).transform(normalizeIsoDate),
    numero: z.number().int().positive(),
    estado: z.enum(['borrador', 'publicada']),
    fuentes: z
      .array(
        z.object({
          id: z.string(),
          nombre: z.string(),
          url: z.url().optional(),
        }),
      )
      .default([]),
    avisos: z.array(z.string()).default([]),
  }),
});

export const collections = { ediciones };
