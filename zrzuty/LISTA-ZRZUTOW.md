# Lista zrzutów (konto testowe Vercel)

Zapisuj jako PNG w `zrzuty/oryginaly/` pod nazwą z pierwszej kolumny. Folder `oryginaly/` jest w `.gitignore`.
Zasłoń e-mail, nazwę konta i nazwę zespołu (robi to `tools/zaznacz-zrzuty.py`, słownik ZASLONY).
Zrzuty konsoli (06, 07, 09, 10, 12, 13) powstają z prawdziwego tekstu poleceń przez `tools/konsola_do_png.py`.

| Nazwa pliku | Co ma być widać | Status |
|---|---|---|
| 02-metoda-logowania | vercel.com/signup, wybór sposobu logowania | gotowy |
| 04-pusty-dashboard | panel nowego konta bez projektów | gotowy |
| 05-nodejs-lts | nodejs.org/en/download z etykietą LTS | gotowy |
| 06-wersje-w-konsoli | node, npm, vercel --version | gotowy |
| 07-vercel-login | vercel login i komunikat o zalogowaniu | gotowy |
| 09-pierwsze-pytania | pytania pierwszego `vercel` | gotowy |
| 10-pierwszy-deploy | koniec pierwszego wdrożenia (produkcja) | gotowy |
| 11-strona-w-przegladarce | https://moja-strona-vercel.vercel.app | gotowy |
| 12-adres-podgladu | `vercel`: adres Preview | gotowy |
| 13-vercel-prod | `vercel --prod` | gotowy |
| 14-projekt-w-panelu | projekt w panelu: domena i wdrożenie | gotowy |
| 15-lista-wdrozen | zakładka Deployments | gotowy |
| 16-usuwanie-projektu | Settings, na dole Delete Project (bez klikania) | gotowy |

Po zrobieniu zrzutów:

```
PYTHONUTF8=1 python tools/zaznacz-zrzuty.py
node tools/zloz-html.js <szablon.html>   (tylko gdy zmieniasz tools/dane.js)
node tools/osadz-zrzuty.mjs
npm test
```
