export const LANGS = ['pt', 'en', 'es'] as const;
export type Lang = (typeof LANGS)[number];

export const LANG_LABELS: Record<Lang, { short: string; name: string }> = {
  pt: { short: 'PT', name: 'Português' },
  en: { short: 'EN', name: 'English' },
  es: { short: 'ES', name: 'Español' },
};

export const LEGAL_PAGES = ['privacy', 'terms', 'support'] as const;
export type LegalPage = (typeof LEGAL_PAGES)[number];
export type Page = 'home' | LegalPage;

// As URLs de suporte e privacidade já estão cadastradas na App Store: não renomear.
export const LEGAL_SLUGS: Record<LegalPage, Record<Lang, string>> = {
  privacy: { pt: 'privacidade', en: 'privacy', es: 'privacidad' },
  terms: { pt: 'termos', en: 'terms', es: 'terminos' },
  support: { pt: 'suporte', en: 'support', es: 'soporte' },
};

/** Âncoras das seções da home (iguais nos 3 idiomas). */
export const ANCHORS = {
  day: 'day',
  gratitude: 'gratitude',
  features: 'features',
  guidance: 'guidance',
  privacy: 'privacy',
  pricing: 'pricing',
  faq: 'faq',
  /** Bloco "Precisa de ajuda agora?" na página de suporte. */
  help: 'help',
} as const;

export function pathFor(lang: Lang, page: Page = 'home'): string {
  return page === 'home' ? `/${lang}` : `/${lang}/${LEGAL_SLUGS[page][lang]}`;
}
