#!/usr/bin/env python3
"""Build the deterministic 1200x630 social preview for NEVA-remont."""

from pathlib import Path

from PIL import Image, ImageDraw, ImageFont, ImageOps


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "assets" / "og" / "og-background-v2.jpg"
OUTPUT = ROOT / "public" / "og-neva-remont-v2.jpg"

WIDTH = 1200
HEIGHT = 630
NAVY = "#111820"
PAPER = "#F4F1EA"
COPPER = "#B85B36"
ACID = "#D9EF68"

FONT_PATH = "/System/Library/Fonts/Avenir Next.ttc"
FONT_HEAVY = 8
FONT_DEMIBOLD = 2
FONT_REGULAR = 7


def font(size: int, index: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(FONT_PATH, size=size, index=index)


def tracked_text(
    draw: ImageDraw.ImageDraw,
    position: tuple[int, int],
    text: str,
    text_font: ImageFont.FreeTypeFont,
    fill: str,
    spacing: int,
) -> None:
    x, y = position
    for character in text:
        draw.text((x, y), character, font=text_font, fill=fill)
        x += int(draw.textlength(character, font=text_font)) + spacing


def build() -> None:
    background = Image.open(SOURCE).convert("RGB")
    canvas = ImageOps.fit(
        background,
        (WIDTH, HEIGHT),
        method=Image.Resampling.LANCZOS,
        centering=(0.5, 0.5),
    )
    draw = ImageDraw.Draw(canvas)

    # Logo lockup
    draw.text((64, 47), "NEVA", font=font(36, FONT_HEAVY), fill=PAPER)
    tracked_text(draw, (65, 88), "РЕМОНТ", font(14, FONT_DEMIBOLD), COPPER, 2)

    # Eyebrow and headline
    draw.rounded_rectangle((64, 148, 108, 152), radius=2, fill=COPPER)
    tracked_text(
        draw,
        (126, 137),
        "САНКТ-ПЕТЕРБУРГ",
        font(14, FONT_DEMIBOLD),
        COPPER,
        1,
    )
    draw.text((64, 178), "Ремонт квартир", font=font(52, FONT_DEMIBOLD), fill=PAPER)
    draw.text((64, 235), "под ключ", font=font(60, FONT_DEMIBOLD), fill=PAPER)
    draw.text(
        (66, 310),
        "в Санкт-Петербурге",
        font=font(29, FONT_REGULAR),
        fill=PAPER,
    )

    # Source-grounded proof and service scope
    proof = "С 2012 года · 70+ проектов"
    proof_font = font(18, FONT_DEMIBOLD)
    proof_box = draw.textbbox((0, 0), proof, font=proof_font)
    proof_width = proof_box[2] - proof_box[0]
    draw.rounded_rectangle((64, 385, 64 + proof_width + 34, 431), radius=23, fill=ACID)
    draw.text((81, 396), proof, font=proof_font, fill=NAVY)

    draw.text(
        (65, 483),
        "Новостройки · старый фонд",
        font=font(17, FONT_DEMIBOLD),
        fill=PAPER,
    )
    draw.text(
        (65, 512),
        "Коммерческие помещения",
        font=font(17, FONT_REGULAR),
        fill=PAPER,
    )
    draw.rounded_rectangle((64, 564, 500, 568), radius=2, fill=COPPER)

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    canvas.save(
        OUTPUT,
        format="JPEG",
        quality=90,
        optimize=True,
        progressive=True,
        subsampling=0,
    )
    print(OUTPUT)


if __name__ == "__main__":
    build()
