import type { Metadata } from "next";
import Link from "next/link";
import LeadCalculator from "../components/LeadCalculator";
import { Footer, Header } from "../components/SiteShell";
import { company, siteUrl } from "../site-data";

export const metadata: Metadata = {
  title: "Ремонт квартиры по дизайн-проекту в СПб | НЕВА-ремонт",
  description:
    "Ремонт квартиры по готовому дизайн-проекту в Санкт-Петербурге: чертежи, инженерные решения, сложные узлы и расчёт по площади.",
  alternates: { canonical: `${siteUrl}/remont-po-dizayn-proektu-spb` },
};

export default function Page() {
  return (
    <>
      <Header />
      <main>
        <section className="service-hero section">
          <div>
            <Link className="eyebrow back-link" href="/#services">
              ← Все направления
            </Link>
            <h1>Ремонт квартиры по дизайн-проекту в Санкт-Петербурге</h1>
            <p className="hero-copy">
              Перед сметой компания сверяет чертежи, инженерные решения и
              сложные узлы. Недостающие решения нужно согласовать до начала
              соответствующего этапа.
            </p>
            <div className="hero-actions">
              <a className="button" href={company.telegram}>
                Открыть чат в Telegram
              </a>
              <a className="button button-ghost" href="#calculator">
                Перейти к расчёту
              </a>
            </div>
            <p className="microcopy">Дизайн-проект нужно прикрепить и отправить в чате.</p>
          </div>
          <aside className="service-hero-card">
            <span>Перед началом</span>
            <strong>Чертежи → узлы → смета → календарный план</strong>
            <p>
              До договора нужно уточнить, кто проверяет комплектность проекта и
              как стороны согласуют недостающие решения.
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
