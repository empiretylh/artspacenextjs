'use client';

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import Link from 'next/link';

interface Artwork {
  id: string;
  title: string;
  artist: string;
  price: number;
  imageUrl: string;
}

export function ArtworkList() {
  const { data: artworks, isLoading } = useQuery<Artwork[]>({
    queryKey: ['artworks'],
    queryFn: async () => {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      return [];
    },
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <Skeleton className="h-48 w-full" />
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
          </Card>
        ))}
      </div>
    );
  }

  if (!artworks?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <h3 className="text-lg font-medium">No artworks found</h3>
        <p className="text-muted-foreground text-sm">Check back later for new additions</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {artworks.map((artwork) => (
        <Link key={artwork.id} href={`/artworks/${artwork.id}`}>
          <Card className="h-full overflow-hidden transition-shadow hover:shadow-md">
            <div className="relative aspect-square">
              <Image
                src={artwork.imageUrl}
                alt={artwork.title}
                fill
                className="object-cover"
              />
            </div>
            <CardHeader>
              <CardTitle className="text-lg">{artwork.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">{artwork.artist}</p>
            </CardContent>
            <CardFooter>
              <p className="font-medium">${artwork.price.toFixed(2)}</p>
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  );
}
