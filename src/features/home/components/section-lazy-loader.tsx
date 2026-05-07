'use client'
import React, { ReactNode } from "react";
import { useInView } from "react-intersection-observer";

interface SectionLazyLoaderProps {
   children: ReactNode;
   skeleton?: ReactNode;
   rootMargin?: string;
   triggerOnce?: boolean;
}

/**
 * SectionLazyLoader defers the rendering of its children until they enter the viewport.
 * This is useful for improving initial page load performance by reducing the number
 * of components and Swiper instances initialized at once.
 */
export const SectionLazyLoader = ({
   children,
   skeleton,
   rootMargin = "200px 0px",
   triggerOnce = true,
}: SectionLazyLoaderProps) => {
   const { ref, inView } = useInView({
      triggerOnce,
      rootMargin,
   });

   return (
      <div ref={ref} className="min-h-[200px]">
         {inView ? children : skeleton}
      </div>
   );
};
