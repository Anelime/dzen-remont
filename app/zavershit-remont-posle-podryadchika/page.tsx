import type { Metadata } from "next";
import Link from "next/link";
import { Footer, Header } from "../components/SiteShell";
import { company, siteUrl } from "../site-data";

export const metadata: Metadata = {
  title: "Завершить ремонт после другого подрядчика в СПб | ZEN-ремонт",
  description:
    "Обсудить завершение ремонта после другого подрядчика в Санкт-Петербурге: фотографии объекта, старая смета и осмотр перед новым расчётом.",
  alternates: { canonical: `${siteUrl}/zavershit-remont-posle-podryadchika` },
};

export default function Page() {
  return (
    <>
      <Header />
      <main>
        <section className="service-hero section">
          <div>
            <Link className="eyebrow back-link" href="/#services">
              ← Все направления
            </Link>
            <h1>Завершение ремонта после другого подрядчика в Санкт-Петербурге</h1>
            <p className="hero-copy">
              Если работы на вашем объекте остановились, пришлите фотографии и
              старую смету. После осмотра определим оставшийся объём и обсудим
              новый расчёт.
            </p>
            <div className="hero-actions">
              <a className="button" href={company.telegram}>
                Открыть чат с Евгением
              </a>
              <a className="button button-ghost" href={company.phoneHref}>
                Позвонить
              </a>
            </div>
            <p className="microcopy">
              В чате прикрепите фотографии объекта и напишите, на каком этапе
              остановились работы.
            </p>
          </div>
          <aside className="service-hero-card accent-card">
            <span>Выполненный проект</span>
            <strong>Салон на Полтавской улице</strong>
            <p>
              Завершили ремонт коммерческого помещения после предыдущего
              подрядчика.
            </p>
          </aside>
        </section>
        <section className="section split-section">
          <div>
            <p className="eyebrow">Перед разговором</p>
            <h2>Подготовьте материалы по незавершённому ремонту</h2>
          </div>
          <ul className="clean-list">
            <li>Планировку или дизайн-проект</li>
            <li>Фотографии и видео текущего состояния</li>
            <li>Старую смету, если она сохранилась</li>
            <li>Акты выполненных работ, если они есть</li>
          </ul>
        </section>
      </main>
      <Footer />
    </>
  );
}
