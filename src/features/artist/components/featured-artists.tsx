'use client'
import { useAuth } from "@/features/auth/store";
import { useGetUsers } from "@/features/service/artspace/get-users";
import UserListItem from "../../../components/app/user-list-item";
import UserListItemSkeleton from "../../../components/app/user-list-item-skeleton";
import { SourceProvider } from "@/lib/analytics-source";
import { useTranslations } from "next-intl";

const FeaturedArtists = () => {
   const t = useTranslations("Artist");
   const artistQuery = useGetUsers({
      userType: "artists",
      limit: 4,
   });

   const { accessToken } = useAuth()

   const artists = artistQuery.data?.results ?? [];

   return (
      <div>
         <h2 className="font-display text-xl font-semibold mb-2">
            {t("featuredArtists")}
         </h2>

         <SourceProvider value={{ source: "sidebar" }}>
            <div className="grid grid-cols-1 gap-2">
               {artistQuery.isLoading || accessToken === undefined
                  ? Array.from({ length: 4 }).map((_, index) => (
                     <UserListItemSkeleton key={index} />
                  ))
                  : artists.map((artist, index) => (
                     <UserListItem
                        key={index}
                        user={artist}
                        className="max-w-[calc(var(--sidebar-width)-28px)]  md:max-w-[calc(var(--sidebar-width)-48px)]"
                     />
                  ))}
            </div>
         </SourceProvider>
      </div>
   );
};

export default FeaturedArtists;
