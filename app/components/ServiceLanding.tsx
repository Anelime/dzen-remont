import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import LeadCalculator from "./LeadCalculator";
import { Header, Footer } from "./SiteShell";
import { cases, company, faq, services, siteUrl } from "../site-data";

export type ServiceData = (typeof services)[number];

export function serviceMetadata(service: ServiceData): Metadata {
  return {
    title: `${service.title} в Санкт-Петербурге — ${service.priceLabel} | Дзен Ремонт`,
    description: `${service.title} в Санкт-Петербурге. Стартовая цена — ${service.priceLabel}. Предварительный расчёт по площади; смета после осмотра.`,
    alternates: { canonical: `${siteUrl}/${service.slug}` },
  };
}

export default function ServiceLanding({ service }: { service: ServiceData }) {
  const featuredCase = cases.find((project) => project.serviceSlug === service.slug);
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.description,
    areaServed: { "@type": "City", name: "Санкт-Петербург" },
    provider: {
      "@type": "Organization",
      name: company.name,
      legalName: company.legalName,
      telephone: company.phone,
      email: company.email,
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

        {featuredCase ? (
          <section className="section service-case-section">
            <div className="section-heading section-heading-row">
              <div>
                <p className="eyebrow">Пример выполненных работ</p>
                <h2>{featuredCase.title}</h2>
              </div>
              <p>
                Откройте кейс: внутри — площадь, фотографии, состав работ и срок,
                если он зафиксирован.
              </p>
            </div>
            <Link className="service-case-card" href={featuredCase.href}>
              <Image
                src={featuredCase.image}
                alt={featuredCase.alt}
                width={1200}
                height={800}
                sizes="(max-width: 760px) 100vw, 55vw"
                unoptimized
              />
              <span>
                <small>{featuredCase.type} · {featuredCase.stats}</small>
                <strong>{featuredCase.summary}</strong>
                <b>Открыть кейс →</b>
              </span>
            </Link>
          </section>
        ) : null}

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
            <h2>Смета, гарантия и команда</h2>
          </div>
          <div>
            {faq.slice(1, 7).map((item) => (
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
