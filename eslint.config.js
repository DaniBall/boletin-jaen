import js from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import eslintPluginAstro from 'eslint-plugin-astro';
import prettier from 'eslint-config-prettier';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig(
  globalIgnores(['dist/', '.astro/', 'node_modules/', '.cache/']),
  js.configs.recommended,

  // Las reglas que necesitan tipos solo en los .ts: `astro-eslint-parser` no
  // resuelve los módulos virtuales de Astro («astro:content») y todo lo que
  // sale de ellos llegaría como `any`. De los .astro se encarga `astro check`.
  {
    files: ['**/*.ts'],
    extends: [tseslint.configs.recommendedTypeChecked],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    files: ['pipeline/**/*.ts', 'tests/**/*.ts'],
    languageOptions: {
      globals: globals.node,
    },
  },

  eslintPluginAstro.configs.recommended,
  prettier,
);
