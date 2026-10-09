import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function ArtworkOrderLoading() {
  return (
    <div className="container">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Top Back Link */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-4 w-36" />
        </div>

        {/* Page Header */}
        <div className="space-y-2">
          <Skeleton className="h-8 w-60" />
          <Skeleton className="h-4 w-96 max-w-full" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Form Skeleton */}
          <div className="lg:col-span-7 space-y-6">
            <Card className="border border-border/60 shadow-xs">
              <CardHeader className="pb-4">
                <Skeleton className="h-6 w-44" />
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Full Name */}
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-10 w-full" />
                </div>

                {/* Phone & City */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </div>

                {/* Street Address */}
                <div className="space-y-2">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-24 w-full" />
                </div>

                {/* Delivery Instructions */}
                <div className="space-y-2">
                  <Skeleton className="h-4 w-36" />
                  <Skeleton className="h-16 w-full" />
                </div>

                {/* Submit Button */}
                <Skeleton className="h-11 w-full rounded-md" />
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Order Summary Skeleton */}
          <div className="lg:col-span-5 space-y-4">
            <Card className="border border-border/60 shadow-xs overflow-hidden">
              <CardHeader className="bg-muted/30 pb-4 border-b border-border/50">
                <Skeleton className="h-5 w-32" />
              </CardHeader>
              <CardContent className="pt-4 space-y-5">
                <div className="flex gap-4 items-center">
                  <Skeleton className="h-20 w-20 shrink-0 rounded-lg" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-5 w-40" />
                    <Skeleton className="h-3 w-24" />
                    <div className="flex gap-2 pt-1">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                  </div>
                </div>

                <div className="border-t border-border/50 pt-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <div className="border-t border-border/50 pt-3 flex justify-between items-center">
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-6 w-28" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Trust Badges */}
            <div className="p-4 rounded-xl border border-border/50 bg-muted/20 space-y-3">
              <div className="flex items-center gap-2.5">
                <Skeleton className="h-4 w-4 rounded-full" />
                <Skeleton className="h-3 w-56" />
              </div>
              <div className="flex items-center gap-2.5">
                <Skeleton className="h-4 w-4 rounded-full" />
                <Skeleton className="h-3 w-64" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
