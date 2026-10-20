<script id="dane">
const LISTA_ZRZUTOW = [
  { klucz: '02-metoda-logowania', podpis: 'vercel.com/signup: wybór sposobu logowania (Google, GitHub, Apple lub e-mail).' },
  { klucz: '04-pusty-dashboard', podpis: 'Nowe konto: pusty panel (dashboard) bez projektów, plan Hobby przy nazwie zespołu.' },
  { klucz: '05-nodejs-lts', podpis: 'Strona nodejs.org/en/download: wersja z etykietą LTS.' },
  { klucz: '06-wersje-w-konsoli', podpis: 'PowerShell: node --version, npm --version i vercel --version.' },
  { klucz: '07-vercel-login', podpis: 'vercel login: adres do zatwierdzenia w przeglądarce i komunikat o zalogowaniu.' },
  { klucz: '09-pierwsze-pytania', podpis: 'Polecenie vercel: pytania o projekt, nazwę i katalog.' },
  { klucz: '10-pierwszy-deploy', podpis: 'Koniec pierwszego wdrożenia: trafia od razu na produkcję.' },
  { klucz: '11-strona-w-przegladarce', podpis: 'Twoja strona pod adresem vercel.app.' },
  { klucz: '12-adres-podgladu', podpis: 'Drugie wdrożenie: adres Preview i ostrzeżenie o ochronie wdrożeń.' },
  { klucz: '13-vercel-prod', podpis: 'vercel --prod: adres produkcyjny (Production) i alias.' },
  { klucz: '14-projekt-w-panelu', podpis: 'Projekt w panelu Vercela: domena i ostatnie wdrożenie.' },
  { klucz: '15-lista-wdrozen', podpis: 'Zakładka Deployments: wdrożenia Preview i Production.' },
  { klucz: '16-usuwanie-projektu', podpis: 'Settings -> Delete Project na samym dole ustawień projektu.' },
];

const PROMPT_P1 = `Przygotuj w tym folderze prostą stronę internetową, którą za chwilę wdrożę na Vercel. Nie uruchamiaj żadnych poleceń vercel i nie loguj mnie nigdzie.

1. Utwórz jeden plik index.html: po polsku, nagłówek „Moja pierwsza strona na Vercelu”, krótki akapit o mnie (zostaw nawias kwadratowy do uzupełnienia), lista trzech rzeczy, które lubię (też do uzupełnienia) i stopka z rokiem. Wszystko w jednym pliku, CSS w tagu style, bez bibliotek z internetu i bez budowania. Strona ma ładnie wyglądać także na telefonie.
2. Utwórz plik .vercelignore z wpisami: .env, .env.*, .claude, .git, node_modules. Dzięki niemu te pliki nigdy nie trafią na serwery Vercela.
3. Utwórz plik .gitignore z wpisami: .env, .env.*, .vercel, node_modules.
4. Nie twórz pliku package.json ani żadnego kodu po stronie serwera.

Na koniec napisz po polsku, jak otworzyć index.html lokalnie, żeby obejrzeć stronę przed wdrożeniem.`;

const PROMPT_P2 = `Zmień stronę index.html w tym folderze: dodaj sekcję „Czego się dziś nauczyłem” z trzema punktami o wdrażaniu strony na Vercel (konto, CLI, deploy), oraz zmień kolor nagłówka na inny, który mi się spodoba. Zachowaj resztę strony. Nie uruchamiaj poleceń vercel - wdrożę zmianę sam.`;

const INSTRUKCJA = [
  { id: 'zanim-zaczniesz', tytul: '0. Zanim zaczniesz', elementy: [
    { typ: 'tekst', html: 'Za chwilę założysz konto na Vercelu, zainstalujesz jego narzędzie wiersza poleceń (<strong>Vercel CLI</strong>) i wdrożysz pierwszą stronę tak, że będzie dostępna pod publicznym adresem <code>https://nazwa.vercel.app</code>. Stronę przygotuje Claude Code, a wdrożenie zrobisz jednym poleceniem w PowerShellu - bez GitHuba.' },
    { typ: 'tekst', html: 'Potrzebujesz: adresu e-mail, Claude Code oraz Node.js w wersji LTS (zainstalujesz go w sekcji 2). Plan <strong>Hobby</strong> na Vercelu jest bezpłatny i przeznaczony do użytku osobistego, niekomercyjnego - na szkolenie wystarczy.' },
    { typ: 'komenda', tekst: 'claude --version' },
    { typ: 'wazne', html: 'Wdrożenie wysyła zawartość folderu na serwery Vercela, a adres <code>vercel.app</code> jest publiczny. Nigdy nie wkładaj do folderu strony plików z hasłami, tokenami ani plików <code>.env</code>. W sekcji 3 dodamy plik <code>.vercelignore</code>, który to wyklucza.' },
    { typ: 'mac', html: 'zamiast PowerShella używasz aplikacji Terminal. Polecenia <code>node</code>, <code>npm</code> i <code>vercel</code> są takie same.' },
    { typ: 'tekst', html: 'Włącz pokazywanie rozszerzeń plików: w Eksploratorze <strong>Widok -> Pokaż -> Rozszerzenia nazw plików</strong> (w Windows 10: Widok -> Rozszerzenia nazw plików).' },
    { typ: 'tekst', html: 'Utwórz pusty folder <code>moja-strona-vercel</code>, np. w Dokumentach. Otwórz go w Eksploratorze, kliknij w pasek adresu, wpisz <code>powershell</code> i naciśnij Enter - konsola otworzy się od razu w tym folderze. W tym folderze będziesz pracować do końca instrukcji.' },
  ] },
  { id: 'konto', tytul: '1. Konto na Vercelu', elementy: [
    { typ: 'tekst', html: 'Otwórz <a href="https://vercel.com/signup">vercel.com/signup</a>. Zobaczysz listę sposobów logowania: Google, GitHub, ChatGPT, Apple albo e-mail. Wybierz jeden - najprościej <strong>Continue with Email</strong>: wpiszesz adres, a Vercel wyśle Ci kod. W tej instrukcji GitHub nie jest potrzebny, ale możesz go użyć, jeśli masz tam konto.' },
    { typ: 'zrzut', klucz: '02-metoda-logowania' },
    { typ: 'tekst', html: 'Jeśli wybrałeś e-mail: wpisz adres, odbierz wiadomość od Vercela i wpisz z niej kod weryfikacyjny (maila szukaj też w spamie). Potem Vercel poprosi o imię i wybór planu - wybierz <strong>Hobby</strong> (bezpłatny, do użytku osobistego).' },
    { typ: 'sprawdz', html: 'Widzisz panel Vercela (dashboard) z napisem „Deploy your first project”, a obok nazwy zespołu w lewym górnym rogu plakietkę <strong>Hobby</strong>. Konto jest gotowe.' },
    { typ: 'zrzut', klucz: '04-pusty-dashboard' },
    { typ: 'uwaga', html: 'Vercel może poprosić o dodatkowe dane (np. numer telefonu) lub pokazać inną kolejność ekranów niż opisana. Baner z cookies możesz odrzucić. Jeśli Vercel prosi o kartę płatniczą do planu Hobby, przerwij i opisz to w ramce „Gdy coś pójdzie nie tak” - plan Hobby jej nie wymaga.' },
  ] },
  { id: 'narzedzia', tytul: '2. Node.js i Vercel CLI', elementy: [
    { typ: 'tekst', html: 'Vercel CLI to program napisany w Node.js. Sprawdź, czy masz Node.js:' },
    { typ: 'komenda', tekst: 'node --version' },
    { typ: 'tekst', html: 'Jeśli polecenie nie istnieje albo wersja jest niższa niż 20, wejdź na <a href="https://nodejs.org/en/download">nodejs.org/en/download</a>. Strona domyślnie pokazuje instalację przez Docker - zignoruj ją i przewiń niżej do wiersza „Or get a prebuilt Node.js® for Windows”, gdzie pobierzesz instalator (<strong>Windows Installer .msi</strong>) wersji z etykietą <strong>LTS</strong>. Uruchom go, zostawiając domyślne opcje. Potem <strong>zamknij PowerShell i otwórz go ponownie</strong> w swoim folderze (inaczej konsola nie zobaczy nowego programu).' },
    { typ: 'zrzut', klucz: '05-nodejs-lts' },
    { typ: 'wazne', html: 'Na wielu komputerach z Windows PowerShell blokuje programy npm i hasłem „running scripts is disabled on this system” (błąd <code>UnauthorizedAccess</code> przy <code>npm</code> lub <code>vercel</code>). To domyślne zabezpieczenie systemu. Rozwiąż je jednorazowo, w PowerShellu (zmiana dotyczy tylko Twojego konta):' },
    { typ: 'komenda', tekst: 'Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned' },
    { typ: 'tekst', html: 'Potwierdź literą <code>T</code> lub <code>Y</code> i zamknij oraz otwórz PowerShell ponownie.' },
    { typ: 'tekst', html: 'Zainstaluj Vercel CLI globalnie i sprawdź wersje:' },
    { typ: 'komenda', tekst: 'npm install --global vercel' },
    { typ: 'komenda', tekst: 'vercel --version' },
    { typ: 'sprawdz', html: 'Wszystkie trzy polecenia (<code>node --version</code>, <code>npm --version</code>, <code>vercel --version</code>) wypisują numery wersji.' },
    { typ: 'zrzut', klucz: '06-wersje-w-konsoli' },
    { typ: 'uwaga', html: 'Błąd „vercel is not recognized” po instalacji zwykle znaczy, że konsola została otwarta przed instalacją. Zamknij ją i otwórz od nowa.' },
    { typ: 'mac', html: 'jeśli <code>npm install --global</code> zgłasza brak uprawnień (EACCES), nie używaj <code>sudo</code> - poproś Claude Code o ustawienie katalogu globalnych pakietów npm w Twoim katalogu domowym.' },
  ] },
  { id: 'strona', tytul: '3. Strona do wdrożenia', elementy: [
    { typ: 'tekst', html: 'Uruchom Claude Code w folderze <code>moja-strona-vercel</code> i wklej poniższy prompt. Przy pierwszym uruchomieniu Claude Code zapyta, czy ufasz temu folderowi - potwierdź.' },
    { typ: 'komenda', tekst: 'claude' },
    { typ: 'prompt', id: 'P1', tytul: 'Prosta strona i pliki zabezpieczające', tekst: PROMPT_P1 },
    { typ: 'tekst', html: 'Otwórz <code>index.html</code> dwuklikiem i uzupełnij w nim nawiasy kwadratowe (albo poproś Claude Code, żeby wpisał treść, którą podasz).' },
    { typ: 'sprawdz', html: 'W folderze są trzy pliki: <code>index.html</code>, <code>.vercelignore</code> i <code>.gitignore</code>, a strona otwiera się w przeglądarce.' },
    { typ: 'wazne', html: 'Nie podawaj Claude Code żadnego hasła ani tokenu Vercela. Logowanie zrobisz sam w następnym kroku.' },
  ] },
  { id: 'logowanie', tytul: '4. Logowanie konsoli do Vercela', elementy: [
    { typ: 'tekst', html: 'Zamknij Claude Code (<code>/exit</code>) albo otwórz drugie okno PowerShella w tym samym folderze. Wpisz:' },
    { typ: 'komenda', tekst: 'vercel login' },
    { typ: 'tekst', html: 'Konsola wypisze adres w rodzaju <code>https://vercel.com/oauth/device?user_code=XXXX-XXXX</code> i napis „Waiting for authentication”. Otwórz ten adres w przeglądarce, w której jesteś zalogowany do Vercela, sprawdź, że kod na stronie zgadza się z kodem w konsoli, i zatwierdź logowanie.' },
    { typ: 'sprawdz', html: 'W konsoli pojawia się „Congratulations! You are now signed in.”.' },
    { typ: 'zrzut', klucz: '07-vercel-login' },
    { typ: 'komenda', tekst: 'vercel whoami' },
    { typ: 'sprawdz', html: 'Polecenie <code>vercel whoami</code> wypisuje Twoją nazwę użytkownika z Vercela.' },
    { typ: 'wazne', html: 'Zatwierdzaj tylko kod, który sam wywołałeś poleceniem <code>vercel login</code>. Nie twórz „tokenu” w ustawieniach konta i nie wklejaj go do czatu ani do plików projektu - do tej instrukcji wystarcza zwykłe logowanie.' },
  ] },
  { id: 'deploy', tytul: '5. Pierwszy deploy', elementy: [
    { typ: 'tekst', html: 'Upewnij się, że konsola jest w folderze ze stroną (<code>dir</code> pokazuje <code>index.html</code>) i wpisz samo:' },
    { typ: 'komenda', tekst: 'vercel' },
    { typ: 'tekst', html: 'CLI zada kilka pytań. Odpowiedz tak:' },
    { typ: 'tekst', html: '<strong>Which project?</strong> - strzałką w dół wybierz <code>Create a new project</code> i Enter.<br><strong>Name?</strong> - Enter (nazwa folderu) albo własna, małymi literami, cyframi i myślnikami, bez spacji.<br><strong>Code directory?</strong> - Enter (<code>./</code>).<br><strong>Customize settings? (y/N)</strong> - Enter (czyli „N”).' },
    { typ: 'zrzut', klucz: '09-pierwsze-pytania' },
    { typ: 'uwaga', html: 'Komunikat „No framework detected” jest w porządku: to zwykła strona HTML, bez frameworka. Dokładne brzmienie pytań zmienia się między wersjami CLI - sens zostaje: utwórz nowy projekt, zostaw katalog <code>./</code> i nie zmieniaj ustawień.' },
    { typ: 'tekst', html: 'Po kilku sekundach CLI wypisze adresy. <strong>Pierwsze wdrożenie projektu Vercel przypisuje automatycznie do produkcji</strong> - dostajesz od razu publiczny adres <code>https://nazwa-projektu.vercel.app</code>.' },
    { typ: 'zrzut', klucz: '10-pierwszy-deploy' },
    { typ: 'sprawdz', html: 'Otwórz <code>https://nazwa-projektu.vercel.app</code> (najlepiej w oknie prywatnym przeglądarki, bez logowania do Vercela) - widzisz swoją stronę.' },
    { typ: 'zrzut', klucz: '11-strona-w-przegladarce' },
  ] },
  { id: 'panel', tytul: '6. Projekt w panelu Vercela', elementy: [
    { typ: 'tekst', html: 'Zajrzyj do panelu <a href="https://vercel.com/dashboard">vercel.com/dashboard</a>: pojawił się Twój projekt z domeną i ostatnim wdrożeniem.' },
    { typ: 'zrzut', klucz: '14-projekt-w-panelu' },
    { typ: 'tekst', html: 'W zakładce <strong>Deployments</strong> projektu widać listę wszystkich wdrożeń. Vercel pamięta każdą wersję i można do niej wrócić.' },
    { typ: 'zrzut', klucz: '15-lista-wdrozen' },
  ] },
  { id: 'zmiana', tytul: '7. Zmiana na stronie: podgląd i produkcja', elementy: [
    { typ: 'tekst', html: 'Prawdziwa praca to powtarzanie cyklu: zmiana, podgląd (Preview), produkcja. Uruchom Claude Code w folderze strony i wklej prompt:' },
    { typ: 'prompt', id: 'P2', tytul: 'Zmiana strony', tekst: PROMPT_P2 },
    { typ: 'sprawdz', html: 'Po otwarciu <code>index.html</code> lokalnie widać nową sekcję i inny kolor nagłówka.' },
    { typ: 'tekst', html: 'Wyjdź z Claude Code i wdróż zmianę jako podgląd. Od drugiego wdrożenia samo <code>vercel</code> tworzy <strong>Preview</strong>, czyli wersję testową pod osobnym adresem:' },
    { typ: 'komenda', tekst: 'vercel' },
    { typ: 'zrzut', klucz: '12-adres-podgladu' },
    { typ: 'uwaga', html: 'Adresy Preview są domyślnie chronione (komunikat „Deployment Protection is on”): obcy zobaczy ekran logowania do Vercela, a Ty otworzysz je będąc zalogowany. Dlatego nie wysyłaj nikomu adresu Preview - publiczny jest adres produkcyjny.' },
    { typ: 'tekst', html: 'Gdy zmiana Ci się podoba, wypuść ją na produkcję dopisując <code>--prod</code>:' },
    { typ: 'komenda', tekst: 'vercel --prod' },
    { typ: 'zrzut', klucz: '13-vercel-prod' },
    { typ: 'sprawdz', html: 'W konsoli widzisz adres z dopiskiem <strong>Production</strong> oraz linię <strong>Aliased</strong> z adresem <code>nazwa-projektu.vercel.app</code>. Po odświeżeniu tego adresu (Ctrl+F5) widać nową wersję strony.' },
  ] },
  { id: 'sprzatanie', tytul: '8. Porządki i bezpieczeństwo', elementy: [
    { typ: 'tekst', html: 'Strona wdrożona na szkoleniu nie musi działać wiecznie. Możesz ją usunąć w panelu: wejdź w projekt -> <strong>Settings</strong> -> na dole <strong>Delete Project</strong> i potwierdź nazwą projektu.' },
    { typ: 'zrzut', klucz: '16-usuwanie-projektu' },
    { typ: 'tekst', html: 'Jeśli pracujesz na cudzym lub wspólnym komputerze, wyloguj konsolę z Vercela:' },
    { typ: 'komenda', tekst: 'vercel logout' },
    { typ: 'tekst', html: 'Folder strony zawiera teraz katalog <code>.vercel</code> z identyfikatorami projektu. Nie jest tajny, ale nie wysyłaj go do repozytorium - dlatego jest w <code>.gitignore</code>.' },
    { typ: 'sprawdz', html: 'Wiesz już, jak założyć konto, wdrożyć stronę z konsoli, wypuścić ją na produkcję i usunąć. Następny krok to połączenie projektu z repozytorium GitHub, żeby Vercel wdrażał zmiany sam po każdym zapisie - tym zajmiemy się osobno.' },
  ] },
  { id: 'problemy', tytul: '9. Typowe problemy', elementy: [
    { typ: 'tekst', html: '<strong>„running scripts is disabled on this system”</strong> - PowerShell blokuje skrypty npm. Wpisz <code>Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned</code> (sekcja 2) i otwórz konsolę od nowa.' },
    { typ: 'tekst', html: '<strong>„vercel” nie jest rozpoznawane</strong> - konsola otwarta przed instalacją Node.js lub CLI. Zamknij ją i otwórz od nowa w folderze ze stroną.' },
    { typ: 'tekst', html: '<strong>Error: Please login / not authorized</strong> - wpisz ponownie <code>vercel login</code>.' },
    { typ: 'tekst', html: '<strong>Strona jest pusta albo „404: NOT_FOUND”</strong> - w folderze nie ma pliku <code>index.html</code> (sprawdź nazwę i rozszerzenie) albo CLI uruchomiono w złym folderze.' },
    { typ: 'tekst', html: '<strong>Ekran logowania zamiast strony</strong> - otwierasz adres Preview. Użyj adresu z <code>vercel --prod</code>.' },
    { typ: 'tekst', html: '<strong>Nazwa projektu jest nieprawidłowa</strong> - użyj małych liter, cyfr i myślników, bez spacji i polskich znaków.' },
    { typ: 'tekst', html: '<strong>Ostrzeżenie o wersji Node.js</strong> - zainstaluj bieżącą wersję LTS z nodejs.org.' },
  ] },
];

const RAMKA_POMOCY = {
  szablon: 'Jestem początkujący, robię instrukcję „Pierwszy deploy na Vercelu”, krok [numer kroku]. Zrobiłem: [co zrobiłem]. Widzę: [komunikat albo co się dzieje]. Wyjaśnij po polsku, co się stało i co mam zrobić. Nie proś mnie o hasła ani tokeny.',
  sytuacje: [
    { tytul: 'Claude prosi o token Vercela', html: 'Nie podawaj go. Zaloguj się sam poleceniem <code>vercel login</code> w PowerShellu - Claude Code do wdrożenia nie jest potrzebny.' },
    { tytul: 'Przypadkiem pokazałem token', html: 'W panelu Vercela wejdź w Settings -> Tokens i usuń ten token, a potem w razie potrzeby zaloguj się ponownie przez <code>vercel login</code>.' },
    { tytul: 'Wdrożyłem folder z plikiem .env', html: 'Usuń projekt w panelu Vercela (sekcja 8), dodaj plik <code>.vercelignore</code> (prompt P1) i zmień hasła, które były w pliku.' },
    { tytul: 'Vercel prosi o kartę płatniczą', html: 'Plan Hobby jej nie wymaga. Przerwij i sprawdź, czy wybrałeś Hobby, nie Pro.' },
    { tytul: 'Zmiany nie widać po wdrożeniu', html: 'Wdróż produkcję poleceniem <code>vercel --prod</code> (samo <code>vercel</code> tworzy tylko podgląd) i odśwież stronę klawiszami Ctrl+F5.' },
  ],
};

const DANE = { LISTA_ZRZUTOW, INSTRUKCJA, RAMKA_POMOCY };
</script>
