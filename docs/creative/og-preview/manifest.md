# Telegram and Open Graph preview: ZEN REMONT v1

- Final asset: `public/og-zen-remont-v1.jpg`
- Canvas: 1200 × 630 px, RGB JPEG
- Source card: `assets/og/og-zen-remont-v1-source.png`
- Photo source: `assets/og/karpovka-source.jpg`, completed salon project on Karpovka
- Brand mark source: `public/brand/zen-mark-512.png`
- Creative treatment: built-in ImageGen social-preview composition; deterministic resize and export in `scripts/build-og-preview.py`
- Deterministic 1200 × 630 export: `scripts/build-og-preview.py`
- Exact copy: `ZEN`, `REMONT`, `САНКТ-ПЕТЕРБУРГ`, `Ремонт коммерческих помещений под ключ`, `С 2012 года · 70+ проектов`, `Салоны · офисы · другие помещения`
- Brand palette: navy `#111820`, paper `#F4F1EA`, copper `#B85B36`, acid `#D9EF68`
- Claims source: the homepage facts, commercial service and Karpovka case in `app/page.tsx` and `app/site-data.ts`
- Exclusions: no fixed price, phone, guarantee, award, testimonial, or pseudo-button

Rebuild on macOS with Pillow installed:

```sh
python3 scripts/build-og-preview.py
```
