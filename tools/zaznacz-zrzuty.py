# Nanosi na zrzuty Vercela i konsoli czerwone ramki i podpisy wskazujące, co kliknąć.
# Czyta oryginały z zrzuty/oryginaly/ (PNG lub JPG o nazwie z LISTA_ZRZUTOW), zapisuje JPG do zrzuty/
# (stamtąd bierze je tools/osadz-zrzuty.mjs). Zrzut bez wpisu w ZAZNACZENIA jest tylko konwertowany.
# Użycie: PYTHONUTF8=1 python tools/zaznacz-zrzuty.py
# Współrzędne w pikselach oryginału: (x0, y0, x1, y1). Wypełnij ZAZNACZENIA po zrobieniu zrzutów.
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

KATALOG = Path(__file__).resolve().parent.parent / "zrzuty"
ORYGINALY = KATALOG / "oryginaly"
KOLOR = (255, 59, 48)
GRUBOSC = 4
MARGINES = 6
SZEROKOSC_MAX = 1568
CZCIONKA = ImageFont.truetype("C:/Windows/Fonts/segoeuib.ttf", 20)

def wiersz(n, znaki):
    """Ramka wokół wiersza n (od 0) zrzutu konsoli o długości 'znaki' znaków."""
    return (18, 52 + 26 * n, 18 + round(znaki * 9.9), 52 + 26 * n + 22)


# Dla każdego zrzutu: lista (ramka, podpis, strona podpisu: nad / pod / lewo / prawo).
ZAZNACZENIA = {
    "02-metoda-logowania": [((565, 586, 956, 622), "Najprościej: Continue with Email", "nad")],
    "04-pusty-dashboard": [((1382, 80, 1497, 116), "Add New: tu zaczniesz projekt", "lewo")],
    "05-nodejs-lts": [((340, 164, 486, 202), "Wersja z etykietą LTS", "pod")],
    # Zrzuty konsoli: wiersz n leży na y = 52 + 26 * n, znak ma ok. 9,9 px szerokości (konsola_do_png.py).
    "07-vercel-login": [
        (wiersz(3, 60), "1. Otwórz ten adres i zatwierdź", "prawo"),
        (wiersz(5, 43), "2. Zalogowano", "prawo"),
    ],
    "09-pierwsze-pytania": [
        (wiersz(5, 38), "1. Create a new project", "prawo"),
        (wiersz(14, 32), "2. Enter (czyli N)", "prawo"),
    ],
    "12-adres-podgladu": [(wiersz(4, 79), "Preview (chroniony)", "prawo")],
    "13-vercel-prod": [(wiersz(7, 56), "Publiczny adres produkcji", "prawo")],
    "11-strona-w-przegladarce": [((448, 46, 935, 86), "Twoja strona pod adresem vercel.app", "pod")],
    "14-projekt-w-panelu": [((720, 246, 932, 264), "Publiczny adres Twojej strony", "pod")],
    "15-lista-wdrozen": [((897, 181, 992, 205), "Produkcja", "nad")],
    "16-usuwanie-projektu": [((1215, 605, 1332, 637), "Nie klikaj, to tylko podgląd", "lewo")],
}

# Dane osobiste do zasłonięcia (czarny prostokąt, rysowany przed ramkami): (x0, y0, x1, y1).
ZASLONY = {
    "04-pusty-dashboard": [(44, 16, 94, 40), (44, 700, 166, 724)],
    "14-projekt-w-panelu": [(18, 16, 148, 42), (14, 698, 170, 726), (720, 180, 1052, 200), (802, 308, 1016, 330)],
    "15-lista-wdrozen": [(18, 16, 148, 42), (14, 698, 170, 726), (397, 124, 590, 150), (1420, 180, 1450, 300)],
    "16-usuwanie-projektu": [(18, 16, 148, 42), (14, 698, 170, 726)],
}


def narysuj(obraz, ramka, podpis, strona):
    d = ImageDraw.Draw(obraz)
    x0, y0, x1, y1 = ramka
    d.rectangle((x0 - MARGINES, y0 - MARGINES, x1 + MARGINES, y1 + MARGINES), outline=KOLOR, width=GRUBOSC)
    szer = d.textlength(podpis, font=CZCIONKA) if hasattr(d, "textlength") else d.textsize(podpis, font=CZCIONKA)[0]
    wys = 26
    if strona == "nad":
        poz = (x0, y0 - MARGINES - wys - 4)
    elif strona == "pod":
        poz = (x0, y1 + MARGINES + 4)
    elif strona == "lewo":
        poz = (x0 - MARGINES - szer - 12, y0)
    else:
        poz = (x1 + MARGINES + 8, y0)
    d.rectangle((poz[0] - 4, poz[1] - 2, poz[0] + szer + 4, poz[1] + wys), fill=KOLOR)
    d.text(poz, podpis, font=CZCIONKA, fill=(255, 255, 255))


def main():
    pliki = sorted(p for p in ORYGINALY.iterdir() if p.suffix.lower() in {".png", ".jpg", ".jpeg"})
    if not pliki:
        print(f"Brak oryginałów w {ORYGINALY}")
        return
    for plik in pliki:
        obraz = Image.open(plik).convert("RGB")
        if obraz.width > SZEROKOSC_MAX:
            obraz = obraz.resize((SZEROKOSC_MAX, round(obraz.height * SZEROKOSC_MAX / obraz.width)), Image.LANCZOS)
        for zasłona in ZASLONY.get(plik.stem, []):
            ImageDraw.Draw(obraz).rectangle(zasłona, fill=(30, 41, 59))
        for ramka, podpis, strona in ZAZNACZENIA.get(plik.stem, []):
            narysuj(obraz, ramka, podpis, strona)
        cel = KATALOG / f"{plik.stem}.jpg"
        obraz.save(cel, "JPEG", quality=85)
        print(f"{plik.name} -> {cel.name} ({len(ZAZNACZENIA.get(plik.stem, []))} zaznaczeń)")


if __name__ == "__main__":
    main()
