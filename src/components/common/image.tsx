'use client'
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
   className?: string;
   ref?: React.RefObject<HTMLImageElement>;
}

const Image: React.FC<ImageProps> = ({ src, alt, className, ...props }) => {
   const [loaded, setLoaded] = useState(true);

   return (
      <div className={cn("relative w-full h-full", className)}>
         {!loaded && (
            <Skeleton className="absolute top-0 left-0 h-full w-full" />
         )}
         <img
            ref={props.ref as any}
            src={src}
            alt={alt}
            // onLoad={() => setLoaded(true)}
            className={`w-full h-full object-cover transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"}`}
            {...props}
         />
      </div>
   );
};

export default Image;
