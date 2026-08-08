import type { Metadata } from "next";
import Link from "next/link";
import LeadCalculator from "./LeadCalculator";
import { Header, Footer } from "./SiteShell";
import { company, faq, services, siteUrl } from "../site-data";

export type ServiceData = (typeof services)[number];

export function serviceMetadata(service: ServiceData): Metadata {
  return {
    title: `${service.title} в Санкт-Петербурге — цена за м² | НЕВА-ремонт`,
    description: `${service.description} ${service.priceLabel}. Договор, поэтапная приёмка и фотоотчёты. Предварительный расчёт по площади.`,
    alternates: { canonical: `${siteUrl}/${service.slug}` },
  };
}

export default function ServiceLanding({ service }: { service: ServiceData }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.description,
    areaServed: { "@type": "City", name: "Санкт-Петербург" },
    provider: {
      "@type": "Organization",
      name: company.name,
      telephone: company.phone,
      url: siteUrl,
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "RUB",
      price: service.price,
      unitText: "м²",
      description: "Стартовая стоимость работ. Итоговая смета после осмотра.",
    },
  };

  return (
    <>
      <Header />
      <main>
        <section className="service-hero section">
          <div>
            <Link className="eyebrow back-link" href="/">
              ← Все направления
            </Link>
            <h1>{service.title} в Санкт-Петербурге</h1>
            <p className="hero-copy">{service.description}</p>
            <div className="hero-actions">
              <a className="button" href="#calculator">
                {service.cta}
              </a>
              <a className="button button-ghost" href={company.telegram}>
                Отправить планировку
              </a>
            </div>
          </div>
          <aside className="service-hero-card">
            <span>Стартовая стоимость</span>
            <strong>{service.priceLabel}</strong>
            <p>{service.audience}</p>
          </aside>
        </section>

        <section className="section split-section">
          <div>
            <p className="eyebrow">Что входит</p>
            <h2>Сначала состав работ, затем смета и календарный план</h2>
          </div>
          <ol className="clean-list numbered-list">
            <li>Осмотр объекта и проверка исходных данных</li>
            <li>Согласование работ, материалов и проектных решений</li>
            <li>Подробная смета и фиксация условий в договоре</li>
            <li>Выполнение и поэтапная приёмка по актам</li>
            <li>Фото- и видеоотчёты по ходу ремонта</li>
          </ol>
        </section>

        <section className="section proof-panel">
          <div>
            <span>С 2012 года</span>
            <p>опыт компании по данным текущего сайта</p>
          </div>
          <div>
            <span>70+ проектов</span>
            <p>жилые и коммерческие помещения, по данным компании</p>
          </div>
          <div>
            <span>2–3 объекта</span>
            <p>одновременно, по данным компании</p>
          </div>
        </section>

        <section className="section" id="calculator">
          <div className="section-heading">
            <p className="eyebrow">Расчёт</p>
            <h2>Получите ориентир для вашей площади</h2>
            <p>Детали можно сразу отправить Евгению в удобный мессенджер.</p>
          </div>
          <LeadCalculator compact />
        </section>

        <section className="section faq-grid">
          <div>
            <p className="eyebrow">До начала работ</p>
            <h2>Что стоит уточнить</h2>
          </div>
          <div>
            {faq.slice(0, 3).map((item) => (
              <details key={item.question}>
                <summary>{item.question}</summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
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
