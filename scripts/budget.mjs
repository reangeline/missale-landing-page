import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const LIMIT = 150 * 1024;
const DIST = 'dist';
const refRe = /<(?:link|script)\b[^>]*>/gi;
let failed = false;

function localAssets(html) {
  const out = new Set();
  for (const tag of html.match(refRe) ?? []) {
    const isScript = /^<script/i.test(tag);
    const rel = /\brel=["']?([^"'\s>]+)/i.exec(tag)?.[1]?.toLowerCase();
    if (!isScript && rel !== 'stylesheet' && rel !== 'modulepreload') continue;
    const url = (isScript ? /\bsrc=["']([^"']+)["']/i : /\bhref=["']([^"']+)["']/i).exec(tag)?.[1];
    if (!url || /^(?:[a-z][a-z0-9+.-]*:)?\/\//i.test(url) || url.startsWith('/_vercel/')) continue;
    const path = url.split(/[?#]/)[0];
    if (/\.(?:css|js|mjs)$/i.test(path)) out.add(path);
  }
  return out;
}

for (const lang of ['pt', 'en', 'es']) {
  const page = join(DIST, lang, 'index.html');
  if (!existsSync(page)) {
    console.error(`${page} não existe: rode \`npm run build\` antes`);
    process.exit(1);
  }
  const html = readFileSync(page);
  let total = html.length;
  for (const url of localAssets(html.toString('utf8'))) {
    const file = join(DIST, url);
    if (!existsSync(file)) {
      console.error(`${page}: asset referenciado não encontrado: ${url}`);
      process.exit(1);
    }
    total += readFileSync(file).length;
  }
  const over = total >= LIMIT;
  if (over) failed = true;
  console.log(`${page}: ${(total / 1024).toFixed(2)} KB${over ? ' (ACIMA DO LIMITE 150 KB)' : ''}`);
}
process.exit(failed ? 1 : 0);
