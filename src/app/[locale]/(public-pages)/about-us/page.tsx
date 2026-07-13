import { setRequestLocale } from "next-intl/server";
import AboutUsPage from "@/features/about-us/pages/about-us-page";
import { getTranslations } from "next-intl/server";
import { Metadata } from "next";
import { env } from "@/config/env";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "AboutUs" });
  
  return {
    metadataBase: new URL(env.APP_URL),
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: {
      canonical: `${env.APP_URL}/about-us`,
    },
    openGraph: {
      type: "website",
      url: `${env.APP_URL}/about-us`,
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

const AboutUsRoute = async ({ params }: Props) => {
  const { locale } = await params;
  setRequestLocale(locale);

  return <AboutUsPage />;
};

export default AboutUsRoute;
