import { setRequestLocale } from "next-intl/server";
import FAQPage from "@/features/faq/pages/faq-page";
import { getTranslations } from "next-intl/server";
import { Metadata } from "next";
import { env } from "@/config/env";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "FAQ" });

  return {
    metadataBase: new URL(env.APP_URL),
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: {
      canonical: `${env.APP_URL}/faq`,
    },
    openGraph: {
      type: "website",
      url: `${env.APP_URL}/faq`,
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

const FAQRoute = async ({ params }: Props) => {
  const { locale } = await params;
  setRequestLocale(locale);

  return <FAQPage />;
};

export default FAQRoute;
