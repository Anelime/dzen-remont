import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import LeadCalculator from "./components/LeadCalculator";
import { TrackedLink } from "./components/Analytics";
import { Footer, Header } from "./components/SiteShell";
import { cases, company, faq, services, siteUrl } from "./site-data";

export const metadata: Metadata = {
  title: "Ремонт помещений в Санкт-Петербурге | ZEN-ремонт",
  description:
    "Ремонт коммерческих помещений в Санкт-Петербурге: салоны, офисы и другие объекты. От 15 000 ₽/м²; расчёт по площади, смета после осмотра.",
  alternates: { canonical: siteUrl },
};

export default function Home() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: company.name,
    url: siteUrl,
    telephone: company.phone,
    logo: `${siteUrl}/brand/zen-mark-512.png`,
    areaServed: { "@type": "City", name: "Санкт-Петербург" },
    knowsAbout: [
      "ремонт коммерческих помещений",
      "ремонт салонов красоты",
      "ремонт офисов",
      "ремонт квартир в новостройке",
      "ремонт квартир в старом фонде",
    ],
  };
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return (
    <>
      <Header />
      <main>
        <section className="hero section">
          <div className="hero-content">
            <p className="eyebrow">Коммерческие объекты — основное направление</p>
            <h1 className="commercial-hero-title">
              <span>Ремонт помещений</span>
              <em>в Санкт-Петербурге</em>
            </h1>
            <p className="hero-copy">
              Ремонтируем салоны, офисы и другие коммерческие помещения. Также
              берём в работу квартиры в новостройках и старом фонде.
              Коммерческий ремонт — от 15 000 ₽/м². Смету составляем после
              осмотра.
            </p>
            <div className="hero-actions">
              <a className="button" href="#calculator">
                Получить ориентир по площади
              </a>
              <a className="button button-ghost" href="#projects">
                Посмотреть коммерческий проект
              </a>
            </div>
            <p className="microcopy">
              Калькулятор покажет нижний ориентир по типу объекта и площади.
              Телефон вводить не нужно.
            </p>
          </div>
          <figure className="hero-visual">
            <Image
              src="https://static.tildacdn.com/tild3165-3237-4761-b732-653265313263/xC7xrs-Vr5RE6zwlIQ5j.jpg"
              alt="Интерьер салона красоты на Карповке"
              width="700"
              height="1245"
              fetchPriority="high"
              unoptimized
            />
            <figcaption>
              <span>Салон красоты · Карповка</span>
              <strong>70 м² · 5 недель</strong>
            </figcaption>
          </figure>
        </section>

        <section className="proof-strip" aria-label="Факты о ZEN-ремонт">
          <div><strong>С 2012 года</strong><span>ремонтируем коммерческие и жилые помещения</span></div>
          <div><strong>70+ проектов</strong><span>в портфолио</span></div>
          <div><strong>После акта</strong><span>оплата принятого этапа</span></div>
          <div><strong>До трёх объектов</strong><span>ведём одновременно</span></div>
        </section>

        <section className="section" id="services">
          <div className="section-heading section-heading-row">
            <div>
              <p className="eyebrow">Ремонт помещений</p>
              <h2>Для бизнеса — коммерческие объекты. Для жизни — квартиры</h2>
            </div>
            <p>
              Для каждого направления указали стартовую цену, состав работ и
              порядок расчёта.
            </p>
          </div>
          <div className="service-grid">
            <Link className="service-card service-card-primary" href={`/${services[0].slug}`}>
              <span className="card-index">01</span>
              <h3>{services[0].short}</h3>
              <p>{services[0].description}</p>
              <strong>{services[0].priceLabel}</strong>
              <span className="card-link">Что входит →</span>
            </Link>
            <Link className="service-card service-card-accent" href="/zavershit-remont-posle-podryadchika">
              <span className="card-index">02</span>
              <h3>Завершить ремонт после подрядчика</h3>
              <p>Проверка выполненных работ, перечень оставшихся задач и новая смета.</p>
              <strong>Сначала осмотр</strong>
              <span className="card-link">Как проходит проверка →</span>
            </Link>
            {services.slice(1).map((service, index) => (
              <Link className="service-card" href={`/${service.slug}`} key={service.slug}>
                <span className="card-index">0{index + 3}</span>
                <h3>{service.short}</h3>
                <p>{service.description}</p>
                <strong>{service.priceLabel}</strong>
                <span className="card-link">Что входит →</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="section dark-section" id="projects">
          <div className="section-heading section-heading-row">
            <div>
              <p className="eyebrow eyebrow-light">Выполненные проекты</p>
              <h2>В кейсах — площадь, срок и выполненные работы</h2>
            </div>
            <p>
              В каждом кейсе — площадь, задача и состав работ. Срок показываем
              для проектов, где он зафиксирован.
            </p>
          </div>
          <div className="case-grid">
            {cases.map((item) => (
              <article className="case-card" key={item.id}>
                <div className="case-image-wrap">
                  <Image src={item.image} alt={item.alt} width="700" height="900" loading="lazy" unoptimized />
                  <span>{item.type}</span>
                </div>
                <div className="case-copy">
                  <p>{item.stats}</p>
                  <h3>{item.title}</h3>
                  <p>{item.summary}</p>
                  {item.id === "neva-haus" ? (
                    <Link href="/projects/neva-haus">Посмотреть состав работ →</Link>
                  ) : (
                    <a href="#calculator">Перейти к расчёту →</a>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section pricing-section">
          <div className="pricing-copy">
            <p className="eyebrow">Стартовые цены</p>
            <h2>Коммерческий ремонт — от 15 000 ₽/м²</h2>
            <p>
              Калькулятор даёт нижний ориентир. После осмотра уточняем
              состояние помещения, демонтаж, инженерные решения и комплект
              чертежей, затем составляем смету.
            </p>
          </div>
          <div className="price-table">
            {services.map((service) => (
              <div key={service.slug}>
                <span>{service.short}</span>
                <strong>{service.priceLabel}</strong>
              </div>
            ))}
          </div>
        </section>

        <section className="section process-section" id="process">
          <div className="section-heading">
            <p className="eyebrow">Как работаем</p>
            <h2>От осмотра помещения до оплаты по акту</h2>
          </div>
          <ol className="process-list" role="list">
            {[
              ["Осмотр помещения", "Получаем планировку или проект, уточняем задачу и осматриваем помещение."],
              ["Состав работ и смета", "Перечисляем работы, их стоимость и последовательность."],
              ["Договор", "До начала работ согласовываем цену, сроки и порядок изменений."],
              ["Работы и отчёты", "Выполняем ремонт по этапам и присылаем фото- и видеоотчёты."],
              ["Приёмка и оплата", "Заказчик принимает этап по акту и после этого оплачивает его."],
            ].map(([title, text], index) => (
              <li key={title}>
                <span className="process-number" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3>{title}</h3>
                <p>{text}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="section control-grid">
          <article>
            <span className="line-icon">↳</span>
            <h3>Смета и договор</h3>
            <p>В документах перечисляются работы и условия; изменения согласуются отдельно.</p>
          </article>
          <article>
            <span className="line-icon">◫</span>
            <h3>Фото- и видеоотчёты</h3>
            <p>Присылаем заказчику фото- и видеоотчёты о ходе работ.</p>
          </article>
          <article>
            <span className="line-icon">✓</span>
            <h3>Приёмка по этапам</h3>
            <p>Заказчик оплачивает выполненный этап после приёмки и подписания акта.</p>
          </article>
          <article className="founder-card">
            <p>Обсудить объект можно напрямую с Евгением Свентием.</p>
            <strong>Евгений Свентий</strong>
            <span>Руководитель ZEN-ремонт</span>
            <TrackedLink href={company.telegram} event="telegram_click" placement="founder">
              Открыть чат с Евгением в Telegram →
            </TrackedLink>
          </article>
        </section>

        <section className="section calculator-section" id="calculator">
          <div className="section-heading calculator-heading">
            <p className="eyebrow">Предварительный расчёт</p>
            <h2>Узнайте стартовый ориентир для своего помещения</h2>
            <p>
              Выберите тип объекта и укажите площадь. Телефон вводить не нужно.
            </p>
          </div>
          <LeadCalculator />
        </section>

        <section className="section faq-grid" id="faq">
          <div>
            <p className="eyebrow">До договора</p>
            <h2>Коммерческий ремонт: стоимость, работы и контроль</h2>
          </div>
          <div>
            {faq.map((item) => (
              <details key={item.question}>
                <summary>{item.question}</summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="section final-cta">
          <p className="eyebrow eyebrow-light">Обсудить помещение</p>
          <h2>Отправьте Евгению площадь, планировку и описание задачи</h2>
          <p>
            Если есть дизайн-проект, фотографии текущего состояния или старая
            смета, приложите их к сообщению.
          </p>
          <div className="hero-actions">
            <TrackedLink href={company.whatsapp} event="whatsapp_click" placement="final" className="button button-light">
              Открыть чат в WhatsApp
            </TrackedLink>
            <TrackedLink href={company.telegram} event="telegram_click" placement="final" className="button button-outline-light">
              Открыть чат в Telegram
            </TrackedLink>
          </div>
        </section>
      </main>
      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
    </>
  );
}
