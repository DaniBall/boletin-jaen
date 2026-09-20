import { defineConfig } from 'astro/config';
import { ciudadActual } from './ciudades/index.ts';

// Una web por ciudad: `CIUDAD=jaen npm run build`. Cada build se despliega en
// su propio proyecto de Cloudflare, con su dominio.
const ciudad = ciudadActual();

export default defineConfig({
  site: ciudad.brand.domain,
  trailingSlash: 'always',
  build: { format: 'directory' },
});
