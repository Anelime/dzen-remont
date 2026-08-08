import Link from "next/link";
import { company, services } from "../site-data";
import { AnalyticsSettingsLink, TrackedLink } from "./Analytics";

export function Header() {
  return (
    <header className="site-header">
      <Link className="brand" href="/" aria-label="НЕВА-ремонт — на главную">
        <span>NEVA</span>
        <span>РЕМОНТ</span>
      </Link>
      <nav aria-label="Основная навигация">
        <Link href="/#services">Услуги</Link>
        <Link href="/#projects">Проекты</Link>
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
          <span>NEVA</span>
          <span>РЕМОНТ</span>
        </Link>
        <p>Ремонт жилых и коммерческих помещений в Санкт-Петербурге.</p>
      </div>
      <div>
        <h3>Услуги</h3>
        {services.map((service) => (
          <Link key={service.slug} href={`/${service.slug}`}>
            {service.short}
          </Link>
        ))}
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
