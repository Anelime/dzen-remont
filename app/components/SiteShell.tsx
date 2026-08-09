import Image from "next/image";
import Link from "next/link";
import { company, services } from "../site-data";
import { AnalyticsSettingsLink, TrackedLink } from "./Analytics";

export function Header() {
  return (
    <header className="site-header">
      <Link className="brand" href="/" aria-label="Дзен Ремонт — на главную">
        <Image
          className="brand-mark"
          src="/brand/dzen-mark-512.png"
          alt=""
          width={42}
          height={42}
          priority
          unoptimized
        />
        <span className="brand-wordmark" aria-hidden="true">
          <strong>DZEN</strong>
          <small>REMONT</small>
        </span>
      </Link>
      <nav aria-label="Основная навигация">
        <Link href="/#services">Услуги</Link>
        <Link href="/projects">Проекты</Link>
        <Link href="/#process">Как работаем</Link>
        <Link href="/#faq">Вопросы</Link>
      </nav>
      <div className="header-actions">
        <TrackedLink
          href={company.phoneHref}
          event="click_phone"
          placement="header"
          className="header-phone"
        >
          {company.phone}
        </TrackedLink>
        <Link className="button button-small" href="/#calculator">
          К расчёту
        </Link>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="site-footer">
      <div>
        <Link className="brand brand-footer" href="/">
          <Image
            className="brand-mark"
            src="/brand/dzen-mark-512.png"
            alt=""
            width={48}
            height={48}
            unoptimized
          />
          <span className="brand-wordmark" aria-hidden="true">
            <strong>DZEN</strong>
            <small>REMONT</small>
          </span>
        </Link>
        <p>Ремонт коммерческих и жилых помещений в Санкт-Петербурге.</p>
      </div>
      <div>
        <h3>Услуги</h3>
        {services.map((service) => (
          <Link key={service.slug} href={`/${service.slug}`}>
            {service.short}
          </Link>
        ))}
        <Link href="/remont-po-dizayn-proektu-spb">Ремонт по дизайн-проекту</Link>
      </div>
      <div>
        <h3>Проекты</h3>
        <Link href="/projects">Все выполненные проекты</Link>
        <Link href="/projects/salon-karpovka">Салон на Карповке</Link>
        <Link href="/projects/chernaya-rechka">Квартира на Чёрной речке</Link>
        <Link href="/projects/neva-haus">Квартира в ЖК Neva Haus</Link>
      </div>
      <div>
        <h3>Связаться</h3>
        <a href={company.phoneHref}>{company.phone}</a>
        <a href={company.telegram}>Открыть чат в Telegram</a>
        <a href={company.whatsapp}>Открыть чат в WhatsApp</a>
      </div>
      <div>
        <h3>Документы</h3>
        <Link href="/privacy">Конфиденциальность и аналитика</Link>
        <AnalyticsSettingsLink />
        <p className="footnote">
          Цены на сайте указаны для ориентира и не являются публичной офертой.
        </p>
      </div>
    </footer>
  );
}
