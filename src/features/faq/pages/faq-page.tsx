"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  CalendarDays,
  ChevronDown,
  Compass,
  HelpCircle,
  Mail,
  Package,
  Paintbrush,
  ShieldCheck,
  ShoppingBag,
} from "lucide-react";
import { cn } from "@/lib/utils";
import BackButton from "@/components/common/back-button";

interface FAQItem {
  id: string;
  category:
    | "general"
    | "accountArtwork"
    | "buyingSelling"
    | "shippingReturns"
    | "eventsCommunity"
    | "privacySupport";
  question: string;
  answer: string;
}

const FAQPage = () => {
  const t = useTranslations("FAQ");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({
    "1": true, // First question open by default for immediate preview
  });

  const categories = [
    { key: "all", label: t("categories.all"), icon: HelpCircle },
    { key: "general", label: t("categories.general"), icon: Compass },
    { key: "accountArtwork", label: t("categories.accountArtwork"), icon: Paintbrush },
    { key: "buyingSelling", label: t("categories.buyingSelling"), icon: ShoppingBag },
    { key: "shippingReturns", label: t("categories.shippingReturns"), icon: Package },
    { key: "eventsCommunity", label: t("categories.eventsCommunity"), icon: CalendarDays },
    { key: "privacySupport", label: t("categories.privacySupport"), icon: ShieldCheck },
  ];

  const rawItems = (t.raw("items") as FAQItem[]) || [];

  const toggleItem = (id: string) => {
    setOpenItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const filteredItems =
    activeCategory === "all"
      ? rawItems
      : rawItems.filter((item) => item.category === activeCategory);

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-8 sm:py-12 md:py-16 flex flex-col gap-10 md:gap-14">
      <BackButton />

      {/* Hero Section */}
      <header className="space-y-6 text-center md:text-left">
        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-primary leading-[1.1]">
          {t("title")}
        </h1>
        <div className="h-[2px] w-20 bg-primary mx-auto md:mx-0" />
        <p className="text-lg sm:text-xl text-muted-foreground font-sans leading-relaxed">
          {t("subtitle")}
        </p>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-2">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = activeCategory === cat.key;
            return (
              <button
                key={cat.key}
                type="button"
                onClick={() => setActiveCategory(cat.key)}
                className={cn(
                  "inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer border",
                  isSelected
                    ? "bg-primary text-primary-foreground border-primary shadow-xs"
                    : "bg-card text-muted-foreground border-border hover:border-primary/45 hover:text-foreground"
                )}
              >
                <Icon className="size-3.5" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* FAQ Items List */}
      <div className="space-y-4 font-sans">
        {filteredItems.map((item) => {
          const isOpen = Boolean(openItems[item.id]);

          return (
            <div
              key={item.id}
              className={cn(
                "rounded-sm border bg-card transition-all duration-200",
                isOpen
                  ? "border-primary/45 shadow-xs"
                  : "border-border hover:border-primary/30"
              )}
            >
              <button
                type="button"
                onClick={() => toggleItem(item.id)}
                aria-expanded={isOpen}
                className="w-full p-5 sm:p-6 flex items-center justify-between gap-4 text-left cursor-pointer group"
              >
                <span className="font-display text-base sm:text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                  {item.question}
                </span>
                <span
                  className={cn(
                    "shrink-0 rounded-full p-1.5 bg-muted/60 text-muted-foreground group-hover:text-primary transition-transform duration-200",
                    isOpen && "rotate-180 bg-primary/10 text-primary"
                  )}
                >
                  <ChevronDown className="size-4" />
                </span>
              </button>

              {isOpen && (
                <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-1 text-sm sm:text-base text-muted-foreground leading-relaxed border-t border-border/40">
                  <p className="whitespace-pre-line">{item.answer}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Still Have Questions CTA */}
      <section className="rounded-sm border border-border bg-card p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 hover:border-primary/45 transition-all duration-300">
        <div className="space-y-1.5 text-center sm:text-left">
          <h2 className="font-display text-lg sm:text-xl font-semibold text-foreground">
            {t("stillHaveQuestions")}
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-md leading-relaxed">
            {t("contactSupportText")}
          </p>
        </div>
        <a
          href="mailto:support@myanmarartspace.net"
          className="inline-flex items-center justify-center rounded-3xl bg-primary text-primary-foreground px-5 py-2.5 text-sm font-semibold hover:bg-primary/90 transition-colors whitespace-nowrap shadow-xs"
        >
          <Mail className="size-4 mr-2" />
          {t("contactSupportButton")}
        </a>
      </section>
    </div>
  );
};

export default FAQPage;
