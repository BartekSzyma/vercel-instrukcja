# Renderuje zapis sesji PowerShella (zwykły tekst UTF-8) do PNG w stylu ciemnej konsoli.
# Użycie: PYTHONUTF8=1 python tools/konsola_do_png.py zapis.txt zrzuty/oryginaly/06-wersje-w-konsoli.png
# Wiersze zaczynające się od "PS " są podświetlone jako wiersz polecenia. Tekst pochodzi z prawdziwych uruchomień.
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

TLO = (12, 12, 12)
TEKST = (204, 204, 204)
POLECENIE = (255, 255, 120)
PASEK = (31, 31, 31)
CZCIONKA = ImageFont.truetype("C:/Windows/Fonts/consola.ttf", 18)
MARGINES = 18
PASEK_WYS = 34


def renderuj(linie, cel):
    d0 = ImageDraw.Draw(Image.new("RGB", (10, 10)))
    szer_znaku = d0.textlength("M", font=CZCIONKA)
    wys_linii = 26
    szer = int(max(len(l) for l in linie) * szer_znaku + 2 * MARGINES)
    szer = max(szer, 900)
    wys = PASEK_WYS + len(linie) * wys_linii + 2 * MARGINES
    obraz = Image.new("RGB", (szer, wys), TLO)
    d = ImageDraw.Draw(obraz)
    d.rectangle((0, 0, szer, PASEK_WYS), fill=PASEK)
    d.text((MARGINES, 6), "Windows PowerShell", font=CZCIONKA, fill=(230, 230, 230))
    y = PASEK_WYS + MARGINES
    for l in linie:
        d.text((MARGINES, y), l, font=CZCIONKA, fill=POLECENIE if l.startswith("PS ") else TEKST)
        y += wys_linii
    obraz.save(cel)
    print(f"{cel} ({szer}x{wys})")


if __name__ == "__main__":
    zrodlo, cel = Path(sys.argv[1]), Path(sys.argv[2])
    renderuj(zrodlo.read_text(encoding="utf-8").rstrip("\n").split("\n"), cel)
