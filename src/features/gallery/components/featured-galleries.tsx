'use client'
import { useAuth } from "@/features/auth/store";
import { useGetUsers } from "@/features/service/artspace/get-users";
import UserListItem from "../../../components/app/user-list-item";
import UserListItemSkeleton from "../../../components/app/user-list-item-skeleton";
import { SourceProvider } from "@/lib/analytics-source";
import { useTranslations } from "next-intl";

const FeaturedGalleries = () => {
   const t = useTranslations("Gallery");
   const galleryQuery = useGetUsers({
      userType: "galleries",
      limit: 4,
   });

   const { accessToken } = useAuth();

   const galleries = galleryQuery.data?.results ?? [];

   if (galleries.length === 0) {
      return null;
   }

   return (
      <div>
         <h2 className="font-display text-xl font-semibold mb-2">
            {t("featuredGalleries")}
         </h2>

         <SourceProvider value={{ source: "sidebar" }}>
            <div className="flex flex-col gap-2">
               {galleryQuery.isLoading || accessToken === undefined
                  ? Array.from({ length: 4 }).map((_, index) => (
                     <UserListItemSkeleton key={index} />
                  ))
                  : galleries.map((gallery, index) => (
                     <UserListItem
                        key={index}
                        user={gallery}
                        className="max-w-[calc(var(--sidebar-width)-28px)]  md:max-w-[calc(var(--sidebar-width)-48px)]"
                     />
                  ))}
            </div>
         </SourceProvider>
      </div>
   );
};

export default FeaturedGalleries;
