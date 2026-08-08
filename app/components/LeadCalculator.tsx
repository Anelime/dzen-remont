"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { services } from "../site-data";
import { trackEvent } from "./Analytics";

const formatter = new Intl.NumberFormat("ru-RU", {
  maximumFractionDigits: 1,
});

const stepKeys = ["service", "area"] as const;
const nextButtonLabels = ["Указать площадь", "Показать ориентир"];
const resultStep = 2;
const quickAreas = [45, 70, 100, 150];
const maxTechnicalArea = 1_000_000;
const serviceSummaryLabels: Record<string, string> = {
  "remont-kvartir-v-novostroyke-spb": "Квартира в новостройке",
  "remont-starogo-fonda-spb": "Квартира в старом фонде",
  "remont-kommercheskih-pomeshcheniy-spb": "Коммерческое помещение",
  "kosmeticheskiy-remont-spb": "Косметический ремонт",
};
const serviceQuizDescriptions: Record<string, string> = {
  "remont-kvartir-v-novostroyke-spb": "Инженерия, подготовка и чистовая отделка",
  "remont-starogo-fonda-spb": "Осмотр конструкций, демонтаж и восстановление",
  "remont-kommercheskih-pomeshcheniy-spb": "Перегородки, инженерные системы и отделка",
  "kosmeticheskiy-remont-spb": "Обновление отделки без полной замены инженерии",
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
  initialServiceSlug = "",
}: {
  compact?: boolean;
  initialServiceSlug?: string;
}) {
  const quizId = useId();
  const [step, setStep] = useState(0);
  const [serviceSlug, setServiceSlug] = useState(initialServiceSlug);
  const [areaInput, setAreaInput] = useState("");
  const [serviceError, setServiceError] = useState("");
  const [areaError, setAreaError] = useState("");
  const stepHeadingRef = useRef<HTMLLegendElement>(null);
  const areaInputRef = useRef<HTMLInputElement>(null);
  const hasNavigatedRef = useRef(false);
  const hasStartedRef = useRef(false);

  const service = services.find((item) => item.slug === serviceSlug);
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
    () => (area && service ? service.price * area : null),
    [area, service],
  );

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

    if (step === 0 && !service) {
      setServiceError("Выберите вид ремонта — от него зависит стартовая цена.");
      window.requestAnimationFrame(() => stepHeadingRef.current?.focus());
      return;
    }

    if (!service) return;

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
    });

    if (step === 1 && area) {
      trackEvent("calculator_result_view", {
        service_slug: service.slug,
        area_bucket: getAreaBucket(area),
      });
    }

    moveToStep(Math.min(step + 1, resultStep));
  }

  function goBack() {
    if (step === 0) return;
    moveToStep(step - 1);
  }

  function contact(channel: "whatsapp" | "telegram") {
    if (!area || !service) return;

    const message = `Здравствуйте! Хочу обсудить ремонт. Тип работ: ${service.title.toLowerCase()}. Площадь: ${formatter.format(area)} м². Предварительный ориентир по стартовой цене: от ${formatter.format(estimate ?? 0)} ₽.`;

    trackEvent("messenger_click", {
      service_slug: service.slug,
      area_bucket: getAreaBucket(area),
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
        if (step < resultStep) completeStep();
      }}
      noValidate
    >
      <header className="quiz-header">
        <div className="quiz-header-copy">
          <span>Предварительный расчёт</span>
          <strong>{step === resultStep ? "Ориентир готов" : `Шаг ${step + 1} из 2`}</strong>
        </div>
        <div
          className="quiz-progress"
          role="progressbar"
          aria-label="Прогресс расчёта"
          aria-valuemin={1}
          aria-valuemax={2}
          aria-valuenow={Math.min(step + 1, 2)}
          aria-valuetext={step === resultStep ? "Ориентир готов" : `Шаг ${step + 1} из 2`}
        >
          <span style={{ width: `${Math.min((step + 1) / 2, 1) * 100}%` }} />
        </div>
      </header>

      <div className="quiz-layout">
        <div className="quiz-main">
          {step === 0 && (
            <fieldset className="quiz-panel">
              <legend ref={stepHeadingRef} tabIndex={-1}>
                Что нужно отремонтировать?
              </legend>
              <p className="quiz-lead">
                Выберите вид объекта — от него зависит стартовая цена за м².
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
                        setServiceError("");
                      }}
                    />
                    <span className="quiz-option-copy">
                      <strong>{serviceSummaryLabels[item.slug] ?? item.title}</strong>
                      <small>
                        {serviceQuizDescriptions[item.slug]} · {item.priceLabel}
                      </small>
                    </span>
                  </label>
                ))}
              </div>
              {serviceError && (
                <p className="quiz-error" role="alert">
                  {serviceError}
                </p>
              )}
            </fieldset>
          )}

          {step === 1 && service && (
            <fieldset className="quiz-panel">
              <legend ref={stepHeadingRef} tabIndex={-1}>
                Укажите площадь
              </legend>
              <p className="quiz-lead" id={`${quizId}-area-hint`}>
                Возьмите площадь из плана квартиры или помещения.
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
              <p className="quiz-formula-hint">
                Расчёт = площадь × стартовая цена. Результат покажем после
                нажатия.
              </p>
            </fieldset>
          )}

          {step === resultStep && area && service && (
            <fieldset className="quiz-panel quiz-result">
              <legend ref={stepHeadingRef} tabIndex={-1}>
                Предварительный ориентир готов
              </legend>
              <p className="quiz-lead">
                Мы умножили площадь на стартовую цену выбранного вида ремонта.
              </p>
              <output className="quiz-result-price" aria-live="polite">
                <span>Предварительный ориентир</span>
                <strong>от {formatter.format(estimate ?? 0)} ₽</strong>
                <small>
                  {formatter.format(area)} м² × {formatter.format(service.price)} ₽/м²
                </small>
              </output>
              <p className="quiz-result-note">
                Это не смета. После осмотра уточним состояние объекта, состав
                работ и проектные решения.
              </p>
              <div className="quiz-contact-actions">
                <button className="button" type="button" onClick={() => contact("whatsapp")}>
                  Открыть готовое сообщение в WhatsApp
                </button>
                <button
                  className="button button-ghost"
                  type="button"
                  onClick={() => contact("telegram")}
                >
                  Скопировать текст и открыть Telegram
                </button>
              </div>
              <p className="quiz-contact-note">
                Сообщение отправляете вы сами. Если есть планировка или
                дизайн-проект, приложите его в мессенджере.
              </p>
            </fieldset>
          )}
        </div>

        <aside className="quiz-summary" aria-label="Подсказка к расчёту">
          {step === 0 && (
            <>
              <span className="quiz-summary-kicker">Что влияет на смету</span>
              <p className="quiz-summary-title">Цена за метр — только начало расчёта</p>
              <ul className="quiz-factors">
                <li>состояние помещения и демонтаж</li>
                <li>электрика, сантехника и вентиляция</li>
                <li>чертежи и выбранные решения</li>
              </ul>
              <small>
                Сейчас выберите вид ремонта. На следующем шаге добавим площадь и
                покажем предварительный ориентир.
              </small>
            </>
          )}

          {step === 1 && service && (
            <>
              <span className="quiz-summary-kicker">Вы выбрали</span>
              <dl>
                <div>
                  <dt>Вид ремонта</dt>
                  <dd>{serviceSummaryLabels[service.slug] ?? service.title}</dd>
                </div>
                <div>
                  <dt>Стартовая цена</dt>
                  <dd>{service.priceLabel}</dd>
                </div>
                <div>
                  <dt>Площадь</dt>
                  <dd>{area ? `${formatter.format(area)} м²` : "Укажите слева"}</dd>
                </div>
              </dl>
              <small>
                Общую сумму покажем после нажатия «Показать ориентир» — без
                телефона и отправки формы.
              </small>
            </>
          )}

          {step === resultStep && service && (
            <>
              <span className="quiz-summary-kicker">Что дальше</span>
              <p className="quiz-summary-title">Три шага до точной сметы</p>
              <ol className="quiz-next-steps">
                <li>
                  <strong>Отправьте планировку или фото</strong>
                  <small>Если есть дизайн-проект, приложите его к сообщению.</small>
                </li>
                <li>
                  <strong>Договоримся об осмотре</strong>
                  <small>На объекте уточним состояние и состав работ.</small>
                </li>
                <li>
                  <strong>Подготовим смету</strong>
                  <small>В ней будут работы, стоимость и последовательность.</small>
                </li>
              </ol>
            </>
          )}
        </aside>
      </div>

      <footer className="quiz-footer">
        {step > 0 && step < resultStep && (
          <button className="quiz-back" type="button" onClick={goBack}>
            Назад
          </button>
        )}
        {step === resultStep ? (
          <button
            className="quiz-back"
            type="button"
            onClick={() => {
              if (service && area) {
                trackEvent("quiz_edit_parameters", {
                  service_slug: service.slug,
                  area_bucket: getAreaBucket(area),
                });
              }
              moveToStep(0);
            }}
          >
            Изменить параметры
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
