#!/usr/bin/env node
/**
 * CLI del pipeline. En la fase 0 solo está `whatsapp`; `edicion` y `fuentes`
 * llegan en la fase 1.
 */
import { renderWhatsapp } from './render/whatsapp.ts';
import { editionUrl, readEdition } from './lib/edicion.ts';
import { today } from './lib/fechas.ts';

function parseArgs(argv: string[]): { command: string; flags: Map<string, string> } {
  const [command = 'ayuda', ...rest] = argv;
  const flags = new Map<string, string>();
  for (let i = 0; i < rest.length; i += 1) {
    const arg = rest[i];
    if (!arg?.startsWith('--')) continue;
    const key = arg.slice(2);
    const next = rest[i + 1];
    if (next && !next.startsWith('--')) {
      flags.set(key, next);
      i += 1;
    } else {
      flags.set(key, 'true');
    }
  }
  return { command, flags };
}

const AYUDA = `Uso: npm run <comando> -- [opciones]

  whatsapp --fecha AAAA-MM-DD   Imprime el texto listo para pegar en el Canal.
  edicion  --fecha AAAA-MM-DD   Genera la edición (fase 1).
  fuentes  --fecha AAAA-MM-DD   Tabla de salud de las fuentes (fase 1).
`;

async function main(): Promise<number> {
  const { command, flags } = parseArgs(process.argv.slice(2));
  const fecha = flags.get('fecha') ?? today();

  switch (command) {
    case 'whatsapp': {
      const edition = await readEdition(fecha);
      process.stdout.write(`${renderWhatsapp(edition.body, { editionUrl: editionUrl(fecha) })}\n`);
      return 0;
    }

    case 'edicion':
    case 'fuentes':
      process.stderr.write(`El comando «${command}» llega en la fase 1.\n`);
      return 1;

    default:
      process.stdout.write(AYUDA);
      return command === 'ayuda' ? 0 : 1;
  }
}

main().then(
  (code) => {
    process.exitCode = code;
  },
  (error: unknown) => {
    process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
    process.exitCode = 1;
  },
);
