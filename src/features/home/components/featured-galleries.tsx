import { SectionTitle } from "@/components/common";
import { Button } from "@/components/ui/button";
import ProfileCard from "../../../components/app/profile/profile-card";
import Link from "@/components/common/link";
import { paths } from "@/config/paths";
import { ArrowRight } from "lucide-react";
import { FeaturedGalleriesSectionSkeleton } from "./featured-galleries-section-skeleton";
import { useGetGalleries } from "@/features/service/artspace/get-galleries";
import UserSmallCard from "@/components/app/user-small-card";
import { SourceProvider } from "@/lib/analytics-source";
import { FollowSource } from "@/lib/analytics";

export const FeaturedGalleriesSection = () => {
   const galleriesQuery = useGetGalleries();

   const featuredGalleries = galleriesQuery.data?.results ?? [];

   if (galleriesQuery.isLoading) {
      return <FeaturedGalleriesSectionSkeleton />;
   }

   if (featuredGalleries.length === 0) {
      return null;
   }

   return (
      <section>
         <div className="flex justify-between items-end mb-4">
            <div>
               <SectionTitle>Galleries</SectionTitle>
            </div>
            <Link to={paths.galleries.path}>
               <Button variant="ghost" className="flex">
                  View All <ArrowRight className="ml-2 h-4 w-4" />
               </Button>
            </Link>
         </div>
         <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-6 gap-2">
            <SourceProvider<FollowSource> value={{ source: "home_feed" }}>
               {featuredGalleries.map((gallery) => (
                  <div key={gallery.id}>
                     <UserSmallCard user={gallery} />
                  </div>
               ))}
            </SourceProvider>
         </div>
      </section>
   );
};
