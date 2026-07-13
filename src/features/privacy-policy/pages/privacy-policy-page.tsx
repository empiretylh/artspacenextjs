"use client";

import { useTranslations } from "next-intl";

const PrivacyPolicyPage = () => {
  const t = useTranslations("PrivacyPolicy");

  // Robustly separates Label and Content by matching colons or dashes
  const renderListItem = (rawText: string) => {
    const match = rawText.match(/[:\u2013\u2014-]/);
    if (!match || match.index === undefined) {
      return <>{rawText}</>;
    }
    const index = match.index;
    const label = rawText.slice(0, index).trim();
    const content = rawText.slice(index + 1).trim();
    return (
      <>
        <span className="font-semibold text-foreground">{label}:</span> {content}
      </>
    );
  };

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-12 md:py-24 flex flex-col gap-16 md:gap-20">
      {/* Hero Section */}
      <header className="space-y-6 text-center md:text-left">
        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-primary leading-[1.1]">
          {t("title")}
        </h1>
        <div className="h-[2px] w-20 bg-primary mx-auto md:mx-0" />
        <p className="text-sm font-sans text-muted-foreground tracking-wide uppercase">
          {t("lastUpdated")}
        </p>
      </header>

      {/* Content Sections */}
      <div className="space-y-12 sm:space-y-16 leading-relaxed font-sans text-foreground/90">
        
        {/* Section 1: Introduction */}
        <section className="space-y-4">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-primary">
            {t("sections.intro.title")}
          </h2>
          <p className="text-base sm:text-lg leading-relaxed">
            {t("sections.intro.content")}
          </p>
        </section>

        {/* Section 2: Information We Collect */}
        <section className="space-y-6">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-primary">
            {t("sections.collect.title")}
          </h2>
          <p className="text-base sm:text-lg leading-relaxed">
            {t("sections.collect.content")}
          </p>

          <div className="space-y-6 pl-2">
            {/* General */}
            <div className="space-y-2">
              <h3 className="font-bold text-base sm:text-lg text-foreground">
                {t("sections.collect.generalTitle")}
              </h3>
              <ul className="list-disc list-inside space-y-2 text-sm sm:text-base pl-2">
                <li>{renderListItem(t("sections.collect.generalItems.account"))}</li>
                <li>{renderListItem(t("sections.collect.generalItems.technical"))}</li>
                <li>{renderListItem(t("sections.collect.generalItems.communication"))}</li>
              </ul>
            </div>

            {/* Collectors */}
            <div className="space-y-2">
              <h3 className="font-bold text-base sm:text-lg text-foreground">
                {t("sections.collect.collectorsTitle")}
              </h3>
              <ul className="list-disc list-inside space-y-2 text-sm sm:text-base pl-2">
                <li>{renderListItem(t("sections.collect.collectorsItems.identity"))}</li>
                <li>{renderListItem(t("sections.collect.collectorsItems.transaction"))}</li>
                <li>{renderListItem(t("sections.collect.collectorsItems.preferences"))}</li>
              </ul>
            </div>

            {/* Artists */}
            <div className="space-y-2">
              <h3 className="font-bold text-base sm:text-lg text-foreground">
                {t("sections.collect.artistsTitle")}
              </h3>
              <ul className="list-disc list-inside space-y-2 text-sm sm:text-base pl-2">
                <li>{renderListItem(t("sections.collect.artistsItems.profile"))}</li>
                <li>{renderListItem(t("sections.collect.artistsItems.verification"))}</li>
                <li>{renderListItem(t("sections.collect.artistsItems.financial"))}</li>
              </ul>
            </div>

            {/* Galleries */}
            <div className="space-y-2">
              <h3 className="font-bold text-base sm:text-lg text-foreground">
                {t("sections.collect.galleriesTitle")}
              </h3>
              <ul className="list-disc list-inside space-y-2 text-sm sm:text-base pl-2">
                <li>{renderListItem(t("sections.collect.galleriesItems.business"))}</li>
                <li>{renderListItem(t("sections.collect.galleriesItems.representation"))}</li>
                <li>{renderListItem(t("sections.collect.galleriesItems.financial"))}</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 3: How We Use Your Information */}
        <section className="space-y-4">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-primary">
            {t("sections.use.title")}
          </h2>
          <p className="text-base sm:text-lg leading-relaxed mb-4">
            {t("sections.use.content")}
          </p>
          <ul className="list-disc list-inside space-y-3 text-sm sm:text-base pl-2">
            <li>{renderListItem(t("sections.use.items.0"))}</li>
            <li>{renderListItem(t("sections.use.items.1"))}</li>
            <li>{renderListItem(t("sections.use.items.2"))}</li>
            <li>{renderListItem(t("sections.use.items.3"))}</li>
          </ul>
        </section>

        {/* Section 4: Information Sharing and Disclosure */}
        <section className="space-y-4">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-primary">
            {t("sections.sharing.title")}
          </h2>
          <p className="text-base sm:text-lg leading-relaxed mb-4">
            {t("sections.sharing.content")}
          </p>
          <ul className="list-disc list-inside space-y-3 text-sm sm:text-base pl-2">
            <li>{renderListItem(t("sections.sharing.items.0"))}</li>
            <li>{renderListItem(t("sections.sharing.items.1"))}</li>
            <li>{renderListItem(t("sections.sharing.items.2"))}</li>
            <li>{renderListItem(t("sections.sharing.items.3"))}</li>
          </ul>
        </section>

        {/* Section 5: Data Security */}
        <section className="space-y-4">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-primary">
            {t("sections.security.title")}
          </h2>
          <p className="text-base sm:text-lg leading-relaxed">
            {t("sections.security.content")}
          </p>
        </section>

        {/* Section 6: Your Rights */}
        <section className="space-y-4">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-primary">
            {t("sections.rights.title")}
          </h2>
          <p className="text-base sm:text-lg leading-relaxed">
            {t("sections.rights.content")}
          </p>
        </section>

        {/* Section 7: Contact Us */}
        <section className="space-y-4">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-primary">
            {t("sections.contact.title")}
          </h2>
          <p className="text-base sm:text-lg leading-relaxed mb-4">
            {t("sections.contact.content")}
          </p>
          <ul className="list-disc list-inside space-y-3 text-sm sm:text-base pl-2">
            <li>{renderListItem(t("sections.contact.support"))}</li>
            <li>{renderListItem(t("sections.contact.sales"))}</li>
            <li>{renderListItem(t("sections.contact.community"))}</li>
            <li>{renderListItem(t("sections.contact.admin"))}</li>
          </ul>
        </section>

      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
