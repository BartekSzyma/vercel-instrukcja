import { test } from 'node:test';
import assert from 'node:assert/strict';
import { zaladuj, j } from './zaladuj.mjs';

const A = zaladuj();
const elementy = () => A.INSTRUKCJA.flatMap((s) => s.elementy);
const TYPY = new Set(['tekst', 'komenda', 'sprawdz', 'uwaga', 'wazne', 'mac', 'zrzut', 'prompt', 'plik']);

test('sekcje mają unikalne ASCII id i tytuły numerowane od 0 po kolei', () => {
  assert.ok(A.INSTRUKCJA.length > 0);
  A.INSTRUKCJA.forEach((s, i) => {
    assert.match(s.id, /^[a-z0-9-]+$/, s.id);
    assert.ok(s.tytul.startsWith(`${i}. `), s.tytul);
  });
  assert.equal(new Set(A.INSTRUKCJA.map((s) => s.id)).size, A.INSTRUKCJA.length);
});

test('każdy element ma znany typ i niepustą treść; html bez <script', () => {
  for (const e of elementy()) {
    assert.ok(TYPY.has(e.typ), e.typ);
    if (['tekst', 'sprawdz', 'uwaga', 'wazne', 'mac'].includes(e.typ)) assert.ok(e.html.length > 0);
    if (e.typ === 'komenda') assert.ok(e.tekst.length > 0);
    if (e.typ === 'prompt') assert.ok(e.tytul.length > 0 && e.tekst.length > 0, e.id);
    if ('html' in e) assert.doesNotMatch(e.html, /<script/i);
  }
});

test('prompty P1..Pn występują dokładnie raz i po kolei', () => {
  const ids = elementy().filter((e) => e.typ === 'prompt').map((e) => e.id);
  assert.ok(ids.length >= 2, `za mało promptów: ${ids.length}`);
  assert.deepEqual(j(ids), Array.from({ length: ids.length }, (_, i) => `P${i + 1}`));
});

test('prompty nie zawierają ścieżek ani nazw autora i nie każą uruchamiać vercel', () => {
  for (const e of elementy().filter((x) => x.typ === 'prompt')) {
    assert.doesNotMatch(e.tekst, /C:\\Programowanie|Bartek|CLAUDE_CONFIG_DIR/i, e.id);
    assert.match(e.tekst, /Nie uruchamiaj/, `${e.id}: prompt powinien zabraniać uruchamiania vercel`);
  }
});

test('każdy zrzut z LISTA_ZRZUTOW użyty dokładnie raz', () => {
  const uzyte = elementy().filter((e) => e.typ === 'zrzut').map((e) => e.klucz).sort();
  assert.deepEqual(j(uzyte), j(A.LISTA_ZRZUTOW.map((z) => z.klucz).sort()));
  for (const z of A.LISTA_ZRZUTOW) {
    assert.match(z.klucz, /^[0-9]{2}-[a-z0-9-]+$/);
    assert.ok(z.podpis.length > 0, z.klucz);
  }
});

test('kluczowe ostrzeżenia są w instrukcji', () => {
  const tekst = [...A.INSTRUKCJA.map((s) => s.tytul), ...elementy().map((e) => e.html || e.tekst || ''),
    ...A.RAMKA_POMOCY.sytuacje.map((s) => s.tytul + s.html)].join('\n');
  for (const fraza of ['vercel login', 'vercel --prod', '.vercelignore', '.env', 'Hobby', 'Preview', 'Production', 'LTS',
    'vercel logout', 'Delete Project', 'Ctrl+F5', 'vercel whoami']) {
    assert.ok(tekst.includes(fraza), fraza);
  }
});

test('wstawki „Na Macu” są przy krokach zależnych od systemu', () => {
  assert.ok(elementy().filter((e) => e.typ === 'mac').length >= 2);
});

test('każdy prompt ma po sobie punkt „Sprawdź”', () => {
  for (const s of A.INSTRUKCJA) {
    const typy = s.elementy.map((e) => e.typ);
    typy.forEach((t, i) => { if (t === 'prompt') assert.ok(typy.slice(i + 1).includes('sprawdz'), `${s.id}: brak Sprawdź po prompcie`); });
  }
});

test('ramka pomocy: szablon i co najmniej 5 sytuacji', () => {
  assert.match(A.RAMKA_POMOCY.szablon, /\[numer kroku\]/);
  assert.ok(A.RAMKA_POMOCY.sytuacje.length >= 5);
});
