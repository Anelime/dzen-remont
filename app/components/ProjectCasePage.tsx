import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import LeadCalculator from "./LeadCalculator";
import { Footer, Header } from "./SiteShell";
import { cases, company, type ProjectCase, siteUrl } from "../site-data";

export function projectMetadata(project: ProjectCase): Metadata {
  const canonical = `${siteUrl}${project.href}`;
  return {
    title: project.seoTitle,
    description: project.seoDescription,
    alternates: { canonical },
    openGraph: {
      type: "article",
      locale: "ru_RU",
      url: canonical,
      siteName: company.name,
      title: project.seoTitle,
      description: project.seoDescription,
      images: [
        {
          url: `${siteUrl}${project.image}`,
          alt: project.alt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: project.seoTitle,
      description: project.seoDescription,
      images: [`${siteUrl}${project.image}`],
    },
  };
}

export default function ProjectCasePage({ project }: { project: ProjectCase }) {
  const projectIndex = cases.findIndex((item) => item.id === project.id);
  const nextProject = cases[(projectIndex + 1) % cases.length];
  const canonical = `${siteUrl}${project.href}`;
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Главная",
            item: siteUrl,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Проекты",
            item: `${siteUrl}/projects`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: project.title,
            item: canonical,
          },
        ],
      },
      {
        "@type": "Article",
        headline: project.pageTitle,
        description: project.seoDescription,
        mainEntityOfPage: canonical,
        image: project.gallery.map((image) => `${siteUrl}${image.src}`),
        about: project.serviceLabel,
        publisher: {
          "@type": "Organization",
          name: company.name,
          legalName: company.legalName,
          url: siteUrl,
          telephone: company.phone,
          email: company.email,
        },
      },
    ],
  };

  return (
    <>
      <Header />
      <main>
        <nav className="section breadcrumbs" aria-label="Хлебные крошки">
          <ol>
            <li><Link href="/">Главная</Link></li>
            <li><Link href="/projects">Проекты</Link></li>
            <li aria-current="page">{project.title}</li>
          </ol>
        </nav>

        <section className="case-hero section">
          <div>
            <p className="eyebrow">{project.type} · выполненный проект</p>
            <h1>{project.pageTitle}</h1>
            <p className="hero-copy">{project.lead}</p>
            <div className="hero-actions">
              <a className="button" href="#calculator">
                Рассчитать похожий объект
              </a>
              <Link className="button button-ghost" href={`/${project.serviceSlug}`}>
                Что входит в такой ремонт
              </Link>
            </div>
          </div>
          <dl className="case-facts">
            {project.facts.map((fact) => (
              <div key={fact.label}>
                <dt>{fact.label}</dt>
                <dd>{fact.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="section case-gallery-section" aria-labelledby="gallery-title">
          <div className="section-heading compact-heading">
            <p className="eyebrow">Фото проекта</p>
            <h2 id="gallery-title">{project.galleryHeading}</h2>
          </div>
          <div className="project-gallery">
            {project.gallery.map((image) => (
              <figure
                className={image.featured ? "gallery-featured" : undefined}
                key={image.src}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={image.width}
                  height={image.height}
                  sizes={image.featured ? "(max-width: 760px) 100vw, 1280px" : "(max-width: 760px) 100vw, 50vw"}
                  unoptimized
                />
                <figcaption>{image.caption}</figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section className="section split-section case-works">
          <div>
            <p className="eyebrow">Состав работ</p>
            <h2>Что сделали на объекте</h2>
            <p>
              Показываем подтверждённый состав работ. Стоимость похожего объекта
              зависит от исходного состояния, инженерных решений и материалов.
            </p>
          </div>
          <ul className="clean-list">
            {project.works.map((work) => <li key={work}>{work}</li>)}
          </ul>
        </section>

        <section className="section case-next" aria-label="Следующий проект">
          <div>
            <p className="eyebrow">Следующий кейс</p>
            <h2>{nextProject.title}</h2>
            <p>{nextProject.stats} · {nextProject.summary}</p>
          </div>
          <Link className="button" href={nextProject.href}>
            Открыть следующий кейс
          </Link>
        </section>

        <section className="section" id="calculator">
          <div className="section-heading">
            <p className="eyebrow">{project.serviceLabel}</p>
            <h2>Получите предварительный ориентир по площади</h2>
            <p>
              Калькулятор покажет нижнюю границу. Смету составим после осмотра
              и согласования состава работ.
            </p>
          </div>
          <LeadCalculator compact initialServiceSlug={project.serviceSlug} />
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
