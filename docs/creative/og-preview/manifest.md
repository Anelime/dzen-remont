# Telegram and Open Graph preview v2

- Final asset: `public/og-neva-remont-v2.jpg`
- Canvas: 1200 × 630 px, RGB JPEG
- Background source: `assets/og/og-background-v2.jpg`
- Background treatment: built-in ImageGen edit of the previous `public/og.png`; no generated text or claims
- Deterministic overlay: `scripts/build-og-preview.py`
- Exact copy: `NEVA`, `РЕМОНТ`, `САНКТ-ПЕТЕРБУРГ`, `Ремонт квартир под ключ`, `в Санкт-Петербурге`, `С 2012 года · 70+ проектов`, `Новостройки · старый фонд`, `Коммерческие помещения`
- Brand palette: navy `#111820`, paper `#F4F1EA`, copper `#B85B36`, acid `#D9EF68`
- Claims source: the homepage facts and service scope in `app/page.tsx` and `app/site-data.ts`
- Exclusions: no fixed price, phone, guarantee, award, testimonial, or pseudo-button

Rebuild on macOS with Pillow installed:

```sh
python3 scripts/build-og-preview.py
```
