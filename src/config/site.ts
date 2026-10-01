import type { Lang } from '../i18n/routes';

export const SITE = {
  name: 'Missale',
  url: 'https://missaleapp.com',
  email: 'hi@missaleapp.com',
  /** E-mail que aparece nos textos legais copiados do app; o site o troca por `email`. */
  appLegalEmail: 'ola@missale.app',
  eulaUrl: 'https://www.apple.com/legal/internet-services/itunes/dev/stdeula/',
  /** Perfis nas redes; vazio até o Renato informar. */
  social: [] as { label: string; href: string }[],
} as const;

const APP_STORE_ID = (import.meta.env.PUBLIC_APP_STORE_ID ?? '').trim();
const APP_STORE_PT = (import.meta.env.PUBLIC_APP_STORE_PT ?? '').trim();

/** ID do app na App Store, ou `null` enquanto ele não estiver publicado (modo "Em breve"). */
export const appStoreId: string | null = APP_STORE_ID || null;

/** Seções da página de onde sai um botão da App Store (vira o parâmetro `ct`). */
export type StoreSection = 'header' | 'hero' | 'pricing';

/** Link de campanha da App Store, ou `null` no modo "Em breve". */
export function storeUrl(lang: Lang, section: StoreSection): string | null {
  if (!appStoreId) return null;
  const params = new URLSearchParams();
  if (APP_STORE_PT) params.set('pt', APP_STORE_PT);
  params.set('ct', `site-${lang}-${section}`);
  return `https://apps.apple.com/app/id${appStoreId}?${params}`;
}

/** `true` só quando o build roda na Vercel (liga o Web Analytics). Lido em tempo de build. */
export const ON_VERCEL =
  (globalThis as { process?: { env: Record<string, string | undefined> } }).process?.env.VERCEL === '1';
