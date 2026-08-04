"use client";

import { useTranslations } from "next-intl";
import { Paintbrush, Landmark, Sparkles } from "lucide-react";

const AboutUsPage = () => {
  const t = useTranslations("AboutUs");

  const pillars = [
    {
      icon: Paintbrush,
      title: t("pillars.artistsTitle"),
      desc: t("pillars.artistsDesc"),
    },
    {
      icon: Landmark,
      title: t("pillars.galleriesTitle"),
      desc: t("pillars.galleriesDesc"),
    },
    {
      icon: Sparkles,
      title: t("pillars.collectorsTitle"),
      desc: t("pillars.collectorsDesc"),
    },
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-12 md:py-24 flex flex-col gap-16 md:gap-20">
      {/* Hero Section */}
      <header className="space-y-6 text-center md:text-left">
        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-primary leading-[1.1]">
          {t("title")}
        </h1>
        <div className="h-[2px] w-20 bg-primary mx-auto md:mx-0" />
        <p className="text-lg sm:text-xl text-muted-foreground font-sans leading-relaxed">
          {t("metaDescription")}
        </p>
      </header>

      {/* Main Content Layout */}
      <div className="space-y-16 sm:space-y-20 leading-relaxed font-sans text-foreground/90">
        {/* Section 1: Intro */}
        <section id="intro" className="space-y-4">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-primary">
            {t("introTitle")}
          </h2>
          <p className="text-base sm:text-lg leading-relaxed">
            {t("introContent")}
          </p>
        </section>

        {/* Section 2: Trilogy Space & Pillars Grid */}
        <section id="trilogy" className="space-y-6">
          <div className="space-y-4">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-primary">
              {t("trilogyTitle")}
            </h2>
            <p className="text-base sm:text-lg leading-relaxed">
              {t("trilogyContent")}
            </p>
          </div>

          {/* Pillars Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
            {pillars.map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={idx}
                  className="group rounded-sm border border-border bg-card p-6 flex flex-col gap-4 shadow-none hover:shadow-sm hover:border-primary/45 hover:bg-muted/10 transition-all duration-300"
                >
                  <div className="size-12 rounded-full bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                    <Icon className="size-6" />
                  </div>
                  <h3 className="font-display text-lg font-bold text-foreground">
                    {pillar.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Section 3: Our Mission */}
        <section id="mission" className="space-y-4">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-primary">
            {t("missionTitle")}
          </h2>
          <p className="text-base sm:text-lg leading-relaxed">
            {t("missionContent")}
          </p>
        </section>
      </div>
    </div>
  );
};

export default AboutUsPage;
