// Verificações automáticas de conteúdo no build. Uso: node scripts/check-dist.mjs [dir]
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';

const dist = process.argv[2] ?? process.env.DIST ?? 'dist';

const GLOBAL_BANNED = [
  'aggregateRating', 'googletagmanager', 'google-analytics', 'gtag(', 'fbq(',
  'connect.facebook.net', 'hotjar', 'clarity.ms',
];
const NEVER_SAY = {
  pt: ['sem cadastro', 'sem conta', 'funciona offline', 'sem rastreamento', 'nada sai do celular', 'ia que conversa', 'ia que aconselha'],
  en: ['no sign-up', 'no signup', 'no account', 'without an account', 'works offline', 'no tracking', 'nothing leaves your phone', 'ai that talks', 'ai that chats', 'ai that advises'],
  es: ['sin registro', 'sin cuenta', 'funciona offline', 'funciona sin conexión', 'sin rastreo', 'sin seguimiento', 'nada sale de tu celular', 'ia que conversa', 'ia que aconseja'],
};
const SUPPORT = { pt: 'suporte', en: 'support', es: 'soporte' };
const PRICE = ['R$', 'US$', '€'];

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)],
  );
}

function visibleText(html) {
  return html
    .replace(/<(script|style)\b[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/\s+/g, ' ')
    .toLowerCase();
}

if (!existsSync(dist)) {
  console.error(`check-dist: diretório não existe: ${dist}`);
  process.exit(1);
}

const found = [];
for (const file of walk(dist).filter((f) => f.endsWith('.html'))) {
  const rel = relative(dist, file).split('\\').join('/');
  const html = readFileSync(file, 'utf8');
  for (const w of GLOBAL_BANNED) if (html.includes(w)) found.push(`${rel}: ${w}`);

  for (const lang of Object.keys(NEVER_SAY)) {
    const isHome = rel === `${lang}/index.html`;
    const isSupport = rel === `${lang}/${SUPPORT[lang]}/index.html`;
    if (!isHome && !isSupport) continue;
    const text = visibleText(html);
    for (const w of NEVER_SAY[lang]) if (text.includes(w)) found.push(`${rel}: ${w}`);
    if (isHome) {
      const raw = html.replace(/<(script|style)\b[\s\S]*?<\/\1>/gi, ' ').replace(/<[^>]+>/g, ' ');
      for (const p of PRICE) if (raw.includes(p)) found.push(`${rel}: ${p}`);
    }
  }
}

if (found.length) {
  console.error('check-dist: expressões proibidas encontradas:');
  for (const f of found) console.error(`  ${f}`);
  process.exit(1);
}
console.log('check-dist: ok');
