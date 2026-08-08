import type { Metadata } from "next";
import Link from "next/link";
import LeadCalculator from "../components/LeadCalculator";
import { Footer, Header } from "../components/SiteShell";
import { company, siteUrl } from "../site-data";

export const metadata: Metadata = {
  title: "Ремонт квартиры по дизайн-проекту в СПб | НЕВА-ремонт",
  description:
    "Реализация ремонта по готовому дизайн-проекту: сверка чертежей, сложных узлов, инженерных решений и этапов работ.",
  alternates: { canonical: `${siteUrl}/remont-po-dizayn-proektu-spb` },
};

export default function Page() {
  return (
    <>
      <Header />
      <main>
        <section className="service-hero section">
          <div>
            <Link className="eyebrow back-link" href="/">
              ← Все направления
            </Link>
            <h1>Ремонт по дизайн-проекту без решений «на глаз»</h1>
            <p className="hero-copy">
              До сметы сверим комплект чертежей, инженерные решения и сложные
              узлы. По ходу работ спорные места согласуются до исполнения.
            </p>
            <div className="hero-actions">
              <a className="button" href={company.telegram}>
                Отправить проект
              </a>
              <a className="button button-ghost" href="#calculator">
                Получить ориентир
              </a>
            </div>
          </div>
          <aside className="service-hero-card">
            <span>Перед началом</span>
            <strong>Чертежи → узлы → смета → календарный план</strong>
            <p>
              Если каких-то чертежей не хватает, это станет видно до старта
              соответствующего этапа.
            </p>
          </aside>
        </section>
        <section className="section" id="calculator">
          <div className="section-heading">
            <p className="eyebrow">Расчёт</p>
            <h2>Укажите тип объекта и площадь</h2>
          </div>
          <LeadCalculator compact />
        </section>
      </main>
      <Footer />
    </>
  );
}

