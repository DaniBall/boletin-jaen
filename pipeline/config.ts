/**
 * Configuración única del boletín. Toda la marca sale de aquí: mientras el
 * nombre y el dominio estén sin decidir, se cambian en este archivo y no hay
 * que tocar nada más.
 */

export const TIMEZONE = 'Europe/Madrid' as const;

export interface Brand {
  name: string;
  longName: string;
  tagline: string;
  site: string;
  base: string;
  whatsappChannelUrl: string;
  inboxUrl: string;
  contactEmail: string;
  locale: string;
}

/** Marca provisional. Pendiente de decidir (candidatos: «El Lagarto», «Pipirrana»). */
export const brand: Brand = {
  /** Nombre corto, el que se ve en la web y en el saludo. */
  name: 'Boletín de Jaén',
  /** Nombre largo para títulos de página y metadatos. */
  longName: 'Boletín diario de Jaén',
  /** Promesa en una línea. */
  tagline: 'Lo útil de Jaén, cada mañana en tu WhatsApp.',
  /** Dominio propio. Pendiente de decidir; hasta entonces, la URL de Pages. */
  site: 'https://example.invalid',
  /** Ruta base dentro del dominio. '/' con dominio propio. */
  base: '/',
  /** URL del Canal de WhatsApp. Se rellena al crearlo (fase 1). */
  whatsappChannelUrl: '',
  /** Buzón de avisos de los vecinos (número de WhatsApp Business o formulario). */
  inboxUrl: '',
  /** Contacto que va en el User-Agent del pipeline y en el aviso legal. */
  contactEmail: '',
  locale: 'es-ES',
};

/** Alcance editorial: la capital y lo del entorno que te cambia el día. */
export const scope = {
  city: 'Jaén',
  /** Código INE del municipio, para AEMET y carburantes. */
  municipioIne: '23050',
  /** Municipios del entorno que entran solo si afectan a la capital. */
  nearby: ['La Guardia de Jaén', 'Los Villares', 'Mancha Real', 'Torredelcampo', 'Torredonjimeno'],
} as const;

export type SectionId =
  | 'tiempo'
  | 'agenda'
  | 'finde'
  | 'movilidad'
  | 'te_afecta'
  | 'farmacias'
  | 'carburantes'
  | 'aceite';

export interface SectionConfig {
  id: SectionId;
  /** Título tal y como aparece en la edición, con su emoji. */
  title: string;
  /** Orden dentro de la edición. */
  order: number;
  /** Quién la escribe: el código (plantilla determinista) o Claude. */
  writtenBy: 'code' | 'ai';
  /** Solo en la edición del viernes. */
  weekendOnly?: boolean;
  /** Máximo de entradas que se publican. */
  maxItems?: number;
}

export const sections: readonly SectionConfig[] = [
  { id: 'tiempo', title: '☀️ El tiempo', order: 1, writtenBy: 'code' },
  { id: 'agenda', title: '📅 Hoy en Jaén', order: 2, writtenBy: 'ai', maxItems: 5 },
  {
    id: 'finde',
    title: '🎉 Este finde',
    order: 3,
    writtenBy: 'ai',
    weekendOnly: true,
    maxItems: 6,
  },
  { id: 'movilidad', title: '🚧 Movilidad', order: 4, writtenBy: 'ai', maxItems: 3 },
  { id: 'te_afecta', title: '📰 Te afecta', order: 5, writtenBy: 'ai', maxItems: 5 },
  { id: 'farmacias', title: '💊 Farmacias de guardia', order: 6, writtenBy: 'code' },
  { id: 'carburantes', title: '⛽ Gasolina más barata', order: 7, writtenBy: 'code' },
  { id: 'aceite', title: '🫒 El aceite', order: 8, writtenBy: 'code' },
] as const;

/** Límites que comprueba el validador. */
export const limits = {
  /** Caracteres del mensaje de WhatsApp: menos de tres minutos de lectura. */
  maxEditionChars: 3000,
  maxTitleChars: 60,
  maxSentencesPerItem: 2,
  /** Días hacia atrás que mira `select` para no repetir. */
  dedupeWindowDays: 14,
} as const;

/** Redacción con Claude. */
export const ai = {
  model: process.env.CLAUDE_MODEL ?? 'claude-sonnet-5',
  maxOutputTokens: 4000,
} as const;

/** Scraping educado: una petición por página y ejecución, con contacto visible. */
export const http = {
  userAgent: `${brand.name} (+${brand.site}${brand.contactEmail ? `; ${brand.contactEmail}` : ''})`,
  timeoutMs: 10_000,
  retries: 1,
  cacheDir: '.cache',
} as const;

/**
 * Días sin edición, en AAAA-MM-DD. Festivos nacionales, de Andalucía y locales
 * de Jaén capital (San Antón, el 25 de noviembre y la Feria de San Lucas).
 * Hay que revisarlos cada año.
 */
export const holidays: readonly string[] = [] as const;

/** Interruptores para ir activando cosas sin tocar código. */
export const flags = {
  /** Fase 1b: publicar en el Canal con WAHA. */
  wahaPublish: false,
  /** Fase 1.5: bloques de patrocinio. */
  sponsorships: false,
  /** Fase 2: suscriptores por la API oficial. */
  cloudApi: false,
  /** Modo «víspera»: genera la edición del día siguiente. */
  eveMode: false,
} as const;

export const paths = {
  editions: 'content/ediciones',
  prompts: 'prompts',
} as const;
