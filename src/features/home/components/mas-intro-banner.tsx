"use client";

import { useState, useEffect } from "react";
import { X, Sparkles, Paintbrush, Landmark } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "@/components/common/link";
import { paths } from "@/config/paths";

const STORAGE_KEY = "mas_intro_dismissed";

export function MasIntroBanner() {
  const t = useTranslations("Home");
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setMounted(true);
    const isDismissed = localStorage.getItem(STORAGE_KEY) === "true";
    if (!isDismissed) {
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem(STORAGE_KEY, "true");
  };

  // Prevent hydration mismatch by only rendering after client mount
  if (!mounted || !isVisible) {
    return null;
  }

  return (
    <section className="relative overflow-hidden rounded-xl border border-border/80 bg-card/60 p-4 sm:p-5 transition-all duration-300">
      {/* Decorative ambient background */}
      <div className="pointer-events-none absolute -top-24 -right-24 size-64 rounded-full bg-primary/5 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 size-64 rounded-full bg-primary/5 blur-3xl" />

      {/* Dismiss Button */}
      <button
        onClick={handleDismiss}
        aria-label={t("dismiss")}
        className="absolute top-3 right-3 z-10 p-1 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-colors"
      >
        <X className="size-4" />
      </button>

      <div className="relative z-10 max-w-4xl space-y-2.5 pr-6 md:pr-0">
        {/* Badge */}
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
            <Sparkles className="size-3" />
            {t("introTag")}
          </span>
        </div>

        {/* Title */}
        <h2 className="font-display text-xl sm:text-2xl font-semibold tracking-tight text-foreground">
          {t("introHeading")}
        </h2>

        {/* Main description */}
        <p className="text-sm text-muted-foreground leading-relaxed">
          {t("introDescription")}
        </p>

        {/* Three pillars & About Us link */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-border/40">
          <div className="flex flex-wrap items-center gap-3 sm:gap-5 text-xs sm:text-sm font-medium text-foreground/90">
            <div className="flex items-center gap-1.5">
              <Paintbrush className="size-4 text-primary" />
              <span>{t("artists")}</span>
            </div>
            <span className="text-muted-foreground/50">•</span>
            <div className="flex items-center gap-1.5">
              <Landmark className="size-4 text-primary" />
              <span>{t("galleries")}</span>
            </div>
            <span className="text-muted-foreground/50">•</span>
            <div className="flex items-center gap-1.5">
              <Sparkles className="size-4 text-primary" />
              <span>{t("collectors")}</span>
            </div>
          </div>

          <Link
            to={paths.aboutUs.getHref()}
            className="text-xs sm:text-sm font-medium text-primary hover:underline inline-flex items-center gap-1"
          >
            {t("learnMore")} &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
}
