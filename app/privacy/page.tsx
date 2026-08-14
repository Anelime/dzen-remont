import type { Metadata } from "next";
import { AnalyticsSettingsLink } from "../components/Analytics";
import { Footer, Header } from "../components/SiteShell";
import { company, siteUrl } from "../site-data";

export const metadata: Metadata = {
  title: "Конфиденциальность и аналитика | Дзен Ремонт",
  alternates: { canonical: `${siteUrl}/privacy` },
  robots: { index: false, follow: true },
};

export default function Page() {
  return (
    <>
      <Header />
      <main className="legal-page section">
        <p className="eyebrow">Документы</p>
        <h1>Конфиденциальность и аналитика</h1>
        <h2>Что посетитель передаёт через сайт</h2>
        <p>
          На сайте нет формы, которая отправляет имя, телефон или адрес объекта.
          Вы можете самостоятельно открыть WhatsApp или Telegram и передать
          параметры ремонта в выбранном сервисе. Там действуют правила этого
          сервиса.
        </p>
        <h2>Как работает аналитика</h2>
        <p>
          Если на сайте подключены счётчики посещений и рекламы, они загружаются
          только после вашего согласия. Счётчики могут получать технические
          сведения о посещении и рекламные метки. Выбор сохраняется в вашем
          браузере.
        </p>
        <AnalyticsSettingsLink />
        <h2>Контакты исполнителя</h2>
        <p>{company.legalName}</p>
        <p>
          По вопросам ремонта и заявкам позвоните по номеру{" "}
          <a href={company.phoneHref}>{company.phone}</a>, напишите на почту{" "}
          <a href={company.emailHref}>{company.email}</a> или откройте{" "}
          <a href={company.telegram}>Telegram</a>.
        </p>
      </main>
      <Footer />
    </>
  );
}
