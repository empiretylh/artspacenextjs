import { redirect } from "@/i18n/routing";

type Props = {
  params: Promise<{ locale: string }>;
};

const HomeRedirectRoute = async ({ params }: Props) => {
  const { locale } = await params;
  redirect({ href: "/", locale });
};

export default HomeRedirectRoute;
