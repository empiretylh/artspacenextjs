import { Skeleton } from "@/components/ui/skeleton";

export default function ArtworkOrderLoading() {
  return (
    <div className="min-h-screen w-full bg-background flex flex-col">
      {/* 1. Minimal Header Skeleton */}
      <header className="sticky top-0 z-30 w-full border-b border-border/60 bg-background/95 backdrop-blur-md shrink-0">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 sm:gap-6">
            <div className="flex items-center gap-2.5">
              <Skeleton className="size-7 rounded-md" />
              <Skeleton className="h-5 w-24" />
            </div>
            <div className="h-4 w-px bg-border/60 hidden sm:block" />
            <Skeleton className="h-4 w-28 hidden sm:block" />
          </div>

          <div className="flex items-center gap-3">
            <Skeleton className="h-7 w-32 rounded-full" />
            <Skeleton className="size-9 rounded-full" />
          </div>
        </div>
      </header>

      {/* 2. Mobile Summary Skeleton Bar (Hidden on desktop) */}
      <div className="lg:hidden border-b border-border/60 bg-muted/30 px-4 sm:px-6 py-3.5 flex items-center justify-between">
        <Skeleton className="h-4 w-36" />
        <Skeleton className="h-5 w-24" />
      </div>

      {/* 3. Split-Screen Main Content Skeletons */}
      <div className="flex-1 w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 min-h-0">
        {/* Left Column (7 cols): Form Skeleton */}
        <div className="lg:col-span-7 px-4 sm:px-8 lg:px-10 xl:px-12 py-8 sm:py-10 flex justify-center lg:justify-end">
          <div className="w-full max-w-[560px] space-y-6">
            <div className="space-y-2">
              <Skeleton className="h-8 w-56" />
              <Skeleton className="h-4 w-80 max-w-full" />
            </div>

            <div className="space-y-4 pt-2">
              {/* Full Name */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-11 w-full rounded-md" />
              </div>

              {/* Phone & City */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-11 w-full rounded-md" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-11 w-full rounded-md" />
                </div>
              </div>

              {/* Street Address */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-24 w-full rounded-md" />
              </div>

              {/* Delivery Instructions */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-36" />
                  <Skeleton className="h-3 w-14" />
                </div>
                <Skeleton className="h-18 w-full rounded-md" />
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <Skeleton className="h-11 w-full rounded-md" />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Tinted Summary Rail Skeleton (Desktop) */}
        <div className="lg:col-span-5 bg-muted/30 border-t lg:border-t-0 lg:border-l border-border/60 px-4 sm:px-8 lg:px-10 py-8 sm:py-10 flex flex-col">
          <div className="w-full max-w-[420px] mx-auto lg:mx-0 space-y-6 lg:sticky lg:top-24">
            <Skeleton className="h-5 w-32" />

            {/* Artwork Preview Card Skeleton */}
            <div className="flex gap-4 items-start p-3.5 rounded-xl bg-background/80 border border-border/60">
              <Skeleton className="size-20 shrink-0 rounded-lg" />
              <div className="space-y-2 flex-1 min-w-0">
                <Skeleton className="h-5 w-44" />
                <Skeleton className="h-3 w-28" />
                <div className="flex gap-2 pt-1">
                  <Skeleton className="h-4 w-16 rounded" />
                  <Skeleton className="h-4 w-20 rounded" />
                </div>
              </div>
            </div>

            {/* Price Breakdown Skeleton */}
            <div className="space-y-3 pt-2">
              <div className="flex justify-between items-center">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-20" />
              </div>
              <div className="flex justify-between items-center">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-16" />
              </div>
              <div className="border-t border-border/60 pt-3 flex justify-between items-center">
                <Skeleton className="h-5 w-28" />
                <Skeleton className="h-6 w-24" />
              </div>
            </div>

            {/* Authenticity & Care Guarantee Skeleton */}
            <div className="p-4 rounded-xl border border-border/60 bg-background/60 space-y-3">
              <div className="flex items-center gap-2.5">
                <Skeleton className="size-4 rounded-full shrink-0" />
                <Skeleton className="h-3.5 w-56" />
              </div>
              <div className="flex items-center gap-2.5">
                <Skeleton className="size-4 rounded-full shrink-0" />
                <Skeleton className="h-3.5 w-64" />
              </div>
              <div className="flex items-center gap-2.5">
                <Skeleton className="size-4 rounded-full shrink-0" />
                <Skeleton className="h-3.5 w-56" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
