import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const LANGS = ['pt', 'en', 'es'];
const load = (lang) => JSON.parse(readFileSync(`src/content/${lang}.json`, 'utf8'));

/** Caminhos de todas as folhas; arrays de objetos entram com índice, então o tamanho também é comparado. */
function shape(value, path = '') {
  if (Array.isArray(value)) {
    // Listas de texto podem ter tamanhos diferentes por idioma; listas de objetos, não.
    if (value.every((item) => typeof item === 'string')) return [`${path}[]`];
    return value.flatMap((item, i) => shape(item, `${path}[${i}]`));
  }
  if (value && typeof value === 'object') {
    return Object.keys(value)
      .sort()
      .flatMap((key) => shape(value[key], path ? `${path}.${key}` : key));
  }
  return [path];
}

function leaves(value, path = '') {
  if (Array.isArray(value)) return value.flatMap((item, i) => leaves(item, `${path}[${i}]`));
  if (value && typeof value === 'object') {
    return Object.entries(value).flatMap(([key, v]) => leaves(v, path ? `${path}.${key}` : key));
  }
  return [[path, value]];
}

test('pt, en e es têm as mesmas chaves', () => {
  const base = shape(load('pt'));
  for (const lang of ['en', 'es']) {
    assert.deepEqual(shape(load(lang)), base, `src/content/${lang}.json diverge de pt.json`);
  }
});

test('a seção de privacidade cita exatamente duas exceções', () => {
  for (const lang of LANGS) {
    assert.equal(load(lang).privacy.exceptions.length, 2, `${lang}: privacy.exceptions`);
  }
});

test('nenhum texto ficou por preencher', { skip: process.env.ALLOW_TODO === '1' }, () => {
  // Só `alt` pode ser vazio (cartão sem imagem).
  for (const lang of LANGS) {
    for (const [path, value] of leaves(load(lang))) {
      assert.equal(typeof value, 'string', `${lang}: ${path} não é texto`);
      assert.ok(!/\bTODO\b/.test(value), `${lang}: ${path} ainda é TODO`);
      if (!path.endsWith('.alt')) assert.ok(value.trim() !== '', `${lang}: ${path} está vazio`);
    }
  }
});
