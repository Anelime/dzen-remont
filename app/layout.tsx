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

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "НЕВА-ремонт — ремонт квартир под ключ в Санкт-Петербурге",
    template: "%s",
  },
  description:
    "Ремонт квартир и коммерческих помещений в Санкт-Петербурге. Стартовые цены — от 15 000 ₽/м²; предварительный расчёт по площади.",
  applicationName: "НЕВА-ремонт",
  openGraph: {
    type: "website",
    locale: "ru_RU",
    siteName: "НЕВА-ремонт",
    title: "Ремонт квартир под ключ в Санкт-Петербурге",
    description:
      "Капитальный ремонт квартир и коммерческих помещений в Санкт-Петербурге.",
    images: [{ url: "/og.png", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", images: ["/og.png"] },
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
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
