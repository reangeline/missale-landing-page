import { marked } from 'marked';
import { SITE } from '../config/site';
import type { Lang } from '../i18n/routes';

export type LegalDoc = 'privacy' | 'terms';

const FILES = import.meta.glob('../content/legal/*/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

// Sem conversão tipográfica: o texto renderizado tem de bater com o original.
const options = { gfm: true, breaks: false } as const;

/** HTML do texto legal vigente do app; a única alteração é o e-mail de contato. */
export function getLegalHtml(lang: Lang, doc: LegalDoc): string {
  const raw = FILES[`../content/legal/${lang}/${doc}.md`];
  if (raw === undefined) throw new Error(`Texto legal ausente: ${lang}/${doc}`);
  return marked.parse(raw.replaceAll(SITE.appLegalEmail, SITE.email), options) as string;
}
