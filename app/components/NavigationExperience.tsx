"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function NavigationExperience({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  const [announcement, setAnnouncement] = useState("");

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const heading = document.querySelector("h1")?.textContent?.trim();
      setAnnouncement(
        heading ? `Открыта страница: ${heading}` : "Открыта новая страница",
      );
    });

    return () => window.cancelAnimationFrame(frame);
  }, [pathname]);

  useEffect(() => {
    function scrollToSection(event: MouseEvent) {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        !(event.target instanceof Element)
      ) {
        return;
      }

      const link = event.target.closest<HTMLAnchorElement>('a[href^="#"]');
      const href = link?.getAttribute("href");
      if (!link || !href || href === "#" || link.target) return;

      const target = document.getElementById(decodeURIComponent(href.slice(1)));
      if (!target) return;

      event.preventDefault();
      window.history.pushState(null, "", href);
      target.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
        block: "start",
      });
    }

    document.addEventListener("click", scrollToSection);
    return () => document.removeEventListener("click", scrollToSection);
  }, [pathname]);

  return (
    <>
      <div className="route-progress" key={`progress-${pathname}`} aria-hidden="true" />
      <div className="route-stage" key={pathname}>
        {children}
      </div>
      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {announcement}
      </p>
    </>
  );
}
