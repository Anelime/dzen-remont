import type { Metadata, Viewport } from "next";
import { Literata, Onest } from "next/font/google";
import { AnalyticsConsent } from "./components/Analytics";
import { isIndexable, siteUrl } from "./site-data";
import "./globals.css";

const onest = Onest({
  variable: "--font-onest",
  subsets: ["cyrillic", "latin"],
  display: "swap",
});

const literata = Literata({
  variable: "--font-literata",
  subsets: ["cyrillic", "latin"],
  display: "swap",
});

const socialTitle = "Ремонт помещений в Санкт-Петербурге | ZEN-ремонт";
const socialDescription =
  "Коммерческие помещения — основное направление. Салоны, офисы и другие объекты — от 15 000 ₽/м².";
const socialImageUrl = `${siteUrl}/og-zen-remont-v1.jpg`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "ZEN-ремонт — ремонт коммерческих помещений в Санкт-Петербурге",
    template: "%s",
  },
  description:
    "Ремонт коммерческих помещений в Санкт-Петербурге: салоны, офисы и другие объекты. От 15 000 ₽/м²; расчёт по площади, смета после осмотра.",
  applicationName: "ZEN-ремонт",
  alternates: { canonical: siteUrl },
  openGraph: {
    type: "website",
    url: siteUrl,
    locale: "ru_RU",
    siteName: "ZEN-ремонт",
    title: socialTitle,
    description: socialDescription,
    images: [
      {
        url: socialImageUrl,
        secureUrl: socialImageUrl,
        width: 1200,
        height: 630,
        type: "image/jpeg",
        alt: "ZEN-ремонт — ремонт коммерческих помещений в Санкт-Петербурге",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: socialTitle,
    description: socialDescription,
    images: [
      {
        url: socialImageUrl,
        alt: "ZEN-ремонт — ремонт коммерческих помещений в Санкт-Петербурге",
      },
    ],
  },
  icons: {
    icon: "/brand/favicon-32x32.png",
    shortcut: "/brand/favicon-32x32.png",
    apple: "/brand/apple-touch-icon.png",
  },
  robots: isIndexable
    ? { index: true, follow: true }
    : { index: false, follow: false, nocache: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#111820",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <body className={`${onest.variable} ${literata.variable}`}>
        {children}
        <AnalyticsConsent />
      </body>
    </html>
  );
}
