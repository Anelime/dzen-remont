import type { Metadata } from "next";
import CaseGrid from "../components/CaseGrid";
import { Footer, Header } from "../components/SiteShell";
import { cases, siteUrl } from "../site-data";

export const metadata: Metadata = {
  title: "Выполненные проекты ремонта в Санкт-Петербурге | Дзен Ремонт",
  description:
    "Кейсы Дзен Ремонт: коммерческое помещение, квартира в старом фонде и новостройка. Фотографии, площадь, сроки и выполненные работы.",
  alternates: { canonical: `${siteUrl}/projects` },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: `${siteUrl}/projects`,
    siteName: "Дзен Ремонт",
    title: "Выполненные проекты ремонта | Дзен Ремонт",
    description:
      "Коммерческий объект и квартиры: фотографии, площадь, состав работ и сроки там, где они зафиксированы.",
    images: [`${siteUrl}/og-dzen-remont-v1.jpg`],
  },
  twitter: {
    card: "summary_large_image",
    title: "Выполненные проекты ремонта | Дзен Ремонт",
    description:
      "Коммерческий объект и квартиры: фотографии, площадь, состав работ и сроки там, где они зафиксированы.",
    images: [`${siteUrl}/og-dzen-remont-v1.jpg`],
  },
};

export default function ProjectsPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Выполненные проекты Дзен Ремонт",
    url: `${siteUrl}/projects`,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: cases.map((project, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: project.title,
        url: `${siteUrl}${project.href}`,
      })),
    },
  };

  return (
    <>
      <Header />
      <main>
        <section className="section projects-hero">
          <p className="eyebrow">Выполненные проекты</p>
          <h1>Ремонт помещений: задачи, работы и фотографии</h1>
          <p className="hero-copy">
            Откройте проект: внутри — площадь, состав работ, подробные
            фотографии и срок, если он зафиксирован. Показываем только факты,
            которые можно подтвердить.
          </p>
        </section>
        <section className="section dark-section projects-index-section">
          <CaseGrid />
        </section>
      </main>
      <Footer />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </>
  );
}
