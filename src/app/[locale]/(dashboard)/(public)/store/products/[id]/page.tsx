import LoadingPage from "@/components/page/loading-page";
import { env } from "@/config/env";
import { paths } from "@/config/paths";
import { getProduct, getProductQueryOptions } from "@/features/store/api/get-products";
import ProductDetailPage from "@/features/store/pages/product-detail-page";
import { getQueryClient } from "@/lib/get-query-client";
import { getImage } from "@/lib/utils";
import type { Metadata } from "next";
import { Suspense } from "react";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { setRequestLocale } from "next-intl/server";

type Props = {
  params: Promise<{ locale: string; id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, id } = await params;
  const fallbackTitle = "MAS Store";

  try {
    const product = await getProduct({ productId: id });
    const canonical = `${env.APP_URL}/${locale}${paths.store.detail.getHref(id)}`;
    const description =
      product.description ||
      `${product.title} - printed merch from Myanmar Art Space.`;
    const title = `${product.title} | ${product.product_type?.name || "MAS Store"}`;
    const previewImage = getImage(product.hero_url || product.artwork_image_url);

    return {
      metadataBase: new URL(env.APP_URL),
      title,
      description,
      alternates: {
        canonical,
      },
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          "max-image-preview": "large",
          "max-snippet": -1,
          "max-video-preview": -1,
        },
      },
      openGraph: {
        type: "website",
        url: canonical,
        title,
        description,
        siteName: "Myanmar Art Space",
        images: [
          {
            url: previewImage,
            alt: `${product.title} - Myanmar Art Space`,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [previewImage],
      },
    };
  } catch (error) {
    console.error("Failed to generate store product metadata:", error);
    return {
      title: fallbackTitle,
      description: "Discover printed merch from Myanmar Art Space artists.",
      metadataBase: new URL(env.APP_URL),
    };
  }
}

const StoreProductDetailRoute = async ({ params }: Props) => {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const queryClient = getQueryClient();

  try {
    await queryClient.prefetchQuery(getProductQueryOptions(id));
  } catch (error) {
    // A miss here only costs the client one extra request; the feature screen
    // owns the empty and error states.
    console.error("Failed to prefetch store product:", error);
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<LoadingPage />}>
        <ProductDetailPage productId={id} />
      </Suspense>
    </HydrationBoundary>
  );
};

export default StoreProductDetailRoute;
