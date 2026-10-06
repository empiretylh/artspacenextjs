import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function InputWithLeftSelectSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex justify-center items-center shadow-xs border border-input bg-background gap-2 rounded-full p-1 w-fit",
        className
      )}
    >
      {/* Select Trigger Skeleton */}
      <Skeleton className="h-10 w-20 md:w-24 rounded-full" />

      {/* Input Field Skeleton */}
      <Skeleton className="h-9 w-full min-w-0 md:w-[280px] lg:w-[350px] rounded-full" />

      {/* Button Skeleton */}
      <Skeleton className="h-10 w-10 md:w-12 rounded-full" />
    </div>
  );
}
