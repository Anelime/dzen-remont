"use client";

import { useEffect, useState } from "react";

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
    ym?: ((id: number, method: string, ...args: unknown[]) => void) & {
      a?: unknown[][];
      l?: number;
    };
  }
}

export function trackEvent(
  event: string,
  data: Record<string, unknown> = {},
) {
  if (typeof window === "undefined") return;
  const query = new URLSearchParams(window.location.search);
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({
    event,
    page_path: window.location.pathname,
    utm_source: query.get("utm_source") ?? undefined,
    utm_medium: query.get("utm_medium") ?? undefined,
    utm_campaign: query.get("utm_campaign") ?? undefined,
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
    const consent = window.localStorage.getItem("neva_analytics_consent");
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
        "neva-gtm",
      );
    }
    if (ymId) {
      window.ym = window.ym ?? function (...args: unknown[]) {
        window.ym!.a = window.ym!.a ?? [];
        window.ym!.a!.push(args);
      };
      window.ym.l = Date.now();
      loadScript("https://mc.yandex.ru/metrika/tag.js", "neva-ym");
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
    window.localStorage.setItem("neva_analytics_consent", value);
    setVisible(false);
    if (value === "granted") enableAnalytics();
  }

  if (!visible) return null;
  return (
    <aside className="consent" aria-label="Настройки аналитики">
      <p>
        Мы используем аналитику, чтобы улучшать сайт и рекламу. Без согласия
        необязательные счётчики не загружаются.
      </p>
      <div className="consent-actions">
        <button className="button button-small" onClick={() => choose("granted")}>
          Разрешить
        </button>
        <button className="text-button" onClick={() => choose("denied")}>
          Только необходимое
        </button>
      </div>
    </aside>
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
