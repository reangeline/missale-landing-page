import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { readFileSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const DIST = process.env.DIST ?? 'dist';
const BASE = 'https://missaleapp.com';
const LANGS = ['pt', 'en', 'es'];
const LEGAL = {
  pt: ['privacidade', 'termos', 'suporte'],
  en: ['privacy', 'terms', 'support'],
  es: ['privacidad', 'terminos', 'soporte'],
};
const read = (dir, p) => readFileSync(join(dir, p), 'utf8');
const content = (lang) => JSON.parse(readFileSync(`src/content/${lang}.json`, 'utf8'));

const pages = LANGS.flatMap((l) => [
  { lang: l, home: true, file: `${l}/index.html`, url: `${BASE}/${l}` },
  ...LEGAL[l].map((s) => ({ lang: l, home: false, file: `${l}/${s}/index.html`, url: `${BASE}/${l}/${s}` })),
]);

test('check-dist passa', () => {
  const r = spawnSync('node', ['scripts/check-dist.mjs', DIST], { encoding: 'utf8' });
  assert.equal(r.status, 0, r.stderr + r.stdout);
});

test('build padrão: modo "Em breve", sem links da App Store', () => {
  for (const p of pages) {
    const html = read(DIST, p.file);
    assert.ok(!html.includes('apps.apple.com'), `${p.file} tem apps.apple.com`);
    assert.ok(!html.includes('apple-itunes-app'), `${p.file} tem apple-itunes-app`);
  }
  for (const l of LANGS) {
    assert.ok(read(DIST, `${l}/index.html`).includes(content(l).cta.soon), `${l}: sem cta.soon`);
  }
});

test('SEO: canonical, hreflang, og:image e JSON-LD', () => {
  assert.equal(pages.length, 12);
  for (const p of pages) {
    const html = read(DIST, p.file);
    assert.ok(html.includes(`<link rel="canonical" href="${p.url}"`), `${p.file}: canonical`);
    for (const h of [...LANGS, 'x-default']) {
      assert.ok(html.includes(`hreflang="${h}"`), `${p.file}: hreflang ${h}`);
    }
    assert.ok(html.includes('og:image"'), `${p.file}: og:image`);
    assert.equal(html.includes('"@type":"MobileApplication"'), p.home, `${p.file}: JSON-LD`);
  }
});

test('sitemap.xml e robots.txt', () => {
  const sitemap = read(DIST, 'sitemap.xml');
  assert.equal((sitemap.match(/<loc>/g) ?? []).length, 13);
  assert.ok(read(DIST, 'robots.txt').includes(`Sitemap: ${BASE}/sitemap.xml`));
});

test('modo publicado: links da App Store com ct e pt', { timeout: 150_000 }, () => {
  const out = mkdtempSync(join(tmpdir(), 'missale-dist-'));
  try {
    const r = spawnSync('npx', ['astro', 'build', '--outDir', out], {
      encoding: 'utf8',
      timeout: 120_000,
      env: { ...process.env, PUBLIC_APP_STORE_ID: '123456789', PUBLIC_APP_STORE_PT: '987654' },
    });
    assert.equal(r.status, 0, r.stderr + r.stdout);
    const pt = read(out, 'pt/index.html');
    const base = 'https://apps.apple.com/app/id123456789?pt=987654&amp;ct=site-pt-';
    for (const s of ['header', 'hero', 'pricing']) assert.ok(pt.includes(`${base}${s}`), `pt: ct=site-pt-${s}`);
    const cls = (s) => pt.match(new RegExp(`<a[^>]*class="([^"]*)"[^>]*ct=site-pt-${s}`))?.[1] ?? pt.match(new RegExp(`<a[^>]*ct=site-pt-${s}[^>]*class="([^"]*)"`))?.[1];
    assert.ok(!cls('header').includes('btn--primary'), 'header sem btn--primary');
    for (const s of ['hero', 'pricing']) assert.ok(cls(s).includes('btn--primary'), `${s} com btn--primary`);
    assert.ok(pt.includes('<meta name="apple-itunes-app" content="app-id=123456789">'));
    assert.ok(pt.includes(content('pt').cta.download));
    assert.ok(!pt.includes(content('pt').cta.soon));
    assert.ok(read(out, 'en/index.html').includes('ct=site-en-hero'));
  } finally {
    rmSync(out, { recursive: true, force: true });
  }
});
