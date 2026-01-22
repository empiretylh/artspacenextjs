import type { Artwork } from "@/types";

// --- Placeholder Data ---
export const featuredArtworks = [
   {
      id: 1,
      title: "Nebula Bloom",
      artist: "R. Kudo",
      price: 1200,
      category: "Abstract",
      imageUrl: "https://placehold.co/400x400/171717/d4d4d4?text=Artwork+1",
   },
   {
      id: 2,
      title: "City Dusk",
      artist: "A. Chen",
      price: 950,
      category: "Photography",
      imageUrl: "https://placehold.co/400x400/262626/d4d4d4?text=Artwork+2",
   },
   {
      id: 3,
      title: "The Seeker",
      artist: "J. Doe",
      price: 2100,
      category: "Sculpture",
      imageUrl: "https://placehold.co/400x400/0a0a0a/d4d4d4?text=Artwork+3",
   },
   {
      id: 4,
      title: "Emerald Wave",
      artist: "L. Patel",
      price: 1550,
      category: "Painting",
      imageUrl: "https://placehold.co/400x400/404040/d4d4d4?text=Artwork+4",
   },
   {
      id: 5,
      title: "Silent Portrait",
      artist: "M. Vega",
      price: 1700,
      category: "Digital",
      imageUrl: "https://placehold.co/400x400/525252/d4d4d4?text=Artwork+5",
   },
];

export const featuredArtists = [
   {
      id: 101,
      name: "Elena Ryu",
      avatarUrl: "https://placehold.co/100x100/3b82f6/e0f2f1?text=ER",
   },
   {
      id: 102,
      name: "Kenji Sato",
      avatarUrl: "https://placehold.co/100x100/10b981/e0f2f1?text=KS",
   },
   {
      id: 103,
      name: "Sofia Bell",
      avatarUrl: "https://placehold.co/100x100/f59e0b/e0f2f1?text=SB",
   },
   {
      id: 104,
      name: "Liam Johnson",
      avatarUrl: "https://placehold.co/100x100/fbbf24/e0f2f1?text=LJ",
   },
   {
      id: 105,
      name: "Noah Thompson",
      avatarUrl: "https://placehold.co/100x100/3b82f6/e0f2f1?text=NT",
   },
   {
      id: 106,
      name: "Olivia Davis",
      avatarUrl: "https://placehold.co/100x100/10b981/e0f2f1?text=OD",
   },
];

export const artworks = Array.from({ length: 18 }, (_, i) => ({
   id: `art-${i + 1}`,
   title: `Abstract Piece No. ${i + 1}`,
   artist: `Artist ${String.fromCharCode(65 + (i % 5))}`,
   price: Math.floor(Math.random() * 5000) + 500,
   medium: ["Oil on Canvas", "Sculpture", "Photography", "Digital"][i % 4],
   category: ["Abstract", "Painting", "Sculpture", "Photography"][i % 4],
   imageUrl: `https://placehold.co/400x500/${["1f293a", "2c3e50", "34495e", "60a5fa"][i % 4]}/f8fafc?text=Art+${i + 1}`,
   yearCreated: 2020 + (i % 5),
   isAvailable: true,
}));

export const filterOptions = {
   mediums: [
      "Oil on Canvas",
      "Sculpture",
      "Photography",
      "Digital Art",
      "Drawing",
      "Mixed Media",
   ],
   years: [
      "2022",
      "2021",
      "2020",
      "2019",
      "2018",
      "2017",
      "2016",
      "2015",
      "2014",
      "2013",
      "2012",
      "2011",
      "2010",
   ],
   status: ["AVAILABLE", "SOLD"],
   priceRanges: [
      { label: "Under $1,000", min: 0, max: 1000 },
      { label: "$1,000 - $5,000", min: 1000, max: 5000 },
      { label: "$5,000 - $10,000", min: 5000, max: 10000 },
      { label: "Over $10,000", min: 10000, max: 999999 },
   ],
   styles: ["Abstract", "Portraiture", "Landscape", "Minimalism", "Figurative"],
};

export const mockArtists = [
   {
      id: "a1",
      name: "Sergey Shamakian",
      country: "USA",
      style: ["Abstract", "Portraiture"],
      artworksCount: 56,
      avatarUrl: "https://placehold.co/100x100/2563eb/eff6ff?text=SS",
      isFeatured: true,
      bannerUrl:
         "https://placehold.co/1200x200/525252/d4d4d4?text=Artist+Banner+1",
      bio: "A master of light and shadow, Sergey's work captures the ephemeral beauty of the mundane, transforming ordinary scenes into vibrant narratives. He has exhibited globally since 2010.",
   },
   {
      id: "a2",
      name: "Ahmad Sediqyar",
      country: "Germany",
      style: ["Landscape", "Minimalism"],
      artworksCount: 32,
      avatarUrl: "https://placehold.co/100x100/15803d/bbf7d0?text=AS",
      isFeatured: false,
      bannerUrl:
         "https://placehold.co/1200x200/525252/d4d4d4?text=Artist+Banner+2",
      bio: "Ahmad uses stark lines and negative space to explore themes of isolation and vastness. His minimalist approach often uses deep blues and muted grays to evoke emotional depth.",
   },
   {
      id: "a3",
      name: "Elena Ryu",
      country: "Japan",
      style: ["Figurative", "Drawing"],
      artworksCount: 112,
      avatarUrl: "https://placehold.co/100x100/be123c/fda4af?text=ER",
      isFeatured: true,
      bannerUrl:
         "https://placehold.co/1200x200/525252/d4d4d4?text=Artist+Banner+3",
      bio: "Known for her intricate pencil and charcoal drawings, Elena focuses on the human form, capturing vulnerability and strength in equal measure. Her training is rooted in classical Japanese art.",
   },
];

export type MockArtworksByArtist = {
   [key: string]: Artwork[];
};

export const mockArtworksByArtist: MockArtworksByArtist = {
   a1: [
      {
         id: "art1-1",
         title: "Cosmic Bloom",
         price: 3500,
         imageUrl: "https://placehold.co/400x500/1f293a/f8fafc?text=SS+Art+1",
      },
      {
         id: "art1-2",
         title: "Urban Dusk",
         price: 4100,
         imageUrl: "https://placehold.co/400x500/2c3e50/f8fafc?text=SS+Art+2",
      },
      {
         id: "art1-3",
         title: "Silent Observer",
         price: 2900,
         imageUrl: "https://placehold.co/400x500/34495e/f8fafc?text=SS+Art+3",
      },
      {
         id: "art1-4",
         title: "Digital Sea",
         price: 5500,
         imageUrl: "https://placehold.co/400x500/60a5fa/f8fafc?text=SS+Art+4",
      },
   ],
   a2: [
      {
         id: "art2-1",
         title: "Horizon Line",
         price: 7800,
         imageUrl: "https://placehold.co/400x500/16a34a/dcfce7?text=AS+Art+1",
      },
      {
         id: "art2-2",
         title: "Isolated Peak",
         price: 6200,
         imageUrl: "https://placehold.co/400x500/34d399/dcfce7?text=AS+Art+2",
      },
      {
         id: "art2-3",
         title: "Green Flux",
         price: 5900,
         imageUrl: "https://placehold.co/400x500/065f46/dcfce7?text=AS+Art+3",
      },
   ],
   a3: [
      {
         id: "art3-1",
         title: "The Gaze",
         price: 9100,
         imageUrl: "https://placehold.co/400x500/c026d3/f3e8ff?text=ER+Art+1",
      },
      {
         id: "art3-2",
         title: "Sleeping Form",
         price: 8500,
         imageUrl: "https://placehold.co/400x500/7c3aed/f3e8ff?text=ER+Art+2",
      },
      {
         id: "art3-3",
         title: "Hand Study I",
         price: 4200,
         imageUrl: "https://placehold.co/400x500/a855f7/f3e8ff?text=ER+Art+3",
      },
      {
         id: "art3-4",
         title: "Reflections",
         price: 6700,
         imageUrl: "https://placehold.co/400x500/5b21b6/f3e8ff?text=ER+Art+4",
      },
      {
         id: "art3-5",
         title: "Quietude",
         price: 7100,
         imageUrl: "https://placehold.co/400x500/4c051e/f3e8ff?text=ER+Art+5",
      },
   ],
};

export const artistFilterOptions = {
   countries: ["USA", "Germany", "Japan", "France", "Brazil", "UK", "China"],
   styles: [
      "Abstract",
      "Portraiture",
      "Landscape",
      "Minimalism",
      "Figurative",
      "Digital",
      "Drawing",
      "Street Art",
   ],
};

export const mockArtwork = {
   id: "khotyn1621",
   title: "Battle of Khotyn, 1621",
   artist: {
      name: "Volodymyr Badiuk",
      id: "vb1",
      country: "Ukraine",
      artworksCount: 15,
      avatarUrl: "https://placehold.co/100x100/f97316/fff7ed?text=VB",
   },
   price: 9800,
   status: "On Sale",
   imageUrl:
      "https://placehold.co/800x600/374151/f3f4f6?text=Masterpiece+Painting",
   isOriginal: true,
   details: [
      { label: "Medium", value: "Oil on Canvas" },
      { label: "Style", value: "Realism" },
      { label: "Dimension", value: "160 cm x 120 cm" },
      { label: "Year", value: "2023" },
      { label: "Frame", value: "Included" },
   ],
   description:
      "A historical canvas depicting the pivotal moment of the Battle of Khotyn (1621). The artist masterfully uses light and dynamic composition to convey the drama and valor of the conflict, focusing on the human element amidst the chaos of war.",
   shipping:
      "Standard shipping worldwide. Estimated delivery: 7-14 business days. Free returns within 30 days.",
   provenance:
      "Acquired directly from the artist's studio. First exhibited at the Kyiv National Art Gallery in 2024. Certified authentic by the Art Historians Association.",
};

export const mockRelatedArtworks = [
   {
      id: "rel1",
      title: "The Charge",
      price: 2100,
      artistName: "Kira V.",
      imageUrl: "https://placehold.co/300x400/1e40af/93c5fd?text=Related+Art+1",
   },
   {
      id: "rel2",
      title: "Winter Camp",
      price: 4500,
      artistName: "S. Chen",
      imageUrl: "https://placehold.co/300x400/059669/d1fae5?text=Related+Art+2",
   },
   {
      id: "rel3",
      title: "Sentinel",
      price: 1800,
      artistName: "J. Smith",
      imageUrl: "https://placehold.co/300x400/991b1b/fca5a5?text=Related+Art+3",
   },
   {
      id: "rel4",
      title: "River Crossing",
      price: 5900,
      artistName: "M. Lopez",
      imageUrl: "https://placehold.co/300x400/f59e0b/fef3c7?text=Related+Art+4",
   },
];

export const mockCartItem = {
   id: "khotyn1621",
   title: "Battle of Khotyn, 1621 (Original)",
   artist: "Volodymyr Badiuk",
   price: 9800,
   quantity: 1,
   imageUrl: "https://placehold.co/100x120/374151/f3f4f6?text=Art",
};

export const mockSummary = {
   subtotal: 9800,
   shippingCost: 150,
   tax: 0,
   total: 9950,
};

export const countryOptions = [
   { label: "Select Country", value: "" },
   { label: "United States", value: "US" },
   { label: "Canada", value: "CA" },
   { label: "Ukraine", value: "UA" },
];
