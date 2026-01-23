import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Myanmar Art Space",
    short_name: "MAS",
    description: "Myanmar Art Space Social Media and Ecommerce Platform",
    screenshots: [
      {
        src: "/screenshots/image.png",
        sizes: "1898x776",
        type: "image/png",
        form_factor: "wide",
        label: "Home Screen"
      }
    ],
    icons: [
      {
        src: "/pwa-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any"
      },
      {
        src: "/pwa-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any"
      },
      {
        src: "/pwa-maskable-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable"
      },
      {
        src: "/pwa-maskable-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable"
      }
    ],
    start_url: "/",
    display: "standalone",
    background_color: "#FFFFFF",
    theme_color: "#FFFFFF"
  }
}
