'use client'
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import React, { useState } from "react";

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
   className?: string;
}

const Image = React.forwardRef<HTMLImageElement, ImageProps>(
   ({ src, alt, className, ...props }, ref) => {
      const [loaded, setLoaded] = useState(true);

      return (
         <div className={cn("relative w-full h-full", className)}>
            {!loaded && (
               <Skeleton className="absolute top-0 left-0 h-full w-full" />
            )}
            <img
               ref={ref}
               src={src}
               alt={alt}
               // onLoad={() => setLoaded(true)}
               className={`w-full h-full object-cover transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"}`}
               {...props}
            />
         </div>
      );
   }
);

Image.displayName = "Image";

export default Image;
