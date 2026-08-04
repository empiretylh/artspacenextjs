'use client'

import React, { useEffect, useRef, useState } from 'react'
import { SiteHeader } from './site-header'
import MainOutlet from './main-outlet'
import Footer from './footer'
import { analyticSourceFromPathname, scrollAnalytics } from '@/lib/analytics'
import { usePathname } from 'next/navigation'
import { SourceProvider } from '@/lib/analytics-source'
import { ScrollArea } from '../ui/scroll-area'


const ScrollContainer = ({ children, header }: { children: React.ReactNode; header?: React.ReactNode }) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const dimensionsRef = useRef({ scrollHeight: 0, clientHeight: 0 });
  const pathname = usePathname()
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsTouchDevice(window.matchMedia("(pointer: coarse)").matches);
    }
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Initialize dimensions
    dimensionsRef.current = {
      scrollHeight: el.scrollHeight,
      clientHeight: el.clientHeight
    };

    // Update dimensions on resize to avoid reading them on scroll
    const resizeObserver = new ResizeObserver(() => {
      dimensionsRef.current = {
        scrollHeight: el.scrollHeight,
        clientHeight: el.clientHeight
      };
    });

    resizeObserver.observe(el);
    const contentEl = el.firstElementChild;
    if (contentEl) {
      resizeObserver.observe(contentEl);
    }

    let fired = false;
    let ticking = false;
    let lastScrollHeight = el.scrollHeight;

    const onScroll = () => {
      if (ticking) return;

      ticking = true;

      requestAnimationFrame(() => {
        const { scrollHeight, clientHeight } = dimensionsRef.current;

        // Reset fired flag if content height has grown (e.g., due to lazy-loaded sections rendering)
        if (scrollHeight > lastScrollHeight) {
          fired = false;
          lastScrollHeight = scrollHeight;
        }

        const maxScroll = scrollHeight - clientHeight;

        if (maxScroll <= 0) {
          ticking = false;
          return;
        }

        const progress = el.scrollTop / maxScroll;
        if (progress >= 0.9) {
          if (!fired) {
            fired = true;
            console.log('reach end')
            scrollAnalytics.scrollToEnd({ scrollPercent: progress * 100 });
          }
        }
        ticking = false;
      });
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      resizeObserver.disconnect();
    };
  }, [pathname, isTouchDevice]);

  const source = analyticSourceFromPathname(pathname);

  if (isTouchDevice) {
    return (
      <div
        ref={ref}
        id="scroll-container"
        className="h-screen overflow-y-auto scroll-smooth select-none"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        <SourceProvider value={{ source }}>
          <div className="min-h-full flex flex-col justify-between">
            {header || <SiteHeader />}
            <MainOutlet>
              {children}
            </MainOutlet>
            <Footer />
          </div>
        </SourceProvider>
      </div>
    );
  }

  return (
    <ScrollArea
      viewportRef={ref}
      viewportId="scroll-container"
      className='h-screen overflow-hidden [&>[data-slot=scroll-area-viewport]>div]:!block'
    >
      <SourceProvider value={{ source }}>
        <div className="min-h-full flex flex-col justify-between">
          {header || <SiteHeader />}
          <MainOutlet>
            {children}
          </MainOutlet>
          <Footer />
        </div>
      </SourceProvider>
    </ScrollArea>
  )
}

export default ScrollContainer

