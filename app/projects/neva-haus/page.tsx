import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import LeadCalculator from "../../components/LeadCalculator";
import { Footer, Header } from "../../components/SiteShell";
import { siteUrl } from "../../site-data";

export const metadata: Metadata = {
  title: "Ремонт квартиры в ЖК Neva Haus | НЕВА-ремонт",
  description:
    "Кейс ремонта квартиры в ЖК Neva Haus: перегородки, стяжка, электрика, сантехника, малярные и плиточные работы.",
  alternates: { canonical: `${siteUrl}/projects/neva-haus` },
};

const gallery = [
  {
    src: "https://static.tildacdn.com/tild3535-6163-4263-b538-343762393433/photo_2025-10-16_21-.jpg",
    alt: "Комната с деревянным полом и установленными светильниками в ЖК Neva Haus",
  },
  {
    src: "https://static.tildacdn.com/tild6539-3435-4764-b835-666261616665/photo_2025-10-16_21-.jpg",
    alt: "Инженерный узел и отделка санузла в квартире ЖК Neva Haus",
  },
  {
    src: "https://static.tildacdn.com/tild6162-3630-4335-b136-326536663931/photo_2025-10-16_21-.jpg",
    alt: "Комната с уложенным полом и незавершённым потолком в ЖК Neva Haus",
  },
];

export default function Page() {
  return (
    <>
      <Header />
      <main>
        <section className="case-hero section">
          <div>
            <Link className="eyebrow back-link" href="/#projects">← Все проекты</Link>
            <h1>Капитальный ремонт квартиры в ЖК Neva Haus</h1>
            <p className="hero-copy">
              На объекте сделали стяжку, новые перегородки, электрику,
              сантехнику, плиточные и малярные работы.
            </p>
          </div>
          <dl className="case-facts">
            <div><dt>Площадь</dt><dd>78 м²</dd></div>
            <div><dt>Тип</dt><dd>Новостройка</dd></div>
            <div><dt>Комнаты</dt><dd>2</dd></div>
          </dl>
        </section>
        <section className="section project-gallery">
          {gallery.map((image) => (
            <Image key={image.src} src={image.src} alt={image.alt} width="700" height="1242" unoptimized />
          ))}
        </section>
        <section className="section split-section">
          <div>
            <p className="eyebrow">Состав работ</p>
            <h2>Что сделали на объекте</h2>
          </div>
          <ul className="clean-list">
            <li>Стяжка и выравнивание пола</li>
            <li>ГКЛ/ГВЛ-перегородки</li>
            <li>Выравнивание стен и потолков</li>
            <li>Электрика и сантехника</li>
            <li>Малярные и плиточные работы</li>
            <li>Установка сантехники и электроприборов</li>
          </ul>
        </section>
        <section className="section" id="calculator">
          <div className="section-heading"><p className="eyebrow">Новостройка</p><h2>Получите предварительный ориентир по площади</h2></div>
          <LeadCalculator compact initialServiceSlug="remont-kvartir-v-novostroyke-spb" />
        </section>
      </main>
      <Footer />
    </>
  );
}
