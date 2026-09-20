import { defineConfig } from 'astro/config';
import { brand } from './pipeline/config.ts';

export default defineConfig({
  site: brand.site,
  base: brand.base,
  trailingSlash: 'always',
  build: { format: 'directory' },
});
