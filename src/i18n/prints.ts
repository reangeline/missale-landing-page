import type { ImageMetadata } from 'astro';
import type { Lang } from './routes';

/** Prints reais do app, um conjunto por idioma, em `src/assets/prints/<idioma>/`. */
export type PrintName = '01-hoje' | '02-checkin' | '05-terco' | '06-biblia' | '07-santo' | '08-exame';

const files = import.meta.glob<{ default: ImageMetadata }>('../assets/prints/*/*.png', { eager: true });

export function getPrint(lang: Lang, name: PrintName): ImageMetadata {
  const file = files[`../assets/prints/${lang}/${name}.png`];
  if (!file) throw new Error(`Print não encontrado: ${lang}/${name}.png`);
  return file.default;
}
