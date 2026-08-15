'use client'
import AppImage from "@/components/common/app-image";
import Link from "@/components/common/link";
import { Skeleton } from "@/components/ui/skeleton";
import { paths } from "@/config/paths";
import { queryKeys } from "@/config/query-keys";
import { getHomeStyles } from "@/features/service/artspace/get-home-styles";
import { getImage } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";

const containerVariants = {
   hidden: { opacity: 0 },
   show: {
      opacity: 1,
      transition: {
         delayChildren: 0.2,
         staggerChildren: 0.05,
      },
   },
} as const;

const itemVariants = {
   hidden: { opacity: 0, y: 15 },
   show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
} as const;

export const StylesList = () => {
   const stylesQuery = useQuery({
      queryKey: queryKeys.style.home.list({ limit: 12 }),
      queryFn: () => getHomeStyles({ limit: 12 }),
   });

   const styles = stylesQuery.data?.results || [];
   const isLoading = stylesQuery.isLoading;

   const skeletons = Array.from({ length: 12 });

   return (
      <>
         {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 shrink-0 justify-center items-center gap-4 md:gap-6">
               {skeletons.map((_, index) => (
                  <div
                     key={index}
                     className="relative w-full h-[142px] max-w-2xl overflow-hidden rounded-2xl"
                  >
                     <Skeleton className="h-full w-full rounded-2xl" />
                     <div className="absolute left-2 bottom-2 right-2 p-2 rounded-xl">
                        <Skeleton className="h-4 w-1/2" />
                     </div>
                  </div>
               ))}
            </div>
         ) : (
            <motion.div 
               variants={containerVariants}
               initial="hidden"
               whileInView="show"
               viewport={{ once: true, margin: "-50px" }}
               className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 shrink-0 justify-center items-center gap-4 md:gap-6"
            >
               {styles.slice(0, 12).map((style) => (
                  <motion.div key={style.style.slug} variants={itemVariants}>
                     <Link
                        to={{
                           pathname: paths.artworks.path,
                           search: `?art-style=${style.style.slug}`,
                        }}
                     >
                        <div className="relative w-full aspect-square max-w-2xl overflow-hidden rounded-2xl">
                           <AppImage
                              src={getImage(style.style.image)}
                              alt={style.style.name}
                              fill // Use fill for relative containers
                              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 17vw"
                              className="object-cover rounded-2xl transform transition-transform duration-300 hover:scale-105"
                           />

                           <div className="absolute left-2 bottom-2 right-2 flex items-end p-2 bg-black/60 border border-white/10 rounded-xl">
                              <h1 className="text-sm font-semibold truncate text-white">
                                 {style.style.name}
                              </h1>
                           </div>
                        </div>
                     </Link>
                  </motion.div>
               ))}
            </motion.div>
         )}
      </>
   );
};
