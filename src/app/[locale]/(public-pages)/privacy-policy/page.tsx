import { setRequestLocale } from "next-intl/server";
import PrivacyPolicyPage from "@/features/privacy-policy/pages/privacy-policy-page";
import { getTranslations } from "next-intl/server";
import { Metadata } from "next";
import { env } from "@/config/env";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "PrivacyPolicy" });

  return {
    metadataBase: new URL(env.APP_URL),
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: {
      canonical: `${env.APP_URL}/privacy-policy`,
    },
    openGraph: {
      type: "website",
      url: `${env.APP_URL}/privacy-policy`,
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

const PrivacyPolicyRoute = async ({ params }: Props) => {
  const { locale } = await params;
  setRequestLocale(locale);

  return <PrivacyPolicyPage />;
};

export default PrivacyPolicyRoute;
