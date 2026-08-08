"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { services } from "../site-data";
import { trackEvent } from "./Analytics";

const formatter = new Intl.NumberFormat("ru-RU", {
  maximumFractionDigits: 1,
});

const projectOptions = [
  {
    value: "ready",
    label: "Проект готов",
    description: "Есть комплект чертежей и проектных решений",
  },
  {
    value: "in_progress",
    label: "Проект в работе",
    description: "Часть решений ещё готовится",
  },
  {
    value: "none",
    label: "Проекта нет",
    description: "Нужен ориентир без готового проекта",
  },
  {
    value: "unknown",
    label: "Пока не знаю",
    description: "Статус можно уточнить позже",
  },
] as const;

type ProjectStatus = (typeof projectOptions)[number]["value"] | "";

const stepKeys = ["service", "area", "design_project"] as const;
const nextButtonLabels = [
  "Указать площадь",
  "Указать статус проекта",
  "Показать расчёт",
];
const quickAreas = [45, 70, 100, 150];
const maxTechnicalArea = 1_000_000;
const serviceSummaryLabels: Record<string, string> = {
  "remont-kvartir-v-novostroyke-spb": "Квартира в новостройке",
  "remont-starogo-fonda-spb": "Квартира в старом фонде",
  "remont-kommercheskih-pomeshcheniy-spb": "Коммерческое помещение",
  "kosmeticheskiy-remont-spb": "Косметический ремонт",
};

function getAreaBucket(area: number) {
  if (area < 50) return "under_50";
  if (area < 80) return "50_79";
  if (area < 120) return "80_119";
  return "120_plus";
}

function analyticsAllowed() {
  try {
    return window.localStorage.getItem("neva_analytics_consent") === "granted";
  } catch {
    return false;
  }
}

function copyText(value: string) {
  if (navigator.clipboard?.writeText) {
    void navigator.clipboard.writeText(value).catch(() => copyTextFallback(value));
    return;
  }
  copyTextFallback(value);
}

function copyTextFallback(value: string) {
  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  textarea.remove();
}

export default function LeadCalculator({
  compact = false,
  initialServiceSlug = services[0].slug,
}: {
  compact?: boolean;
  initialServiceSlug?: string;
}) {
  const quizId = useId();
  const [step, setStep] = useState(0);
  const [serviceSlug, setServiceSlug] = useState(initialServiceSlug);
  const [areaInput, setAreaInput] = useState("");
  const [project, setProject] = useState<ProjectStatus>("");
  const [areaError, setAreaError] = useState("");
  const stepHeadingRef = useRef<HTMLLegendElement>(null);
  const areaInputRef = useRef<HTMLInputElement>(null);
  const hasNavigatedRef = useRef(false);
  const hasStartedRef = useRef(false);

  const service = services.find((item) => item.slug === serviceSlug) ?? services[0];
  const normalizedAreaInput = areaInput.trim().replace(",", ".");
  const parsedArea = Number(normalizedAreaInput);
  const areaHasValidFormat = /^\d+(?:[.,]\d)?$/.test(areaInput.trim());
  const area =
    areaHasValidFormat &&
    Number.isFinite(parsedArea) &&
    parsedArea > 0 &&
    parsedArea <= maxTechnicalArea
      ? Math.round(parsedArea * 10) / 10
      : null;
  const estimate = useMemo(
    () => (area ? service.price * area : null),
    [area, service.price],
  );
  const projectOption = projectOptions.find((item) => item.value === project);

  useEffect(() => {
    if (hasNavigatedRef.current) stepHeadingRef.current?.focus();
  }, [step]);

  function startQuiz(entryStep: string) {
    if (hasStartedRef.current || !analyticsAllowed()) return;
    hasStartedRef.current = true;
    trackEvent("quiz_start", { entry_step: entryStep });
  }

  function moveToStep(nextStep: number) {
    hasNavigatedRef.current = true;
    setStep(nextStep);
  }

  function completeStep() {
    startQuiz(stepKeys[step] ?? "result");

    if (step === 1 && !area) {
      const error =
        Number.isFinite(parsedArea) && parsedArea > maxTechnicalArea
          ? "Проверьте площадь: число слишком большое для расчёта."
          : areaInput.trim() && Number.isFinite(parsedArea) && parsedArea > 0
            ? "Укажите площадь с точностью до 0,1 м²."
            : "Укажите площадь числом, например 70 или 70,5.";
      setAreaError(error);
      window.requestAnimationFrame(() => areaInputRef.current?.focus());
      return;
    }

    trackEvent("quiz_step_complete", {
      step_number: step + 1,
      step_name: stepKeys[step],
      service_slug: service.slug,
      ...(area ? { area_bucket: getAreaBucket(area) } : {}),
      ...(step >= 2 ? { design_project_status: project || "not_specified" } : {}),
    });

    if (step === 2 && area) {
      trackEvent("calculator_result_view", {
        service_slug: service.slug,
        area_bucket: getAreaBucket(area),
        design_project_status: project || "not_specified",
      });
    }

    moveToStep(Math.min(step + 1, 3));
  }

  function goBack() {
    if (step === 0) return;
    moveToStep(step - 1);
  }

  function contact(channel: "whatsapp" | "telegram") {
    if (!area) return;

    const message = `Здравствуйте! Хочу обсудить ремонт. Тип работ: ${service.title.toLowerCase()}. Площадь: ${formatter.format(area)} м². Дизайн-проект: ${projectOption?.label.toLowerCase() ?? "не указан"}. Предварительный ориентир по стартовой цене: от ${formatter.format(estimate ?? 0)} ₽.`;

    trackEvent("messenger_click", {
      service_slug: service.slug,
      area_bucket: getAreaBucket(area),
      design_project_status: project || "not_specified",
      channel,
      cta_placement: "calculator",
    });

    const href =
      channel === "whatsapp"
        ? `https://wa.me/79219510219?text=${encodeURIComponent(message)}`
        : "https://t.me/Yudzhin_sve";
    if (channel === "telegram") copyText(message);
    const opened = window.open(href, "_blank");
    if (opened) opened.opener = null;
    else window.location.assign(href);
  }

  return (
    <form
      className={`calculator quiz ${compact ? "calculator-compact" : ""}`}
      onSubmit={(event) => {
        event.preventDefault();
        if (step < 3) completeStep();
      }}
      noValidate
    >
      <header className="quiz-header">
        <div className="quiz-header-copy">
          <span>Предварительный расчёт</span>
          <strong>{step === 3 ? "Расчёт готов" : `Шаг ${step + 1} из 3`}</strong>
        </div>
        <div
          className="quiz-progress"
          role="progressbar"
          aria-label="Прогресс расчёта"
          aria-valuemin={1}
          aria-valuemax={3}
          aria-valuenow={Math.min(step + 1, 3)}
          aria-valuetext={step === 3 ? "Расчёт готов" : `Шаг ${step + 1} из 3`}
        >
          <span style={{ width: `${Math.min((step + 1) / 3, 1) * 100}%` }} />
        </div>
      </header>

      <div className="quiz-layout">
        <div className="quiz-main">
          {step === 0 && (
            <fieldset className="quiz-panel">
              <legend ref={stepHeadingRef} tabIndex={-1}>
                Какой ремонт нужно рассчитать?
              </legend>
              <p className="quiz-lead">
                Стартовая цена зависит от выбранного вида ремонта.
              </p>
              <div className="quiz-options quiz-service-options">
                {services.map((item) => (
                  <label
                    className={`quiz-option ${serviceSlug === item.slug ? "quiz-option-selected" : ""}`}
                    key={item.slug}
                  >
                    <input
                      type="radio"
                      name={`${quizId}-service`}
                      value={item.slug}
                      checked={serviceSlug === item.slug}
                      onChange={() => {
                        startQuiz("service");
                        setServiceSlug(item.slug);
                      }}
                    />
                    <span className="quiz-option-copy">
                      <strong>{item.title}</strong>
                      <small>Стартовая цена: {item.priceLabel}</small>
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>
          )}

          {step === 1 && (
            <fieldset className="quiz-panel">
              <legend ref={stepHeadingRef} tabIndex={-1}>
                Какая площадь объекта?
              </legend>
              <p className="quiz-lead" id={`${quizId}-area-hint`}>
                Укажите площадь по плану. Можно указать дробное число.
              </p>
              <label className="quiz-area-field" htmlFor={`${quizId}-area`}>
                <span>Площадь, м²</span>
                <span className="quiz-area-input-wrap">
                  <input
                    ref={areaInputRef}
                    id={`${quizId}-area`}
                    type="text"
                    inputMode="decimal"
                    autoComplete="off"
                    placeholder="Например, 70"
                    value={areaInput}
                    aria-invalid={Boolean(areaError)}
                    aria-describedby={`${quizId}-area-hint${areaError ? ` ${quizId}-area-error` : ""}`}
                    onChange={(event) => {
                      startQuiz("area");
                      setAreaInput(event.target.value);
                      if (areaError) setAreaError("");
                    }}
                  />
                  <b aria-hidden="true">м²</b>
                </span>
              </label>
              <div
                className="quiz-area-chips"
                role="group"
                aria-label="Быстрый выбор площади"
              >
                {quickAreas.map((value) => (
                  <button
                    type="button"
                    key={value}
                    className={area === value ? "is-active" : ""}
                    onClick={() => {
                      startQuiz("area");
                      setAreaInput(String(value));
                      setAreaError("");
                    }}
                  >
                    {value} м²
                  </button>
                ))}
              </div>
              {areaError && (
                <p className="quiz-error" id={`${quizId}-area-error`} role="alert">
                  {areaError}
                </p>
              )}
            </fieldset>
          )}

          {step === 2 && (
            <fieldset className="quiz-panel">
              <legend ref={stepHeadingRef} tabIndex={-1}>
                Есть ли дизайн-проект?
              </legend>
              <p className="quiz-lead">
                Можно пропустить: ответ не меняет расчёт. Для WhatsApp добавим
                его в готовое сообщение.
              </p>
              <div className="quiz-options quiz-project-options">
                {projectOptions.map((item) => (
                  <label
                    className={`quiz-option ${project === item.value ? "quiz-option-selected" : ""}`}
                    key={item.value}
                  >
                    <input
                      type="radio"
                      name={`${quizId}-project`}
                      value={item.value}
                      checked={project === item.value}
                      onChange={() => {
                        startQuiz("design_project");
                        setProject(item.value);
                      }}
                    />
                    <span className="quiz-option-copy">
                      <strong>{item.label}</strong>
                      <small>{item.description}</small>
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>
          )}

          {step === 3 && area && (
            <fieldset className="quiz-panel quiz-result">
              <legend ref={stepHeadingRef} tabIndex={-1}>
                Расчёт по стартовой цене
              </legend>
              <p className="quiz-lead">
                Калькулятор умножил площадь на стартовую цену выбранного вида
                ремонта.
              </p>
              <output className="quiz-result-price" aria-live="polite">
                <span>Предварительный ориентир</span>
                <strong>от {formatter.format(estimate ?? 0)} ₽</strong>
                <small>
                  {formatter.format(area)} м² × {formatter.format(service.price)} ₽/м²
                </small>
              </output>
              <p className="quiz-result-note">
                Это не смета. Итог зависит от состояния объекта, состава работ и
                проектных решений.
              </p>
              <div className="quiz-contact-actions">
                <button className="button" type="button" onClick={() => contact("whatsapp")}>
                  Открыть сообщение в WhatsApp
                </button>
                <button
                  className="button button-ghost"
                  type="button"
                  onClick={() => contact("telegram")}
                >
                  Скопировать расчёт и открыть Telegram
                </button>
              </div>
              <p className="quiz-contact-note">
                Откроем выбранный мессенджер. Сайт ничего не отправляет
                автоматически: сообщение в WhatsApp нужно проверить и отправить.
                Для Telegram попробуем скопировать текст расчёта в буфер обмена.
              </p>
            </fieldset>
          )}
        </div>

        <aside className="quiz-summary" aria-label="Выбранные параметры">
          <span className="quiz-summary-kicker">Ваши параметры</span>
          <dl>
            <div>
              <dt>Ремонт</dt>
              <dd>{serviceSummaryLabels[service.slug] ?? service.title}</dd>
            </div>
            <div>
              <dt>Площадь</dt>
              <dd>{area ? `${formatter.format(area)} м²` : "Не указана"}</dd>
            </div>
            <div>
              <dt>Проект</dt>
              <dd>{projectOption?.label ?? "Не выбран"}</dd>
            </div>
          </dl>
          <div className="quiz-summary-price">
            <span>Ориентир по стартовой цене</span>
            <strong>{estimate ? `от ${formatter.format(estimate)} ₽` : "—"}</strong>
          </div>
          <small>Для точной сметы нужен осмотр объекта.</small>
        </aside>
      </div>

      <footer className="quiz-footer">
        {step > 0 && step < 3 && (
          <button className="quiz-back" type="button" onClick={goBack}>
            Назад
          </button>
        )}
        {step === 3 ? (
          <button className="quiz-back" type="button" onClick={() => moveToStep(0)}>
            Изменить ответы
          </button>
        ) : (
          <button className="button quiz-next" type="submit">
            {nextButtonLabels[step]}
          </button>
        )}
      </footer>
    </form>
  );
}
