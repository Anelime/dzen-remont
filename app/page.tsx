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
    "Капитальный ремонт квартир и коммерческих помещений в Санкт-Петербурге. Фиксированная смета, поэтапная приёмка, фотоотчёты. Стоимость от 28 000 ₽/м² для новостройки.",
  alternates: { canonical: siteUrl },
};

export default function Home() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: company.name,
    url: siteUrl,
    telephone: company.phone,
    founder: { "@type": "Person", name: company.leader },
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
              Ремонт под ключ — <em>с понятной сметой</em> и поэтапной приёмкой
            </h1>
            <p className="hero-copy">
              От демонтажа и инженерных работ до установки сантехники, света,
              мебели и техники. Стоимость работ — от 28 000 ₽/м² для новостройки
              и от 45 000 ₽/м² для старого фонда.
            </p>
            <div className="hero-actions">
              <a className="button" href="#calculator">
                Получить предварительный расчёт
              </a>
              <a className="button button-ghost" href="#projects">
                Посмотреть проекты
              </a>
            </div>
            <p className="microcopy">
              Укажите тип объекта, площадь и наличие дизайн-проекта — ориентир
              появится сразу, без передачи телефона.
            </p>
          </div>
          <figure className="hero-visual">
            <Image
              src="https://static.tildacdn.com/tild3765-3735-4439-b837-353165616233/_WhatsApp_2023-10-15.jpg"
              alt="Интерьер квартиры в старом фонде после ремонта"
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
          <div><strong>После акта</strong><span>оплата каждого этапа</span></div>
          <div><strong>2–3 объекта</strong><span>одновременно, по данным компании</span></div>
        </section>

        <section className="section" id="services">
          <div className="section-heading section-heading-row">
            <div>
              <p className="eyebrow">Выберите свой сценарий</p>
              <h2>Разные объекты — разные риски и состав работ</h2>
            </div>
            <p>
              Не смешиваем новостройку, старый фонд и коммерцию в одну
              усреднённую смету.
            </p>
          </div>
          <div className="service-grid">
            {services.map((service, index) => (
              <Link className="service-card" href={`/${service.slug}`} key={service.slug}>
                <span className="card-index">0{index + 1}</span>
                <h3>{service.short}</h3>
                <p>{service.description}</p>
                <strong>{service.priceLabel}</strong>
                <span className="card-link">Подробнее →</span>
              </Link>
            ))}
            <Link className="service-card service-card-accent" href="/zavershit-remont-posle-podryadchika">
              <span className="card-index">05</span>
              <h3>Завершить чужой ремонт</h3>
              <p>Осмотр, оценка выполненного и план безопасного завершения объекта.</p>
              <strong>Сначала осмотр</strong>
              <span className="card-link">Оценить ситуацию →</span>
            </Link>
          </div>
        </section>

        <section className="section dark-section" id="projects">
          <div className="section-heading section-heading-row">
            <div>
              <p className="eyebrow eyebrow-light">Реальные объекты</p>
              <h2>Не обещания, а состав работ</h2>
            </div>
            <p>
              Показываем площадь, задачу и то, что было выполнено. Срок указываем
              только там, где он опубликован в исходном портфолио.
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
                    <Link href="/projects/neva-haus">Открыть кейс →</Link>
                  ) : (
                    <a href="#calculator">Рассчитать похожий объект →</a>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section pricing-section">
          <div className="pricing-copy">
            <p className="eyebrow">Стоимость</p>
            <h2>Стартовая цена — ориентир, а не обещание вслепую</h2>
            <p>
              На итог влияют состояние объекта, инженерные решения, геометрия,
              материалы и полнота проекта. Поэтому сначала даём ориентир, затем
              осматриваем объект и собираем подробную смету.
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
            <p className="eyebrow">Как проходит ремонт</p>
            <h2>Контроль встроен в процесс, а не оставлен на финал</h2>
          </div>
          <ol className="process-list">
            {[
              ["Знакомимся с объектом", "Получаем планировку или проект, уточняем задачу и договариваемся об осмотре."],
              ["Собираем смету", "Фиксируем состав работ, стоимость, последовательность и условия изменений."],
              ["Подписываем договор", "Цена и сроки закрепляются до начала соответствующих работ."],
              ["Работаем по этапам", "Присылаем фото- и видеоотчёты, показываем выполненные и скрытые работы."],
              ["Принимаете результат", "Каждый этап принимается по акту и только после этого оплачивается."],
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
            <p>Состав работ и условия фиксируются до старта, а изменения согласуются отдельно.</p>
          </article>
          <article>
            <span className="line-icon">◫</span>
            <h3>Фото- и видеоотчёты</h3>
            <p>Можно следить за этапами без постоянных поездок на объект.</p>
          </article>
          <article>
            <span className="line-icon">✓</span>
            <h3>Приёмка по этапам</h3>
            <p>Оплата следует после выполненного этапа и подписанного акта.</p>
          </article>
          <article className="founder-card">
            <p>«Лично отвечаю за качество ремонта на каждом объекте»</p>
            <strong>Евгений Свентий</strong>
            <span>Основатель и руководитель НЕВА-ремонт</span>
            <TrackedLink href={company.telegram} event="telegram_click" placement="founder">
              Написать Евгению →
            </TrackedLink>
          </article>
        </section>

        <section className="section calculator-section" id="calculator">
          <div className="section-heading calculator-heading">
            <p className="eyebrow">Предварительный расчёт</p>
            <h2>Узнайте нижний ориентир для своего объекта</h2>
            <p>
              Результат появится сразу. После этого можно отправить параметры
              Евгению и уточнить, что потребуется для сметы.
            </p>
          </div>
          <LeadCalculator />
        </section>

        <section className="section faq-grid" id="faq">
          <div>
            <p className="eyebrow">Частые вопросы</p>
            <h2>Что уточнить до подписания договора</h2>
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
          <p className="eyebrow eyebrow-light">Начать с конкретики</p>
          <h2>Пришлите планировку, площадь и пару слов о задаче</h2>
          <p>Евгений уточнит вводные и подскажет следующий шаг.</p>
          <div className="hero-actions">
            <TrackedLink href={company.whatsapp} event="whatsapp_click" placement="final" className="button button-light">
              Написать в WhatsApp
            </TrackedLink>
            <TrackedLink href={company.telegram} event="telegram_click" placement="final" className="button button-outline-light">
              Написать в Telegram
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
