import type { Artwork } from "@/types";
import { v4 as uuidv4 } from "uuid";

export type Category = {
   id: string;
   name: string;
};

const ARTISTS = [
   "Alice Smith",
   "John Doe",
   "Maya Lin",
   "David Hockney",
   "Emma Brown",
];
const CATEGORIES = [
   "Abstract",
   "Portrait",
   "Landscape",
   "Still Life",
   "Modern",
];
const MEDIUMS = ["Oil on Canvas", "Acrylic", "Watercolor", "Ink", "Digital"];
const TITLES = [
   "Sunset Dreams",
   "Morning Glow",
   "Hidden Truths",
   "Reflections",
   "Ethereal",
];
const DIMENSIONS = [
   "30x40 cm",
   "50x70 cm",
   "100x120 cm",
   "20x30 cm",
   "60x80 cm",
];
const DESCRIPTIONS = [
   "A captivating piece that explores light and shadow.",
   "Evokes deep emotions through bold colors.",
   "An experimental artwork with modern techniques.",
   "A delicate balance of form and texture.",
   "Inspired by nature and urban landscapes.",
];
const IMAGES = [
   "https://picsum.photos/seed/art1/400/300",
   "https://picsum.photos/seed/art2/400/300",
   "https://picsum.photos/seed/art3/400/300",
   "https://picsum.photos/seed/art4/400/300",
   "https://picsum.photos/seed/art5/400/300",
];

export function generateFakeArtwork(): Artwork {
   const artist = ARTISTS[Math.floor(Math.random() * ARTISTS.length)];
   const category = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
   const medium = MEDIUMS[Math.floor(Math.random() * MEDIUMS.length)];
   const title = TITLES[Math.floor(Math.random() * TITLES.length)];
   const dimensions = DIMENSIONS[Math.floor(Math.random() * DIMENSIONS.length)];
   const description =
      DESCRIPTIONS[Math.floor(Math.random() * DESCRIPTIONS.length)];
   const image = IMAGES[Math.floor(Math.random() * IMAGES.length)];
   const year = Math.floor(Math.random() * 123) + 1900; // Year between 1900 - 2022
   const price = Math.floor(Math.random() * 9000) + 1000; // Price between 1000 - 10000
   const now = new Date().toISOString();

   return {
      id: uuidv4(),
      artist_name: artist,
      category_name: category,
      category_id: Math.floor(Math.random() * CATEGORIES.length) + 1, // Generate a random category ID
      image,
      title,
      description,
      price: String(price),
      medium,
      dimensions,
      year,
      status: "AVAILABLE",
      created_at: now,
      updated_at: now,
   };
}

// Example: generate 5 artworks
export const fakeArtworks: Artwork[] = Array.from({ length: 5 }, () =>
   generateFakeArtwork()
);
