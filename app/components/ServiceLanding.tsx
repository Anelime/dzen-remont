import type { Metadata } from "next";
import Link from "next/link";
import LeadCalculator from "./LeadCalculator";
import { Header, Footer } from "./SiteShell";
import { company, faq, services, siteUrl } from "../site-data";

export type ServiceData = (typeof services)[number];

export function serviceMetadata(service: ServiceData): Metadata {
  return {
    title: `${service.title} в Санкт-Петербурге — ${service.priceLabel} | Дзен Ремонт`,
    description: `${service.title} в Санкт-Петербурге. Стартовая цена — ${service.priceLabel}. Предварительный расчёт по площади; смета после осмотра.`,
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
  };

  return (
    <>
      <Header />
      <main>
        <section className="service-hero section">
          <div>
            <Link className="eyebrow back-link" href="/#services">
              ← Все направления
            </Link>
            <h1>{service.title} в Санкт-Петербурге</h1>
            <p className="hero-copy">{service.description}</p>
            <div className="hero-actions">
              <a className="button" href="#calculator">
                {service.cta}
              </a>
              <a className="button button-ghost" href={company.telegram}>
                Открыть чат в Telegram
              </a>
            </div>
            <p className="microcopy">
              Планировку или фотографии нужно прикрепить и отправить в чате.
            </p>
          </div>
          <aside className="service-hero-card">
            <span>Стартовая цена</span>
            <strong>{service.priceLabel}</strong>
            <p>{service.audience}</p>
          </aside>
        </section>

        <section className="section split-section">
          <div>
            <p className="eyebrow">Этапы ремонта</p>
            <h2>Пять этапов — от осмотра до приёмки</h2>
          </div>
          <ol className="clean-list numbered-list">
            <li>Осмотр объекта и изучение планировки или проекта</li>
            <li>Согласование работ, материалов и проектных решений</li>
            <li>Смета и условия договора</li>
            <li>Работы по этапам и фото- или видеоотчёты</li>
            <li>Приёмка этапа по акту и оплата</li>
          </ol>
        </section>

        <section className="section proof-panel">
          <div>
            <span>С 2012 года</span>
            <p>ремонтируем коммерческие и жилые помещения</p>
          </div>
          <div>
            <span>70+ проектов</span>
            <p>коммерческие и жилые помещения</p>
          </div>
          <div>
            <span>Не больше трёх</span>
            <p>объектов одновременно</p>
          </div>
        </section>

        <section className="section" id="calculator">
          <div className="section-heading">
            <p className="eyebrow">Расчёт</p>
            <h2>Калькулятор покажет предварительный ориентир</h2>
            <p>Для сметы нужен осмотр; здесь достаточно выбрать тип ремонта и площадь.</p>
          </div>
          <LeadCalculator compact initialServiceSlug={service.slug} />
        </section>

        <section className="section faq-grid">
          <div>
            <p className="eyebrow">До начала работ</p>
            <h2>Смета, оплата и отчёты</h2>
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
