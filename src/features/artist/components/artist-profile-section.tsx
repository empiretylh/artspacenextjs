import ArtworkCard from "@/components/app/artwork-card";
import Link from "@/components/common/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { paths } from "@/config/paths";
import { cn, getImage } from "@/lib/utils";
import type { Artist, Artwork } from "@/types";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { UserRound } from "lucide-react";

export const ArtistProfileSection = ({
   artist,
   className,
}: {
   artist: Artist;
   className?: string;
}) => (
   <div
      id={`artist-${artist.id}`}
      className={cn("space-y-4 mb-4 border-b", className)}
   >
      {/* Artist Banner and Profile Card */}
      <div className="p-2 pt-0 flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
         {/* Avatar */}
         {artist.avatar ? (
            <img
               src={getImage(artist.avatar)}
               alt={artist.name}
               className="h-20 w-20 rounded-full object-cover border-4 border-card shadow-lg"
            />
         ) : (
            <div className="h-20 w-20 flex justify-center items-center border rounded-full">
               <UserRound />
            </div>
         )}
         {/* Details */}
         <div className="flex-grow space-y-1">
            <Link
               to={paths.artists.detail.getHref(String(artist.id))}
               className="text-blue-700 underline text-lg"
            >
               {artist.name}
            </Link>
         </div>
      </div>

      {/* Artist's Artworks Grid */}
      <div className="">
         <h3 className="text-2xl font-bold mb-6 border-b border-border pb-2">
            Featured Artworks ({artist.num_artworks})
         </h3>
         <div className="space-x-4 space-y-4">
            <div className="overflow-hidden">
               <Swiper
                  modules={[Navigation]}
                  slidesPerView="auto"
                  spaceBetween={16}
                  // onInit={(swiper) => {
                  //    swiperRef.current = swiper;
                  // }}
                  navigation={{
                     nextEl: ".swiper-button-next-custom",
                     prevEl: ".swiper-button-prev-custom",
                  }}
                  className="!overflow-visible"
               >
                  {artist.popular_artworks.map((artwork) => (
                     <SwiperSlide key={artwork.id} className="!w-auto">
                        <ArtworkCard
                           className={
                              "inline-block break-inside-avoid mb-4 max-w-sm flex-1/2 h-auto pb-[100px]"
                           }
                           key={artwork.id}
                           artwork={artwork}
                        />
                     </SwiperSlide>
                  ))}
               </Swiper>
            </div>
            {/* {artist.popular_artworks.map((artwork) => (
               <ArtworkCard
                  className={
                     "inline-block break-inside-avoid mb-4 max-w-sm flex-1/2 h-auto"
                  }
                  key={artwork.id}
                  artwork={artwork}
               />
            ))} */}
         </div>
      </div>
   </div>
);
