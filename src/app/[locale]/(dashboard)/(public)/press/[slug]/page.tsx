export const revalidate = 60;

import { env } from "@/config/env";
import { queryKeys } from "@/config/query-keys";
import BlogDetailPage from "@/features/blog/pages/blog-detail-page";
import { getBlogPost } from "@/features/service/artspace/get-blog-post";
import { getBlogPosts } from "@/features/service/artspace/get-blog-posts";
import { getBlogCoverImage } from "@/features/blog/utils";
import { getQueryClient } from "@/lib/get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Metadata } from "next";
import { cache } from "react";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";

export async function generateStaticParams() {
  try {
    const posts = await getBlogPosts({ limit: 10 });
    const results = posts?.results || [];

    return routing.locales.flatMap((locale) =>
      results.map((post) => ({
        locale,
        slug: post.slug,
      }))
    );
  } catch {
    return [];
  }
}

const getCachedBlogPost = cache((slug: string) => getBlogPost({ slug }));

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {
  const { slug } = await params;

  try {
    const post = await getCachedBlogPost(slug);
    const title = post.seo_title || post.title;
    const description = post.seo_description || post.excerpt;
    const canonical = `${env.APP_URL}/press/${slug}`;
    const ogImage = getBlogCoverImage(post, "display");

    return {
      title: `${title} | Myanmar Art Space`,
      description,
      metadataBase: new URL(env.APP_URL),
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
        type: "article",
        url: canonical,
        title,
        description,
        siteName: "Myanmar Art Space",
        publishedTime: post.published_at || undefined,
        authors: post.author
          ? [`${post.author.first_name || ""} ${post.author.last_name || ""}`.trim() || post.author.email]
          : undefined,
        tags: post.tags?.map((t) => t.name),
        images: [
          {
            url: ogImage,
            width: 1200,
            height: 630,
            alt: post.cover_alt || title,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [ogImage],
      },
    };
  } catch {
    return {
      title: "Press Release | Myanmar Art Space",
      description: "Discover news and press releases on Myanmar Art Space.",
    };
  }
}

const PressDetailRoute = async ({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) => {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: queryKeys.blog.posts.detail(slug),
    queryFn: () => getCachedBlogPost(slug),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <BlogDetailPage slug={slug} />
    </HydrationBoundary>
  );
};

export default PressDetailRoute;
