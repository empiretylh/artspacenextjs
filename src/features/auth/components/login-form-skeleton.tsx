"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function LoginFormSkeleton() {
  return (
    <div>
      {/* Title */}
      <Skeleton className="h-6 w-40 mx-auto mb-2" />
      <Skeleton className="h-4 w-56 mx-auto mb-6" />

      {/* Info / message placeholder */}
      <Skeleton className="h-10 w-full mb-3 rounded" />

      {/* Form */}
      <div className="space-y-4">
        {/* Email input */}
        <Skeleton className="h-10 w-full rounded" />

        {/* Password input */}
        <Skeleton className="h-10 w-full rounded" />

        {/* Submit button */}
        <Skeleton className="h-10 w-full rounded" />

        {/* Footer text */}
        <Skeleton className="h-4 w-48 mx-auto" />
      </div>
    </div>
  );
}
