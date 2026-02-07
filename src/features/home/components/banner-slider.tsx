// components/home/banner-slider.tsx
"use client"

import AppImage from "@/components/common/app-image"
import { getImage } from "@/lib/utils"
import Link from "next/link"
import { Autoplay, Pagination } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"

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
  const activeBanners = banners
    .filter((b) => b.is_active)
    .sort((a, b) => a.id - b.id)

  if (!activeBanners.length) return null

  return (
    <section className="relative w-full">
      <Swiper
        modules={[Autoplay, Pagination]}
        autoplay={{ delay: 15000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        style={{
          "--swiper-pagination-color": "var(--primary)",
          "--swiper-pagination-bullet-inactive-color": "#999999",
        } as SwiperStyle}
        loop
        className="rounded-lg shadow-xl md:shadow-none aspect-2/1 md:aspect-8/3"
      >
        {activeBanners.map((banner) => (
          <SwiperSlide key={banner.id}>
            <Link href={banner.link} target="_blank">
              <div className="relative h-full w-full aspect-2/1 md:aspect-8/3">
                {/* Desktop Image */}
                <div className="hidden md:block h-full w-full">
                  <AppImage
                    src={getImage(banner.image_desktop) || getImage(banner.image)}
                    alt={banner.title}
                    fill
                    preload
                    sizes="100vw"
                    className="object-cover"
                  />
                </div>

                {/* Mobile Image */}
                <div className="block md:hidden h-full w-full">
                  <AppImage
                    src={getImage(banner.image_mobile) || getImage(banner.image)}
                    alt={banner.title}
                    fill
                    preload
                    sizes="100vw"
                    className="object-cover"
                  />
                </div>

                {/* Overlay */}
                {/* <div className="absolute inset-0 bg-black/30" /> */}

                {/* Content */}
                {/* <div className="absolute inset-0 flex items-center justify-center text-center">
                  <div className="space-y-4 px-4">
                    <h1 className="text-3xl md:text-5xl font-bold text-white">
                      {banner.title}
                    </h1>
                    <Button size="lg" className="rounded-full">
                      Explore Now
                    </Button>
                  </div>
                </div> */}
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  )
}
