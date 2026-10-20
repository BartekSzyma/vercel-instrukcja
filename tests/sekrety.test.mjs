import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const KORZEN = fileURLToPath(new URL('..', import.meta.url));
const ROZSZERZENIA = new Set(['.html', '.mjs', '.js', '.md', '.json', '.py', '.txt']);
const POMIJANE = new Set(['.git', 'node_modules', '.vercel']);

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

// Wzorce sklejane z części, żeby ten plik sam do nich nie pasował.
const WZORCE = [
  ['token Vercel', new RegExp('vc' + '[a-z]_[A-Za-z0-9]{20,}')],
  ['klucz prywatny', new RegExp('-----BEGIN ' + '[A-Z ]*PRIVATE KEY')],
  ['zmienna VERCEL_TOKEN z wartością', new RegExp('VERCEL_' + 'TOKEN\\s*=\\s*\\S+')],
];

test('żaden plik tekstowy w repo nie zawiera tokenu ani klucza', () => {
  const pliki = plikiTekstowe(KORZEN);
  assert.ok(pliki.length > 0);
  for (const p of pliki) {
    // Blok zrzutów to obrazy w base64 - przypadkowe ciągi mogłyby pasować do wzorca.
    const tresc = readFileSync(p, 'utf8').replace(/<script id="zrzuty">[\s\S]*?<\/script>/, '');
    for (const [nazwa, wzor] of WZORCE) assert.ok(!wzor.test(tresc), `${p}: wygląda jak ${nazwa}`);
  }
});

test('.gitignore wyklucza oryginalne zrzuty, .vercel i .env', () => {
  const gitignore = readFileSync(join(KORZEN, '.gitignore'), 'utf8').split(/\r?\n/);
  for (const w of ['.env', '.vercel/', 'zrzuty/oryginaly/', 'node_modules/']) {
    assert.ok(gitignore.includes(w), `brak wpisu ${w}`);
  }
});
