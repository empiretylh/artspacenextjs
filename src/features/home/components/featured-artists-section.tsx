import { SectionTitle } from "@/components/common";
import { Button } from "@/components/ui/button";
import ProfileCard from "../../../components/app/profile/profile-card";
import Link from "@/components/common/link";
import { paths } from "@/config/paths";
import { ArrowRight } from "lucide-react";
import { FeaturedArtistsSectionSkeleton } from "./featured-artists-section-skeleton";
import { useGetArtists } from "@/features/service/artspace/get-artists";

export const FeaturedArtistsSection = () => {
   const artistsQuery = useGetArtists();

   const featuredArtists = artistsQuery.data?.data?.results ?? [];

   if (artistsQuery.isLoading) {
      return <FeaturedArtistsSectionSkeleton />;
   }

   return (
      <section>
         <div className="flex justify-between items-end mb-4">
            <div>
               <SectionTitle>Artists</SectionTitle>
            </div>
            <Link to={paths.artists.path}>
               <Button variant="ghost" className="flex">
                  View All <ArrowRight className="ml-2 h-4 w-4" />
               </Button>
            </Link>
         </div>
         <div className="grid grid-cols-3 lg:grid-cols-4 2xl:grid-cols-6 gap-2">
            {featuredArtists.map((artist) => (
               <div key={artist.id}>
                  <ProfileCard user={artist} />
               </div>
            ))}
         </div>
      </section>
   );
};
