// components/home/banner-slider.tsx
"use client"

import AppImage from "@/components/common/app-image"
import { getImage } from "@/lib/utils"
import Link from "@/components/common/link"
import { Autoplay, Pagination } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"
import { useIsMobile } from "@/hooks/use-mobile"
import { motion } from "framer-motion"

type Banner = {
  id: number
  title: string
  link: string
  image: string
  image_mobile: string
  image_desktop: string
  is_active: boolean
}

interface Props {
  banners: Banner[]
}

type SwiperStyle = React.CSSProperties & {
  "--swiper-pagination-color": string;
  "--swiper-pagination-bullet-inactive-color": string;
};

export default function BannerSlider({ banners }: Props) {
  const isMobile = useIsMobile();
  const activeBanners = banners
    .filter((b) => b.is_active)
    .sort((a, b) => a.id - b.id)

  if (!activeBanners.length) return null

  return (
    <motion.section 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="rounded-lg relative shadow-xl md:shadow-none aspect-2/1 md:aspect-8/3 overflow-hidden"
    >
      <Swiper
        modules={[Autoplay, Pagination]}
        autoplay={{ delay: 15000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        style={{
          "--swiper-pagination-color": "var(--primary)",
          "--swiper-pagination-bullet-inactive-color": "#999999",
        } as SwiperStyle}
        loop
        watchSlidesProgress
        className="w-full h-full"
      >
        {activeBanners.map((banner, index) => {
          const isExternal = Boolean(
            banner.link && (banner.link.startsWith("http://") || banner.link.startsWith("https://") || banner.link.startsWith("//"))
          );

          const content = (
            <div className="relative h-full w-full aspect-2/1 md:aspect-8/3">
              {isMobile ? (
                /* Mobile Image */
                <AppImage
                  src={banner.image_mobile ? getImage(banner.image_mobile) : getImage(banner.image)}
                  alt={banner.title}
                  fill
                  priority={index === 0}
                  sizes="100vw"
                  className="object-cover"
                />
              ) : (
                /* Desktop Image */
                <AppImage
                  src={banner.image_desktop ? getImage(banner.image_desktop) : getImage(banner.image)}
                  alt={banner.title}
                  fill
                  priority={index === 0}
                  sizes="100vw"
                  className="object-cover"
                />
              )}
            </div>
          );

          return (
            <SwiperSlide key={banner.id}>
              {isExternal ? (
                <a href={banner.link} target="_blank" rel="noopener noreferrer" className="block w-full h-full">
                  {content}
                </a>
              ) : banner.link ? (
                <Link to={banner.link} className="block w-full h-full">
                  {content}
                </Link>
              ) : (
                content
              )}
            </SwiperSlide>
          );
        })}
      </Swiper>
    </motion.section>
  )
}
