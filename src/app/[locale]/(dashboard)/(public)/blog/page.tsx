import { redirect } from "@/i18n/routing";

const BlogRedirectRoute = async ({
  params,
}: {
  params: Promise<{ locale: string }>;
}) => {
  redirect({ href: "/press", locale: (await params).locale });
};

export default BlogRedirectRoute;
