import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';

test('build gera dist/{pt,en,es}/index.html', () => {
  assert.ok(existsSync('dist'), 'dist/ não existe: rode `npm run build` antes de `npm test`');
  for (const lang of ['pt', 'en', 'es']) {
    assert.ok(existsSync(`dist/${lang}/index.html`), `dist/${lang}/index.html não existe`);
  }
});
