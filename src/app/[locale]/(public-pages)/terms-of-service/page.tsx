import { setRequestLocale } from "next-intl/server";
import TermsOfServicePage from "@/features/terms-of-service/pages/terms-of-service-page";
import { getTranslations } from "next-intl/server";
import { Metadata } from "next";
import { env } from "@/config/env";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "TermsOfService" });

  return {
    metadataBase: new URL(env.APP_URL),
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: {
      canonical: `${env.APP_URL}/terms-of-service`,
    },
    openGraph: {
      type: "website",
      url: `${env.APP_URL}/terms-of-service`,
      title: t("metaTitle"),
      description: t("metaDescription"),
      siteName: "Myanmar Art Space",
    },
    twitter: {
      card: "summary_large_image",
      title: t("metaTitle"),
      description: t("metaDescription"),
    },
  };
}

const TermsOfServiceRoute = async ({ params }: Props) => {
  const { locale } = await params;
  setRequestLocale(locale);

  return <TermsOfServicePage />;
};

export default TermsOfServiceRoute;
