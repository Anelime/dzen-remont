import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import LeadCalculator from "../../components/LeadCalculator";
import { Footer, Header } from "../../components/SiteShell";
import { siteUrl } from "../../site-data";

export const metadata: Metadata = {
  title: "Ремонт квартиры 78 м² в ЖК Neva Haus | НЕВА-ремонт",
  description:
    "Кейс капитального ремонта двухкомнатной квартиры 78 м² в ЖК Neva Haus: перегородки, стяжка, инженерия, малярные и плиточные работы.",
  alternates: { canonical: `${siteUrl}/projects/neva-haus` },
};

const gallery = [
  "https://static.tildacdn.com/tild3535-6163-4263-b538-343762393433/photo_2025-10-16_21-.jpg",
  "https://static.tildacdn.com/tild6539-3435-4764-b835-666261616665/photo_2025-10-16_21-.jpg",
  "https://static.tildacdn.com/tild6162-3630-4335-b136-326536663931/photo_2025-10-16_21-.jpg",
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
              Двухкомнатная квартира 78 м²: от устройства стяжки и новых
              перегородок до инженерных, плиточных и малярных работ.
            </p>
          </div>
          <dl className="case-facts">
            <div><dt>Площадь</dt><dd>78 м²</dd></div>
            <div><dt>Тип</dt><dd>Новостройка</dd></div>
            <div><dt>Комнаты</dt><dd>2</dd></div>
          </dl>
        </section>
        <section className="section project-gallery">
          {gallery.map((src, index) => (
            <Image key={src} src={src} alt={`Ремонт квартиры в ЖК Neva Haus — этап ${index + 1}`} width="700" height="1242" unoptimized />
          ))}
        </section>
        <section className="section split-section">
          <div>
            <p className="eyebrow">Состав работ</p>
            <h2>Что заявлено в карточке проекта</h2>
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
          <div className="section-heading"><p className="eyebrow">Похожий объект</p><h2>Рассчитайте ориентир для своей площади</h2></div>
          <LeadCalculator compact />
        </section>
      </main>
      <Footer />
    </>
  );
}
