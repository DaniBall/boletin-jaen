import { readFile } from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
import { describe, expect, it } from 'vitest';
import { cleanUrl, renderWhatsapp } from '../pipeline/render/whatsapp.ts';
import { ciudades } from '../ciudades/index.ts';

const root = path.resolve(import.meta.dirname, '..');

describe('renderWhatsapp', () => {
  it('pone los títulos en negrita y en su propia línea', () => {
    const out = renderWhatsapp('Hola.\n\n## ☀️ El tiempo\n\nMáxima de 29°.');
    expect(out).toBe('Hola.\n\n*☀️ El tiempo*\n\nMáxima de 29°.');
  });

  it('traduce el formato de Markdown al de WhatsApp', () => {
    const out = renderWhatsapp('**negrita**, _cursiva_ y ~~tachado~~.');
    expect(out).toBe('*negrita*, _cursiva_ y ~tachado~.');
  });

  it('convierte las viñetas en «• »', () => {
    const out = renderWhatsapp('- Uno\n- Dos\n- Tres');
    expect(out).toBe('• Uno\n• Dos\n• Tres');
  });

  it('numera las listas ordenadas respetando el inicio', () => {
    const out = renderWhatsapp('3. Tres\n4. Cuatro');
    expect(out).toBe('3. Tres\n4. Cuatro');
  });

  it('saca la URL del enlace a la línea siguiente', () => {
    const out = renderWhatsapp('Mira el [programa completo](https://ejemplo.es/feria).');
    expect(out).toBe('Mira el programa completo.\n👉 https://ejemplo.es/feria');
  });

  it('mantiene el orden cuando hay varios enlaces en un párrafo', () => {
    const out = renderWhatsapp('[Uno](https://a.es/1) y [dos](https://b.es/2).');
    expect(out).toBe('Uno y dos.\n👉 https://a.es/1\n👉 https://b.es/2');
  });

  it('cuelga la URL debajo de su viñeta', () => {
    const out = renderWhatsapp('- **Plan**: a las 18:00. [Más info](https://ejemplo.es/a)\n- Otro');
    expect(out).toBe('• *Plan*: a las 18:00. Más info\n👉 https://ejemplo.es/a\n• Otro');
  });

  it('limpia los parámetros utm_ y deja los demás', () => {
    const out = renderWhatsapp('[Ficha](https://ejemplo.es/e?utm_source=wa&utm_medium=x&id=7)');
    expect(out).toBe('Ficha\n👉 https://ejemplo.es/e?id=7');
  });

  it('añade el enlace a la edición como última línea', () => {
    const out = renderWhatsapp('Hola.', { editionUrl: 'https://ejemplo.es/ediciones/2026-09-18/' });
    expect(out).toBe('Hola.\n\n👉 https://ejemplo.es/ediciones/2026-09-18/');
  });

  it('no toca los guiones bajos ni los asteriscos de una URL', () => {
    const out = renderWhatsapp('[Bases](https://ejemplo.es/ayudas_2026/bases*.pdf)');
    expect(out).toBe('Bases\n👉 https://ejemplo.es/ayudas_2026/bases*.pdf');
  });

  it('respeta los guiones bajos de un nombre propio', () => {
    const out = renderWhatsapp('Concierto en el Bar_Manolo con El*Lagarto.');
    expect(out).toBe('Concierto en el Bar_Manolo con El*Lagarto.');
  });

  it('conserva los emojis de los títulos de sección', () => {
    expect(renderWhatsapp('## 🫒 El aceite')).toBe('*🫒 El aceite*');
  });

  it('no deja rastro de una sección vacía', () => {
    const out = renderWhatsapp('## 📅 Hoy en Jaén\n\n## ⛽ Gasolina\n\n- Gasóleo A: 1,389 €');
    expect(out).toBe('*📅 Hoy en Jaén*\n\n*⛽ Gasolina*\n\n• Gasóleo A: 1,389 €');
  });

  it('ignora el separador horizontal', () => {
    expect(renderWhatsapp('Uno\n\n---\n\nDos')).toBe('Uno\n\nDos');
  });

  it('no publica HTML crudo', () => {
    expect(renderWhatsapp('Uno\n\n<script>alert(1)</script>\n\nDos')).toBe('Uno\n\nDos');
  });

  it('sangra las listas anidadas', () => {
    const out = renderWhatsapp('- Padre\n  - Hijo');
    expect(out).toBe('• Padre\n  • Hijo');
  });

  it('no repite el texto de un enlace automático', () => {
    expect(renderWhatsapp('Fuente: <https://ejemplo.es/a>')).toBe(
      'Fuente:\n👉 https://ejemplo.es/a',
    );
  });

  it('colapsa los saltos de línea de más', () => {
    expect(renderWhatsapp('Uno\n\n\n\nDos')).toBe('Uno\n\nDos');
  });

  it('devuelve cadena vacía con un Markdown vacío', () => {
    expect(renderWhatsapp('   \n\n  ')).toBe('');
  });
});

describe('cleanUrl', () => {
  it('deja intacta una URL sin parámetros', () => {
    expect(cleanUrl('https://ejemplo.es/a')).toBe('https://ejemplo.es/a');
  });

  it('quita el «?» que queda al vaciar la query', () => {
    expect(cleanUrl('https://ejemplo.es/a?utm_source=wa')).toBe('https://ejemplo.es/a');
  });

  it('devuelve tal cual lo que no es una URL', () => {
    expect(cleanUrl('no-es-una-url')).toBe('no-es-una-url');
  });
});

describe('las ediciones de ejemplo', () => {
  it.each(ciudades.map((ciudad) => ciudad.id))(
    '%s cabe en un mensaje de WhatsApp y no arrastra Markdown sin traducir',
    async (id) => {
      const file = path.join(root, `content/${id}/ediciones/2026-09-18.md`);
      const raw = await readFile(file, 'utf8');
      const url = `https://ejemplo.es/ediciones/2026-09-18/`;
      const out = renderWhatsapp(matter(raw).content, { editionUrl: url });

      expect(out.length).toBeLessThanOrEqual(3000);
      expect(out).not.toContain('**');
      expect(out).not.toContain('](');
      expect(out).toContain('*☀️ El tiempo*');
      expect(out.trimEnd().endsWith(`👉 ${url}`)).toBe(true);
    },
  );
});
