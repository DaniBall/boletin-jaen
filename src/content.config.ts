import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'zod';
import { ciudadActual } from '../ciudades/index.ts';
import { paths } from '../pipeline/config.ts';
import { normalizeIsoDate } from '../pipeline/lib/fechas.ts';

// Solo se cargan las ediciones de la ciudad que se está construyendo.
const ciudad = ciudadActual();

const ediciones = defineCollection({
  loader: glob({ pattern: '**/*.md', base: `./${paths.content}/${ciudad.id}/ediciones` }),
  schema: z.object({
    ciudad: z.literal(ciudad.id),
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
