import type { Metadata } from "next";
import Link from "next/link";
import LeadCalculator from "../components/LeadCalculator";
import { Footer, Header } from "../components/SiteShell";
import { company, siteUrl } from "../site-data";

export const metadata: Metadata = {
  title: "Ремонт помещения по дизайн-проекту в СПб | Дзен Ремонт",
  description:
    "Ремонт коммерческого или жилого помещения по дизайн-проекту в Санкт-Петербурге. Пришлите чертежи для обсуждения состава работ и предварительного расчёта.",
  alternates: { canonical: `${siteUrl}/remont-po-dizayn-proektu-spb` },
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
            <h1>Ремонт помещения по дизайн-проекту в Санкт-Петербурге</h1>
            <p className="hero-copy">
              Для предварительного расчёта пришлите дизайн-проект или комплект
              чертежей. После осмотра определим состав работ и подготовим смету.
            </p>
            <div className="hero-actions">
              <a className="button" href={company.telegram}>
                Открыть чат в Telegram
              </a>
              <a className="button button-ghost" href="#calculator">
                Перейти к расчёту
              </a>
            </div>
            <p className="microcopy">Дизайн-проект нужно прикрепить и отправить в чате.</p>
          </div>
          <aside className="service-hero-card">
            <span>Для расчёта</span>
            <strong>Проект → осмотр → состав работ → смета</strong>
            <p>
              В чате можно заранее отправить проект и коротко описать задачу.
            </p>
          </aside>
        </section>
        <section className="section split-section">
          <div>
            <p className="eyebrow">Дизайн проекта</p>
            <h2>Можно прийти с готовым проектом или выбрать дизайнера</h2>
          </div>
          <div className="design-paths">
            <article>
              <h3>Если проект уже готов</h3>
              <p>
                Изучим чертежи, осмотрим помещение и подготовим смету по
                согласованному составу работ.
              </p>
            </article>
            <article>
              <h3>Если дизайнера ещё нет</h3>
              <p>
                Евгений предложит несколько партнёрских дизайнеров на выбор.
              </p>
            </article>
          </div>
        </section>
        <section className="section" id="calculator">
          <div className="section-heading">
            <p className="eyebrow">Расчёт</p>
            <h2>Выберите вид ремонта и укажите площадь</h2>
          </div>
          <LeadCalculator compact />
        </section>
      </main>
      <Footer />
    </>
  );
}
