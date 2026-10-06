"use client";

import { useState, useEffect } from "react";
import { X, Sparkles, Paintbrush, Landmark, ArrowRight } from "lucide-react";
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
    <section className="relative overflow-hidden rounded-2xl border border-border/80 bg-gradient-to-r from-card/90 via-card/70 to-card/90 p-5 sm:p-6 transition-all duration-300 shadow-sm backdrop-blur-sm">
      {/* Decorative ambient background */}
      <div className="pointer-events-none absolute -top-24 -right-24 size-72 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 size-72 rounded-full bg-primary/5 blur-3xl" />

      {/* Dismiss Button */}
      <button
        onClick={handleDismiss}
        aria-label={t("dismiss")}
        className="absolute top-4 right-4 z-10 p-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
      >
        <X className="size-4" />
      </button>

      <div className="relative z-10 w-full space-y-3">
        {/* Badge */}
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
            <Sparkles className="size-3.5" />
            {t("introTag")}
          </span>
        </div>

        {/* Title */}
        <h2 className="font-display text-xl sm:text-2xl lg:text-3xl font-semibold tracking-tight text-foreground">
          {t("introHeading")}
        </h2>

        {/* Main description */}
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
          {t("introDescription")}
        </p>

        {/* Three pillars & About Us link */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-border/60">
          <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-xs sm:text-sm font-medium text-foreground/90">
            <div className="flex items-center gap-2">
              <Paintbrush className="size-4 text-primary" />
              <span>{t("artists")}</span>
            </div>
            <span className="text-muted-foreground/40">•</span>
            <div className="flex items-center gap-2">
              <Landmark className="size-4 text-primary" />
              <span>{t("galleries")}</span>
            </div>
            <span className="text-muted-foreground/40">•</span>
            <div className="flex items-center gap-2">
              <Sparkles className="size-4 text-primary" />
              <span>{t("collectors")}</span>
            </div>
          </div>

          <Link
            to={paths.aboutUs.getHref()}
            className="group text-xs sm:text-sm font-medium text-primary hover:text-primary/80 inline-flex items-center gap-1.5 transition-colors"
          >
            <span>{t("learnMore")}</span>
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
