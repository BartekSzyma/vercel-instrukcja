// Jednorazowe złożenie cwiczenia-vercel.html z szablonu (styl i widok jak w instrukcji Discord) i tools/dane.js.
// Użycie: node tools/zloz-html.js <szablon.html>
// Po złożeniu plik HTML jest źródłem prawdy - dane edytujesz bezpośrednio w nim.
const fs = require('fs');
const path = require('path');

const szablon = fs.readFileSync(process.argv[2], 'utf8').replace(/^﻿/, '');
const dane = fs.readFileSync(path.join(__dirname, 'dane.js'), 'utf8').trim();

const poczatek = szablon.slice(0, szablon.indexOf('<script id="dane">'));
const koniec = szablon.slice(szablon.indexOf('<script id="widok">'));

let html = poczatek + dane + '\n' + koniec;
const zamien = (od, do_) => {
  if (!html.includes(od)) throw new Error('Brak fragmentu szablonu: ' + od);
  html = html.split(od).join(do_);
};
zamien('<title>Bot Discord, czytnik newsów i Claude Code - instrukcja krok po kroku</title>',
  '<title>Pierwszy deploy na Vercelu - instrukcja krok po kroku</title>');
zamien('<h1>Bot Discord, czytnik newsów i Claude Code</h1>', '<h1>Pierwszy deploy na Vercelu</h1>');
zamien('<p>Instrukcja krok po kroku: od pustego folderu do bota, który wysyła podsumowania newsów i rozmawia z Claude Code.</p>',
  '<p>Instrukcja krok po kroku: konto na Vercelu, Vercel CLI i pierwsza strona dostępna pod publicznym adresem.</p>');
zamien('Wygląd Discorda i Claude Code mógł się zmienić od czasu przygotowania materiału (październik 2026) - szukaj przycisków o tych samych nazwach.',
  'Wygląd Vercela i konsoli mógł się zmienić od czasu przygotowania materiału (październik 2026) - szukaj przycisków o tych samych nazwach.');
fs.writeFileSync(path.join(__dirname, '..', 'cwiczenia-vercel.html'), html, 'utf8');
console.log('Złożono cwiczenia-vercel.html, ' + html.length + ' znaków');
