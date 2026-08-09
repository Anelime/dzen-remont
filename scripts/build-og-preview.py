#!/usr/bin/env python3
"""Build the deterministic 1200x630 social preview for ZEN REMONT."""

from pathlib import Path

from PIL import Image, ImageOps


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "assets" / "og" / "og-zen-remont-v1-source.png"
OUTPUT = ROOT / "public" / "og-zen-remont-v1.jpg"

WIDTH = 1200
HEIGHT = 630
def build() -> None:
    source = Image.open(SOURCE).convert("RGB")
    canvas = ImageOps.fit(
        source,
        (WIDTH, HEIGHT),
        method=Image.Resampling.LANCZOS,
        centering=(0.5, 0.5),
    )
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
