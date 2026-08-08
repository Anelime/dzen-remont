"use client";

import { useMemo, useState } from "react";
import { services } from "../site-data";
import { trackEvent } from "./Analytics";

export default function LeadCalculator({ compact = false }: { compact?: boolean }) {
  const [serviceSlug, setServiceSlug] = useState(services[0].slug);
  const [area, setArea] = useState(70);
  const [project, setProject] = useState("Готов");
  const [accepted, setAccepted] = useState(false);
  const [error, setError] = useState("");

  const service = services.find((item) => item.slug === serviceSlug) ?? services[0];
  const estimate = useMemo(() => service.price * area, [service.price, area]);
  const formatter = new Intl.NumberFormat("ru-RU");

  function contact(channel: "whatsapp" | "telegram") {
    if (!accepted) {
      setError("Подтвердите согласие на обработку данных.");
      trackEvent("form_validation_error", { field: "privacy_consent" });
      return;
    }
    setError("");
    const message = `Здравствуйте! Хочу уточнить расчёт ремонта. Объект: ${service.short}. Площадь: ${area} м². Дизайн-проект: ${project}. Ориентир на сайте: от ${formatter.format(estimate)} ₽.`;
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
          Тип объекта
          <select
            value={serviceSlug}
            onChange={(event) => {
              setServiceSlug(event.target.value);
              trackEvent("segment_select", { property_type: event.target.value });
            }}
          >
            {services.map((item) => (
              <option key={item.slug} value={item.slug}>
                {item.short}
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
          Дизайн-проект
          <select value={project} onChange={(event) => setProject(event.target.value)}>
            <option>Готов</option>
            <option>В процессе</option>
            <option>Нет</option>
          </select>
        </label>
      </div>
      <div className="estimate" aria-live="polite">
        <span>Предварительный ориентир работ</span>
        <strong>от {formatter.format(estimate)} ₽</strong>
        <p>
          Это не смета. Точная стоимость зависит от состояния объекта, состава
          работ и проектных решений.
        </p>
      </div>
      <label className="checkbox-row">
        <input
          type="checkbox"
          checked={accepted}
          onChange={(event) => setAccepted(event.target.checked)}
        />
        <span>
          Согласен с <a href="/privacy">политикой обработки данных</a>
        </span>
      </label>
      {error && <p className="form-error">{error}</p>}
      <div className="calculator-actions">
        <button className="button" onClick={() => contact("whatsapp")}>
          Уточнить в WhatsApp
        </button>
        <button className="button button-ghost" onClick={() => contact("telegram")}>
          Написать в Telegram
        </button>
      </div>
    </div>
  );
}

