"use client";

import { useTranslations } from "next-intl";

const TermsOfServicePage = () => {
  const t = useTranslations("TermsOfService");

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
        
        {/* Section 1: Acceptance */}
        <section className="space-y-4">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-primary">
            {t("sections.acceptance.title")}
          </h2>
          <p className="text-base sm:text-lg leading-relaxed">
            {t("sections.acceptance.content")}
          </p>
        </section>

        {/* Section 2: User Accounts and Roles */}
        <section className="space-y-4">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-primary">
            {t("sections.accounts.title")}
          </h2>
          <p className="text-base sm:text-lg leading-relaxed mb-4">
            {t("sections.accounts.content")}
          </p>
          <ul className="list-disc list-inside space-y-3 text-sm sm:text-base pl-2">
            <li>{renderListItem(t("sections.accounts.collectors"))}</li>
            <li>{renderListItem(t("sections.accounts.artists"))}</li>
            <li>{renderListItem(t("sections.accounts.galleries"))}</li>
          </ul>
        </section>

        {/* Section 3: Intellectual Property */}
        <section className="space-y-4">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-primary">
            {t("sections.property.title")}
          </h2>
          <ul className="list-disc list-inside space-y-3 text-sm sm:text-base pl-2">
            <li>{renderListItem(t("sections.property.ownership"))}</li>
            <li>{renderListItem(t("sections.property.license"))}</li>
            <li>{renderListItem(t("sections.property.prohibited"))}</li>
          </ul>
        </section>

        {/* Section 4: Buying and Selling */}
        <section className="space-y-4">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-primary">
            {t("sections.commerce.title")}
          </h2>
          <ul className="list-disc list-inside space-y-3 text-sm sm:text-base pl-2">
            <li>{renderListItem(t("sections.commerce.pricing"))}</li>
            <li>{renderListItem(t("sections.commerce.commissions"))}</li>
            <li>{renderListItem(t("sections.commerce.payments"))}</li>
          </ul>
        </section>

        {/* Section 5: Shipping and Delivery */}
        <section className="space-y-4">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-primary">
            {t("sections.shipping.title")}
          </h2>
          <ul className="list-disc list-inside space-y-3 text-sm sm:text-base pl-2">
            <li>{renderListItem(t("sections.shipping.responsibility"))}</li>
            <li>{renderListItem(t("sections.shipping.costs"))}</li>
            <li>{renderListItem(t("sections.shipping.risk"))}</li>
          </ul>
        </section>

        {/* Section 6: Returns and Disputes */}
        <section className="space-y-4">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-primary">
            {t("sections.disputes.title")}
          </h2>
          <ul className="list-disc list-inside space-y-3 text-sm sm:text-base pl-2">
            <li>{renderListItem(t("sections.disputes.authenticity"))}</li>
            <li>{renderListItem(t("sections.disputes.damaged"))}</li>
            <li>{renderListItem(t("sections.disputes.returns"))}</li>
          </ul>
        </section>

        {/* Section 7: User Conduct */}
        <section className="space-y-4">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-primary">
            {t("sections.conduct.title")}
          </h2>
          <p className="text-base sm:text-lg leading-relaxed mb-4">
            {t("sections.conduct.content")}
          </p>
          <ul className="list-disc list-inside space-y-3 text-sm sm:text-base pl-2">
            <li>{renderListItem(t("sections.conduct.harassment"))}</li>
            <li>{renderListItem(t("sections.conduct.sensitive"))}</li>
            <li>{renderListItem(t("sections.conduct.fraud"))}</li>
            <li>{renderListItem(t("sections.conduct.consequences"))}</li>
          </ul>
        </section>

        {/* Section 8: Limitation of Liability */}
        <section className="space-y-4">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-primary">
            {t("sections.liability.title")}
          </h2>
          <p className="text-base sm:text-lg leading-relaxed">
            {t("sections.liability.content")}
          </p>
        </section>

        {/* Section 9: Contact Us */}
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

export default TermsOfServicePage;
