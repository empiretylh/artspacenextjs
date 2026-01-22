'use client';

import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { Calendar, Clock, MapPin, Users } from 'lucide-react';

interface Event {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  date: string;
  time: string;
  location: string;
  address: string;
  imageUrl: string;
  price: number;
  capacity: number;
  organizer: string;
}

interface EventDetailProps {
  eventId: string;
}

export function EventDetail({ eventId }: EventDetailProps) {
  const { data: event, isLoading } = useQuery<Event>({
    queryKey: ['event', eventId],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return {
        id: eventId,
        title: 'Art Exhibition: Modern Masters',
        description: 'A showcase of contemporary art from emerging artists',
        longDescription: 'Join us for an exclusive exhibition featuring works from the most promising contemporary artists of our time. This event will showcase a diverse range of styles and mediums, including paintings, sculptures, and digital art. Meet the artists, enjoy live music, and experience the vibrant art scene.',
        date: '2023-12-15',
        time: '18:00',
        location: 'Downtown Art Gallery',
        address: '123 Art Street, Creative District, 10001',
        imageUrl: '/placeholder-event.jpg',
        price: 25,
        capacity: 150,
        organizer: 'Art Space Collective',
      };
    },
  });

  if (isLoading || !event) {
    return (
      <div className="container mx-auto py-8">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="aspect-video">
            <div className="h-full w-full animate-pulse bg-muted" />
          </div>
          <div className="space-y-4">
            <div className="h-10 w-3/4 animate-pulse bg-muted" />
            <div className="h-6 w-1/2 animate-pulse bg-muted" />
            <div className="space-y-2">
              {Array(4).fill(0).map((_, i) => (
                <div key={i} className="h-4 w-full animate-pulse bg-muted" />
              ))}
            </div>
            <div className="pt-4">
              <div className="h-12 w-48 animate-pulse bg-muted" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const eventDate = new Date(event.date);
  
  return (
    <div className="container mx-auto py-8">
      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-6">
          <div className="overflow-hidden rounded-lg">
            <div className="relative aspect-video">
              <Image
                src={event.imageUrl}
                alt={event.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">About This Event</h2>
            <p className="text-muted-foreground">{event.longDescription}</p>
            
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Organizer</h3>
              <p className="text-muted-foreground">{event.organizer}</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-lg border p-6">
            <h1 className="mb-2 text-3xl font-bold">{event.title}</h1>
            <p className="mb-6 text-muted-foreground">{event.description}</p>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Calendar className="mt-0.5 h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Date & Time</p>
                  <p className="text-muted-foreground">
                    {eventDate.toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                    <br />
                    {event.time} - {event.time.split(':')[0] + 2}:00
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Location</p>
                  <p className="text-muted-foreground">
                    {event.location}
                    <br />
                    {event.address}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Users className="mt-0.5 h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Capacity</p>
                  <p className="text-muted-foreground">
                    {event.capacity} attendees
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-8 space-y-4">
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-bold">${event.price}</span>
                <span className="text-muted-foreground">per person</span>
              </div>
              
              <Button className="w-full" size="lg">
                Get Tickets
              </Button>
              
              <p className="text-center text-sm text-muted-foreground">
                Free cancellation up to 24 hours before the event
              </p>
            </div>
          </div>
          
          <div className="rounded-lg border p-6">
            <h3 className="mb-4 text-lg font-semibold">Share with friends</h3>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                Twitter
              </Button>
              <Button variant="outline" size="sm">
                Facebook
              </Button>
              <Button variant="outline" size="sm">
                Copy Link
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
