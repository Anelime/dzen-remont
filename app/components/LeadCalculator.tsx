"use client";

import { useMemo, useState } from "react";
import { services } from "../site-data";
import { trackEvent } from "./Analytics";

export default function LeadCalculator({
  compact = false,
  initialServiceSlug = services[0].slug,
}: {
  compact?: boolean;
  initialServiceSlug?: string;
}) {
  const [serviceSlug, setServiceSlug] = useState(initialServiceSlug);
  const [area, setArea] = useState(70);
  const [project, setProject] = useState("Проект готов");

  const service = services.find((item) => item.slug === serviceSlug) ?? services[0];
  const estimate = useMemo(() => service.price * area, [service.price, area]);
  const formatter = new Intl.NumberFormat("ru-RU");

  function contact(channel: "whatsapp" | "telegram") {
    const message = `Здравствуйте! Хочу обсудить ремонт. Тип работ: ${service.title.toLowerCase()}. Площадь: ${area} м². Дизайн-проект: ${project.toLowerCase()}. Расчёт по стартовой цене на сайте: от ${formatter.format(estimate)} ₽.`;
    trackEvent("calculator_submit_success", {
      property_type: service.short,
      area_range: area,
      design_project_status: project,
      channel,
    });
    const href =
      channel === "whatsapp"
        ? `https://wa.me/79219510219?text=${encodeURIComponent(message)}`
        : "https://t.me/Yudzhin_sve";
    window.open(href, "_blank", "noopener,noreferrer");
  }

  return (
    <div className={`calculator ${compact ? "calculator-compact" : ""}`}>
      <div className="calculator-controls">
        <label>
          Тип ремонта
          <select
            value={serviceSlug}
            onChange={(event) => {
              setServiceSlug(event.target.value);
              trackEvent("segment_select", { property_type: event.target.value });
            }}
          >
            {services.map((item) => (
              <option key={item.slug} value={item.slug}>
                {item.title}
              </option>
            ))}
          </select>
        </label>
        <label>
          Площадь, м²
          <input
            type="number"
            min="20"
            max="600"
            value={area}
            onFocus={() => trackEvent("calculator_start")}
            onChange={(event) => setArea(Math.max(20, Number(event.target.value)))}
          />
        </label>
        <label>
          Статус дизайн-проекта
          <select value={project} onChange={(event) => setProject(event.target.value)}>
            <option>Проект готов</option>
            <option>Проект в работе</option>
            <option>Проекта нет</option>
          </select>
        </label>
      </div>
      <div className="estimate" aria-live="polite">
        <span>Расчёт по стартовой цене</span>
        <strong>от {formatter.format(estimate)} ₽</strong>
        <p>
          Калькулятор умножает площадь на начальную цену для выбранного ремонта.
          Смета зависит от состояния объекта, состава работ и проектных решений.
        </p>
      </div>
      <div className="calculator-actions">
        <button className="button" onClick={() => contact("whatsapp")}>
          Открыть расчёт в WhatsApp
        </button>
        <button className="button button-ghost" onClick={() => contact("telegram")}>
          Открыть чат в Telegram
        </button>
      </div>
      <p className="microcopy">
        WhatsApp откроется с готовым сообщением — проверьте его и нажмите
        «Отправить». В Telegram параметры нужно написать в чате.
      </p>
    </div>
  );
}
