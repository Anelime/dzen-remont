import type { Metadata } from "next";
import Link from "next/link";
import LeadCalculator from "../components/LeadCalculator";
import { Footer, Header } from "../components/SiteShell";
import { company, siteUrl } from "../site-data";

export const metadata: Metadata = {
  title: "Завершить ремонт после другого подрядчика в СПб | НЕВА-ремонт",
  description:
    "Осмотр незавершённого ремонта, оценка состояния и оставшегося объёма работ. Предварительное обсуждение с руководителем НЕВА-ремонт.",
  alternates: { canonical: `${siteUrl}/zavershit-remont-posle-podryadchika` },
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
            <h1>Оценим, как безопасно завершить остановленный ремонт</h1>
            <p className="hero-copy">
              Сначала осмотрим объект и отделим выполненные работы от тех, что
              требуют проверки или переделки. Только после этого назовём объём и
              подготовим смету.
            </p>
            <div className="hero-actions">
              <a className="button" href={company.telegram}>
                Отправить фото Евгению
              </a>
              <a className="button button-ghost" href={company.phoneHref}>
                Позвонить
              </a>
            </div>
          </div>
          <aside className="service-hero-card accent-card">
            <span>Без обещаний вслепую</span>
            <strong>Осмотр → перечень рисков → смета</strong>
            <p>
              На сайте компании есть кейс завершения коммерческого помещения,
              оставленного предыдущим подрядчиком.
            </p>
          </aside>
        </section>
        <section className="section" id="calculator">
          <div className="section-heading">
            <p className="eyebrow">Ориентир</p>
            <h2>Соберите исходные данные перед разговором</h2>
          </div>
          <LeadCalculator compact />
        </section>
      </main>
      <Footer />
    </>
  );
}

