import { redirect } from "@/i18n/routing";

const BlogSlugRedirectRoute = async ({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) => {
  const { locale, slug } = await params;
  redirect({ href: `/press/${slug}`, locale });
};

export default BlogSlugRedirectRoute;
