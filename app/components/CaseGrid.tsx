import Image from "next/image";
import Link from "next/link";
import { cases } from "../site-data";

export default function CaseGrid() {
  return (
    <div className="case-grid">
      {cases.map((item) => (
        <article className="case-card" key={item.id}>
          <Link
            className="case-card-link"
            href={item.href}
            aria-label={`Открыть кейс: ${item.title}`}
          >
            <div className="case-image-wrap">
              <Image
                src={item.image}
                alt={item.alt}
                width={900}
                height={675}
                sizes="(max-width: 760px) 100vw, (max-width: 1050px) 50vw, 33vw"
                loading="lazy"
                unoptimized
              />
              <span>{item.type}</span>
            </div>
            <div className="case-copy">
              <p>{item.stats}</p>
              <h3>{item.title}</h3>
              <p>{item.summary}</p>
              <span className="case-open">Открыть кейс →</span>
            </div>
          </Link>
        </article>
      ))}
    </div>
  );
}
