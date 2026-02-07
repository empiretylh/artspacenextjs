import React from 'react'
import BannerSlider from './banner-slider'
import { getBanners, useGetBanners } from '@/features/service/artspace/get-banners'

const BannerSliderContainer = async () => {
  const banners = await getBanners();

  return (
    <BannerSlider banners={banners} />
  )
}

export default BannerSliderContainer
