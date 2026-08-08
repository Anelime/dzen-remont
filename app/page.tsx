import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import LeadCalculator from "./components/LeadCalculator";
import { TrackedLink } from "./components/Analytics";
import { Footer, Header } from "./components/SiteShell";
import { cases, company, faq, services, siteUrl } from "./site-data";

export const metadata: Metadata = {
  title: "Ремонт квартир под ключ в Санкт-Петербурге | НЕВА-ремонт",
  description:
    "Ремонт квартир и коммерческих помещений в Санкт-Петербурге. Расчёт по площади; цены для новостройки от 28 000 ₽/м² по данным компании.",
  alternates: { canonical: siteUrl },
};

export default function Home() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: company.name,
    url: siteUrl,
    telephone: company.phone,
    areaServed: { "@type": "City", name: "Санкт-Петербург" },
    knowsAbout: [
      "ремонт квартир",
      "ремонт в новостройке",
      "ремонт старого фонда",
      "ремонт коммерческих помещений",
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
            <p className="eyebrow">Санкт-Петербург · жилые и коммерческие объекты</p>
            <h1>
              Ремонт квартир под ключ <em>в Санкт-Петербурге</em>
            </h1>
            <p className="hero-copy">
              На текущем сайте компании указаны цены от 28 000 ₽/м² для
              новостройки и от 45 000 ₽/м² для старого фонда. Там же описан
              порядок: осмотр, смета, работы по этапам и оплата после акта.
            </p>
            <div className="hero-actions">
              <a className="button" href="#calculator">
                Рассчитать по площади
              </a>
              <a className="button button-ghost" href="#projects">
                Посмотреть выполненные работы
              </a>
            </div>
            <p className="microcopy">
              Калькулятор покажет нижний ориентир по типу объекта и площади.
              Телефон вводить не нужно.
            </p>
          </div>
          <figure className="hero-visual">
            <Image
              src="https://static.tildacdn.com/tild3765-3735-4439-b837-353165616233/_WhatsApp_2023-10-15.jpg"
              alt="Интерьер квартиры на Чёрной речке из портфолио компании"
              width="700"
              height="1245"
              fetchPriority="high"
              unoptimized
            />
            <figcaption>
              <span>Старый фонд · Чёрная речка</span>
              <strong>150 м²</strong>
            </figcaption>
          </figure>
        </section>

        <section className="proof-strip" aria-label="Факты о компании">
          <div><strong>С 2012 года</strong><span>по данным компании</span></div>
          <div><strong>70+ проектов</strong><span>по данным компании</span></div>
          <div><strong>После акта</strong><span>оплата этапа — по данным компании</span></div>
          <div><strong>2–3 объекта</strong><span>одновременно, по данным компании</span></div>
        </section>

        <section className="section" id="services">
          <div className="section-heading section-heading-row">
            <div>
              <p className="eyebrow">Услуги и цены</p>
              <h2>Для новостройки, старого фонда и коммерции нужен свой расчёт</h2>
            </div>
            <p>
              Начальная цена зависит от типа объекта. На странице услуги указаны
              состав работ, порядок расчёта и подходящий кейс.
            </p>
          </div>
          <div className="service-grid">
            {services.map((service, index) => (
              <Link className="service-card" href={`/${service.slug}`} key={service.slug}>
                <span className="card-index">0{index + 1}</span>
                <h3>{service.short}</h3>
                <p>{service.description}</p>
                <strong>{service.priceLabel}</strong>
                <span className="card-link">Что входит →</span>
              </Link>
            ))}
            <Link className="service-card service-card-accent" href="/zavershit-remont-posle-podryadchika">
              <span className="card-index">05</span>
              <h3>Завершить ремонт после подрядчика</h3>
              <p>Проверка выполненных работ, перечень оставшихся задач и новая смета.</p>
              <strong>Сначала осмотр</strong>
              <span className="card-link">Как проходит проверка →</span>
            </Link>
          </div>
        </section>

        <section className="section dark-section" id="projects">
          <div className="section-heading section-heading-row">
            <div>
              <p className="eyebrow eyebrow-light">Проекты компании</p>
              <h2>В кейсах — площадь, срок и выполненные работы</h2>
            </div>
            <p>
              Срок указан там, где он опубликован в портфолио компании. Для ЖК
              Neva Haus срок и итоговая стоимость пока не подтверждены.
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
            <p className="eyebrow">Опубликованные цены</p>
            <h2>На сайте компании указано от 15 000–45 000 ₽/м²</h2>
            <p>
              Цена зависит от состояния объекта, демонтажа, инженерных решений
              и комплекта чертежей. Калькулятор даёт нижний ориентир; смета
              появляется после осмотра и согласования состава работ.
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
            <p className="eyebrow">Как компания описывает процесс</p>
            <h2>Пять этапов: от осмотра до оплаты по акту</h2>
          </div>
          <ol className="process-list">
            {[
              ["Осмотр объекта", "Компания получает планировку или проект, уточняет задачу и осматривает помещение."],
              ["Смета", "В смете перечисляются работы, их стоимость и последовательность."],
              ["Договор", "До начала работ стороны согласуют цену, сроки и порядок изменений."],
              ["Работы и отчёты", "Компания выполняет ремонт по этапам и присылает фото- и видеоотчёты."],
              ["Приёмка и оплата", "Заказчик принимает этап по акту и после этого оплачивает его."],
            ].map(([title, text], index) => (
              <li key={title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div><h3>{title}</h3><p>{text}</p></div>
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
            <p>По данным компании, заказчик получает материалы о ходе работ.</p>
          </article>
          <article>
            <span className="line-icon">✓</span>
            <h3>Приёмка по этапам</h3>
            <p>Компания заявляет оплату выполненного этапа после подписания акта.</p>
          </article>
          <article className="founder-card">
            <p>Обсудить объект можно напрямую с руководителем компании.</p>
            <strong>Евгений Свентий</strong>
            <span>Руководитель НЕВА-ремонт — по данным сайта компании</span>
            <TrackedLink href={company.telegram} event="telegram_click" placement="founder">
              Открыть чат с Евгением в Telegram →
            </TrackedLink>
          </article>
        </section>

        <section className="section calculator-section" id="calculator">
          <div className="section-heading calculator-heading">
            <p className="eyebrow">Предварительный расчёт</p>
            <h2>Калькулятор покажет нижний ориентир по площади</h2>
            <p>
              Выберите тип объекта, площадь и состояние дизайн-проекта. Результат
              можно открыть в WhatsApp вместе с параметрами расчёта.
            </p>
          </div>
          <LeadCalculator />
        </section>

        <section className="section faq-grid" id="faq">
          <div>
            <p className="eyebrow">До договора</p>
            <h2>Стоимость, оплата и контроль объекта</h2>
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
          <p className="eyebrow eyebrow-light">Обсудить объект</p>
          <h2>Отправьте Евгению площадь, планировку и описание задачи</h2>
          <p>В мессенджере приложите планировку и коротко опишите задачу.</p>
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
