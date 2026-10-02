import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const DIST = process.env.DIST ?? 'dist';
const SLUGS = {
  privacy: { pt: 'privacidade', en: 'privacy', es: 'privacidad' },
  terms: { pt: 'termos', en: 'terms', es: 'terminos' },
  support: { pt: 'suporte', en: 'support', es: 'soporte' },
};
const FILES = { privacy: 'privacy', terms: 'terms' };
const crisis = JSON.parse(readFileSync('src/content/legal/crisis.json', 'utf8'));

const pages = [];
for (const [page, byLang] of Object.entries(SLUGS)) {
  for (const [lang, slug] of Object.entries(byLang)) {
    pages.push({ page, lang, slug, file: `${DIST}/${lang}/${slug}/index.html` });
  }
}
const read = (p) => readFileSync(p.file, 'utf8');
const NEW = 'hi@missaleapp.com';

for (const p of pages) {
  test(`${p.lang}/${p.slug}: existe, sem e-mail antigo (ola, erros, acesso) nem rascunho, com crise`, () => {
    const html = read(p);
    assert.ok(!/(ola|erros|acesso)@missale\.app/.test(html));
    assert.ok(!/Rascunho|Borrador|Draft/.test(html));
    assert.ok(html.includes('id="help"'));
    assert.ok(html.includes(crisis[p.lang].title));
    assert.ok(html.includes(p.page === 'support' ? `mailto:${NEW}` : NEW));
  });
}

const entities = { '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#39;': "'", '&nbsp;': ' ' };
const decode = (s) =>
  s
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(+d))
    .replace(/&(amp|lt|gt|quot|nbsp);|&#39;/g, (m) => entities[m]);
const norm = (s) => s.replace(/\s+/g, ' ').trim();

for (const p of pages.filter((x) => x.page !== 'support')) {
  test(`${p.lang}/${p.slug}: fiel ao .md`, () => {
    const md = readFileSync(`src/content/legal/${p.lang}/${FILES[p.page]}.md`, 'utf8');
    const html = read(p);

    const open = html.indexOf('data-legal-body');
    assert.ok(open > -1);
    const start = html.indexOf('>', open) + 1;
    const body = html.slice(start, html.indexOf('</div>', start));

    for (const [, title] of md.matchAll(/^#{1,3} (.+)$/gm)) {
      const plain = title.replace(/[*_`]/g, '');
      assert.ok(decode(body).includes(plain), `título ausente: ${plain}`);
    }

    const mdText = norm(
      md
        .replaceAll('ola@missale.app', NEW)
        .replace(/^#{1,6} /gm, '')
        .replace(/^\s*- /gm, '')
        .replace(/\*\*|[*_`]/g, ''),
    );
    const htmlText = norm(
      decode(
        body
          .replace(/<\/?(p|h[1-6]|ul|ol|li|blockquote|hr|br)\b[^>]*>/g, ' ')
          .replace(/<[^>]+>/g, ''),
      ),
    );
    assert.equal(htmlText, mdText);
  });
}
