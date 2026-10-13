import { getCachedUser } from "@/features/service/artspace/get-user";
import { getUserRouteType } from "@/lib/utils";
import { redirect } from "@/i18n/routing";
import { notFound } from "next/navigation";

interface UserRedirectProps {
   params: Promise<{
      locale: string;
      id: string;
   }>;
}

export default async function UserRedirectPage({ params }: UserRedirectProps) {
   const { id, locale } = await params;

   const user = await getCachedUser(id);
   if (!user) {
      notFound();
   }

   const userTypeRoute = getUserRouteType(user.user_type);
   redirect({ href: `/${userTypeRoute}/${id}`, locale });
}
