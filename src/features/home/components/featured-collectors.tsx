import { SectionTitle } from "@/components/common";
import { Button } from "@/components/ui/button";
import ProfileCard from "../../../components/app/profile/profile-card";
import Link from "@/components/common/link";
import { paths } from "@/config/paths";
import { ArrowRight } from "lucide-react";
import { FeaturedCollectorsSectionSkeleton } from "./featured-collectors-section-skeleton";
import { useGetCollectors } from "@/features/service/artspace/get-collectors";
import UserSmallCard from "@/components/app/user-small-card";

export const FeaturedCollectorsSection = () => {
   const collectorsQuery = useGetCollectors();

   const featuredCollectors = collectorsQuery.data?.data?.results ?? [];

   if (collectorsQuery.isLoading) {
      return <FeaturedCollectorsSectionSkeleton />;
   }

   if (featuredCollectors.length === 0) {
      return null;
   }

   return (
      <section>
         <div className="flex justify-between items-end mb-4">
            <div>
               <SectionTitle>Collectors</SectionTitle>
            </div>
            <Link to={paths.collectors.path}>
               <Button variant="ghost" className="flex">
                  View All <ArrowRight className="ml-2 h-4 w-4" />
               </Button>
            </Link>
         </div>
         <div className="flex gap-2">
            {featuredCollectors.map((collector) => (
               <div className="shrink-0" key={collector.id}>
                  <UserSmallCard user={collector} />
               </div>
            ))}
         </div>
      </section>
   );
};
