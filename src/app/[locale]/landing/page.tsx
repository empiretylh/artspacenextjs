import { getBanners } from "@/features/service/artspace/get-banners";
import LandingPageView from "@/features/home/components/landing-page-view";
import { setRequestLocale } from "next-intl/server";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function LandingPageRoute({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Fetch CMS banners for the landing page hero section
  let banner = null;
  try {
    const banners = await getBanners();
    const activeBanners = banners
      .filter((b: any) => b.is_active)
      .sort((a: any, b: any) => a.id - b.id);
    if (activeBanners.length > 0) {
      banner = activeBanners[0];
    }
  } catch (error) {
    console.error("Failed to fetch banners for landing page:", error);
  }

  return <LandingPageView banner={banner} locale={locale} />;
}
