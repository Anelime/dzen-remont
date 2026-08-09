"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
    ym?: ((id: number, method: string, ...args: unknown[]) => void) & {
      a?: unknown[][];
      l?: number;
    };
  }
}

const analyticsConfigured = Boolean(
  process.env.NEXT_PUBLIC_GTM_ID || process.env.NEXT_PUBLIC_YM_ID,
);

export function trackEvent(
  event: string,
  data: Record<string, unknown> = {},
) {
  if (typeof window === "undefined") return;
  try {
    if (window.localStorage.getItem("dzen_analytics_consent") !== "granted") return;
  } catch {
    return;
  }
  const query = new URLSearchParams(window.location.search);
  const campaignParam = (name: string) => {
    const value = query.get(name);
    if (!value) return undefined;
    return value.replace(/[^\p{L}\p{N}._-]/gu, "").slice(0, 100) || undefined;
  };
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({
    event,
    page_path: window.location.pathname,
    utm_source: campaignParam("utm_source"),
    utm_medium: campaignParam("utm_medium"),
    utm_campaign: campaignParam("utm_campaign"),
    ...data,
  });
  const ymId = Number(process.env.NEXT_PUBLIC_YM_ID);
  if (ymId && window.ym) window.ym(ymId, "reachGoal", event, data);
}

function loadScript(src: string, id: string) {
  if (document.getElementById(id)) return;
  const script = document.createElement("script");
  script.id = id;
  script.async = true;
  script.src = src;
  document.head.appendChild(script);
}

export function AnalyticsConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!analyticsConfigured) return;
    const consent = window.localStorage.getItem("dzen_analytics_consent");
    if (consent === "granted") enableAnalytics();
    if (!consent) window.setTimeout(() => setVisible(true), 0);

    let halfway = false;
    let almostDone = false;
    const onScroll = () => {
      const height = document.documentElement.scrollHeight - window.innerHeight;
      if (height <= 0) return;
      const progress = window.scrollY / height;
      if (progress >= 0.5 && !halfway) {
        halfway = true;
        trackEvent("scroll_50");
      }
      if (progress >= 0.9 && !almostDone) {
        almostDone = true;
        trackEvent("scroll_90");
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function enableAnalytics() {
    const gtmId = process.env.NEXT_PUBLIC_GTM_ID;
    const ymId = process.env.NEXT_PUBLIC_YM_ID;
    window.dataLayer = window.dataLayer ?? [];
    if (gtmId) {
      window.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
      loadScript(
        `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(gtmId)}`,
        "dzen-gtm",
      );
    }
    if (ymId) {
      window.ym = window.ym ?? function (...args: unknown[]) {
        window.ym!.a = window.ym!.a ?? [];
        window.ym!.a!.push(args);
      };
      window.ym.l = Date.now();
      loadScript("https://mc.yandex.ru/metrika/tag.js", "dzen-ym");
      window.ym(Number(ymId), "init", {
        clickmap: true,
        trackLinks: true,
        accurateTrackBounce: true,
        webvisor: false,
      });
    }
    trackEvent("analytics_consent_granted");
  }

  function choose(value: "granted" | "denied") {
    window.localStorage.setItem("dzen_analytics_consent", value);
    setVisible(false);
    if (value === "granted") enableAnalytics();
  }

  if (!analyticsConfigured || !visible) return null;
  return (
    <aside className="consent" aria-label="Настройки аналитики">
      <strong>Аналитика сайта</strong>
      <p>
        Подключаем аналитику только с вашего согласия. Она помогает понять,
        какие страницы открывают посетители и откуда они приходят. Подробнее —
        в разделе <Link href="/privacy">«Конфиденциальность и аналитика»</Link>.
      </p>
      <div className="consent-actions">
        <button className="button button-small" onClick={() => choose("granted")}>
          Разрешить аналитику
        </button>
        <button className="text-button" onClick={() => choose("denied")}>
          Продолжить без аналитики
        </button>
      </div>
    </aside>
  );
}

export function AnalyticsSettingsLink() {
  if (!analyticsConfigured) return null;

  function resetConsent() {
    window.localStorage.removeItem("dzen_analytics_consent");
    window.location.reload();
  }

  return (
    <button className="footer-settings" type="button" onClick={resetConsent}>
      Настроить аналитику
    </button>
  );
}

export function TrackedLink({
  href,
  event,
  placement,
  className,
  children,
}: {
  href: string;
  event: string;
  placement: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className={className}
      onClick={() => trackEvent(event, { cta_placement: placement })}
    >
      {children}
    </a>
  );
}
