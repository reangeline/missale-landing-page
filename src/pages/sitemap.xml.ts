import { LANGS, LEGAL_PAGES, pathFor, type Page } from '../i18n/routes';
import { SITE } from '../config/site';

const PAGES: Page[] = ['home', ...LEGAL_PAGES];

function entry(loc: string, alts: { hreflang: string; href: string }[]): string {
  const links = alts
    .map((a) => `    <xhtml:link rel="alternate" hreflang="${a.hreflang}" href="${a.href}" />`)
    .join('\n');
  return `  <url>\n    <loc>${loc}</loc>\n${links}\n  </url>`;
}

export const GET = () => {
  const urls = [
    entry(`${SITE.url}/`, [
      ...LANGS.map((l) => ({ hreflang: l, href: SITE.url + pathFor(l) })),
      { hreflang: 'x-default', href: `${SITE.url}/` },
    ]),
  ];
  for (const page of PAGES) {
    const alts = LANGS.map((l) => ({ hreflang: l as string, href: SITE.url + pathFor(l, page) }));
    alts.push({ hreflang: 'x-default', href: page === 'home' ? `${SITE.url}/` : SITE.url + pathFor('en', page) });
    for (const l of LANGS) urls.push(entry(SITE.url + pathFor(l, page), alts));
  }
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join('\n')}\n</urlset>\n`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml' } });
};
