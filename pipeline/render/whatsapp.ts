/**
 * Markdown → texto de WhatsApp.
 *
 * Se recorre el AST de remark, nunca se transforma con expresiones regulares:
 * así los `*` y los `_` que aparecen dentro de URLs o de nombres propios no se
 * confunden con el formato de WhatsApp.
 */
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import { unified } from 'unified';
import type { Nodes, Parents, PhrasingContent, RootContent } from 'mdast';

export interface WhatsappOptions {
  /** Enlace a la edición en la web. Se añade como última línea. */
  editionUrl?: string;
  /** Emoji que precede a cada URL. */
  linkPrefix?: string;
}

const DEFAULT_LINK_PREFIX = '👉';

/** Las URLs recogidas en un bloque, para escribirlas debajo en su propia línea. */
interface InlineResult {
  text: string;
  urls: string[];
}

const processor = unified().use(remarkParse).use(remarkGfm);

export function renderWhatsapp(markdown: string, options: WhatsappOptions = {}): string {
  const linkPrefix = options.linkPrefix ?? DEFAULT_LINK_PREFIX;
  const tree = processor.parse(markdown) as Parents;

  const blocks = renderBlocks(tree.children as RootContent[], linkPrefix, 0);

  if (options.editionUrl) {
    blocks.push(`${linkPrefix} ${cleanUrl(options.editionUrl)}`);
  }

  return blocks
    .join('\n\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function renderBlocks(nodes: RootContent[], linkPrefix: string, depth: number): string[] {
  const blocks: string[] = [];
  for (const node of nodes) {
    const block = renderBlock(node, linkPrefix, depth);
    if (block.trim() !== '') blocks.push(block);
  }
  return blocks;
}

function renderBlock(node: RootContent, linkPrefix: string, depth: number): string {
  switch (node.type) {
    case 'heading': {
      // Todos los títulos van en negrita y en su propia línea.
      const { text, urls } = renderInline(node.children);
      return withUrls(text.trim() === '' ? '' : `*${text.trim()}*`, urls, linkPrefix);
    }

    case 'paragraph': {
      const { text, urls } = renderInline(node.children);
      return withUrls(text, urls, linkPrefix);
    }

    case 'list': {
      const indent = '  '.repeat(depth);
      const items: string[] = [];
      node.children.forEach((item, index) => {
        const marker = node.ordered ? `${(node.start ?? 1) + index}.` : '•';
        const rendered = renderListItem(item, linkPrefix, depth);
        if (rendered.trim() === '') return;
        const [first, ...rest] = rendered.split('\n');
        items.push([`${indent}${marker} ${first}`, ...rest].join('\n'));
      });
      return items.join('\n');
    }

    case 'blockquote': {
      const inner = renderBlocks(node.children, linkPrefix, depth).join('\n');
      return inner
        .split('\n')
        .map((line) => `> ${line}`)
        .join('\n');
    }

    case 'code':
      // WhatsApp entiende los bloques con tres comillas invertidas.
      return `\`\`\`\n${node.value}\n\`\`\``;

    case 'html':
      // No se publica HTML crudo.
      return '';

    case 'thematicBreak':
      // El separador del Markdown no aporta nada en WhatsApp.
      return '';

    case 'table': {
      // Una fila por línea, con los valores separados por « · ».
      return node.children
        .map((row) =>
          row.children
            .map((cell) => renderInline(cell.children).text.trim())
            .filter((value) => value !== '')
            .join(' · '),
        )
        .filter((line) => line !== '')
        .join('\n');
    }

    default: {
      if ('children' in node && Array.isArray(node.children)) {
        return renderBlocks(node.children, linkPrefix, depth).join('\n\n');
      }
      return '';
    }
  }
}

function renderListItem(item: Nodes, linkPrefix: string, depth: number): string {
  if (!('children' in item) || !Array.isArray(item.children)) return '';

  const parts: string[] = [];
  for (const child of item.children as RootContent[]) {
    // Las listas anidadas bajan un nivel de sangría; el resto va seguido.
    const block = renderBlock(child, linkPrefix, child.type === 'list' ? depth + 1 : depth);
    if (block.trim() !== '') parts.push(block);
  }
  return parts.join('\n');
}

/** Pega debajo del bloque, una por línea, las URLs que llevaba dentro. */
function withUrls(text: string, urls: string[], linkPrefix: string): string {
  const trimmed = text.trim();
  if (urls.length === 0) return trimmed;
  const lines = urls.map((url) => `${linkPrefix} ${url}`);
  return trimmed === '' ? lines.join('\n') : [trimmed, ...lines].join('\n');
}

function renderInline(nodes: PhrasingContent[]): InlineResult {
  let text = '';
  const urls: string[] = [];

  for (const node of nodes) {
    switch (node.type) {
      case 'text':
        text += node.value;
        break;

      case 'strong': {
        const inner = renderInline(node.children);
        urls.push(...inner.urls);
        text += inner.text.trim() === '' ? inner.text : `*${inner.text}*`;
        break;
      }

      case 'emphasis': {
        const inner = renderInline(node.children);
        urls.push(...inner.urls);
        text += inner.text.trim() === '' ? inner.text : `_${inner.text}_`;
        break;
      }

      case 'delete': {
        const inner = renderInline(node.children);
        urls.push(...inner.urls);
        text += inner.text.trim() === '' ? inner.text : `~${inner.text}~`;
        break;
      }

      case 'inlineCode':
        text += `\`${node.value}\``;
        break;

      case 'link': {
        const inner = renderInline(node.children);
        urls.push(...inner.urls);
        const label = inner.text.trim();
        const url = cleanUrl(node.url);
        // Un enlace automático («https://…» suelto) no repite el texto.
        if (label === '' || label === node.url) {
          urls.push(url);
        } else {
          text += label;
          urls.push(url);
        }
        break;
      }

      case 'image':
        // Sin imágenes en el mensaje: se queda el texto alternativo.
        text += node.alt ?? '';
        break;

      case 'break':
        text += '\n';
        break;

      case 'footnoteReference':
        break;

      default: {
        if ('children' in node && Array.isArray(node.children)) {
          const inner = renderInline(node.children);
          urls.push(...inner.urls);
          text += inner.text;
        } else if ('value' in node && typeof node.value === 'string') {
          text += node.value;
        }
      }
    }
  }

  return { text, urls };
}

/** Quita los parámetros `utm_` y deja la URL tal cual si no se puede parsear. */
export function cleanUrl(url: string): string {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return url;
  }

  for (const key of [...parsed.searchParams.keys()]) {
    if (key.toLowerCase().startsWith('utm_')) parsed.searchParams.delete(key);
  }

  // `URL.toString()` deja un '?' huérfano cuando se vacía la query.
  return parsed.toString().replace(/\?$/, '');
}
