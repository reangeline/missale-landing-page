import type { Content } from '../content/schema';
import pt from '../content/pt.json';
import en from '../content/en.json';
import es from '../content/es.json';
import crisisJson from '../content/legal/crisis.json';
import type { Lang } from './routes';

// A anotação de tipo faz o `astro check` falhar se algum JSON sair do contrato.
const CONTENT: Record<Lang, Content> = { pt, en, es };

export function getContent(lang: Lang): Content {
  return CONTENT[lang];
}

/** Texto de crise do app (genérico, sem números de telefone, por decisão do app). */
export const CRISIS: Record<Lang, { title: string; message: string }> = crisisJson;
