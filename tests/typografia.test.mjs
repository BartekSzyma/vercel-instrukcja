import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
import { wczytajHtml, blok } from './zaladuj.mjs';

const KORZEN = fileURLToPath(new URL('..', import.meta.url));
const ROZSZERZENIA = new Set(['.html', '.mjs', '.js', '.md', '.json']);
const POMIJANE = new Set(['.git', 'node_modules', 'zrzuty', '.vercel']);

function plikiTekstowe(katalog) {
  const wynik = [];
  for (const wpis of readdirSync(katalog, { withFileTypes: true })) {
    if (POMIJANE.has(wpis.name)) continue;
    const sciezka = join(katalog, wpis.name);
    if (wpis.isDirectory()) wynik.push(...plikiTekstowe(sciezka));
    else if (ROZSZERZENIA.has(extname(wpis.name))) wynik.push(sciezka);
  }
  return wynik;
}

// Wzorce sklejane z części, żeby ten plik sam nie zawierał zakazanych encji.
const ZAKAZANE = [
  ['U+2014', new RegExp('\\u2014')],
  ['U+2013', new RegExp('\\u2013')],
  ['encja mdash', new RegExp('&' + 'mdash;')],
  ['encja ndash', new RegExp('&' + 'ndash;')],
];

test('żaden plik tekstowy nie zawiera długich myślników', () => {
  const pliki = plikiTekstowe(KORZEN);
  assert.ok(pliki.length > 0);
  for (const p of pliki) {
    const tresc = readFileSync(p, 'utf8');
    for (const [nazwa, wzor] of ZAKAZANE) assert.ok(!wzor.test(tresc), `${p}: znaleziono ${nazwa}`);
  }
});

test('HTML ma utf-8, lang="pl" i kompilujące się bloki skryptu', () => {
  const html = wczytajHtml();
  assert.match(html, /<meta charset="utf-8">/i);
  assert.match(html, /<html lang="pl">/);
  for (const id of ['dane', 'widok', 'zrzuty']) assert.doesNotThrow(() => new vm.Script(blok(html, id)), id);
});
