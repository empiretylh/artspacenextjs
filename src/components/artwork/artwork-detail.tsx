'use client';

import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';

interface Artwork {
  id: string;
  title: string;
  artist: string;
  description: string;
  price: number;
  imageUrl: string;
  dimensions: string;
  year: number;
  medium: string;
}

interface ArtworkDetailProps {
  artworkId: string;
}

export function ArtworkDetail({ artworkId }: ArtworkDetailProps) {
  const { data: artwork, isLoading } = useQuery<Artwork>({
    queryKey: ['artwork', artworkId],
    queryFn: async () => {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      return {
        id: artworkId,
        title: 'Sample Artwork',
        artist: 'Sample Artist',
        description: 'This is a sample artwork description.',
        price: 1000,
        imageUrl: '/placeholder.jpg',
        dimensions: '24 x 36 in',
        year: 2023,
        medium: 'Oil on canvas',
      };
    },
  });

  if (isLoading || !artwork) {
    return (
      <div className="container mx-auto py-8">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="aspect-square">
            <div className="h-full w-full animate-pulse bg-muted" />
          </div>
          <div className="space-y-4">
            <div className="h-8 w-3/4 animate-pulse bg-muted" />
            <div className="h-6 w-1/2 animate-pulse bg-muted" />
            <div className="h-4 w-full animate-pulse bg-muted" />
            <div className="h-4 w-5/6 animate-pulse bg-muted" />
            <div className="h-4 w-4/6 animate-pulse bg-muted" />
            <div className="pt-4">
              <div className="h-10 w-32 animate-pulse bg-muted" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="grid gap-8 md:grid-cols-2">
        <div className="relative aspect-square">
          <Image
            src={artwork.imageUrl}
            alt={artwork.title}
            fill
            className="rounded-lg object-cover"
            priority
          />
        </div>
        <div>
          <h1 className="mb-2 text-3xl font-bold">{artwork.title}</h1>
          <p className="mb-6 text-lg text-muted-foreground">{artwork.artist}</p>
          
          <div className="mb-6 space-y-2">
            <p className="text-2xl font-semibold">${artwork.price.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">
              {artwork.medium}, {artwork.year}
            </p>
            <p className="text-sm text-muted-foreground">{artwork.dimensions}</p>
          </div>

          <p className="mb-6 text-muted-foreground">{artwork.description}</p>

          <div className="flex gap-4">
            <Button size="lg" className="flex-1">
              Add to Cart
            </Button>
            <Button size="lg" variant="outline" className="flex-1">
              Save for Later
            </Button>
          </div>

          <div className="mt-8 space-y-4 border-t pt-6">
            <div>
              <h3 className="font-medium">Shipping</h3>
              <p className="text-sm text-muted-foreground">
                Free shipping on all orders. Delivery within 5-7 business days.
              </p>
            </div>
            <div>
              <h3 className="font-medium">Returns</h3>
              <p className="text-sm text-muted-foreground">
                30-day return policy. Contact us for more information.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
