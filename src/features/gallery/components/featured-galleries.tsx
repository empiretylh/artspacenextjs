import { useGetGalleries } from "@/features/service/artspace/get-galleries";
import UserListItem from "../../../components/app/user-list-item";
import UserListItemSkeleton from "../../../components/app/user-list-item-skeleton";

const FeaturedGalleries = () => {
   const galleryQuery = useGetGalleries({
      limit: 4,
   });

   const galleries = galleryQuery.data?.data?.results ?? [];

   if (galleries.length === 0) {
      return null;
   }

   return (
      <div>
         <h2 className="font-display text-xl font-bold mb-2">
            Featured Galleries
         </h2>

         <div className="flex flex-col gap-2">
            {galleryQuery.isLoading
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
      </div>
   );
};

export default FeaturedGalleries;
