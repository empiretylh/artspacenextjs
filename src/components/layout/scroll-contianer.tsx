'use client'

import React, { useEffect, useRef } from 'react'
import { SiteHeader } from './site-header'
import MainOutlet from './main-outlet'
import Footer from './footer'
import { analyticSourceFromPathname, scrollAnalytics } from '@/lib/analytics'
import { usePathname } from 'next/navigation'
import { SourceProvider } from '@/lib/analytics-source'
import { ScrollArea } from '../ui/scroll-area'

const ScrollContainer = ({ children }: { children: React.ReactNode }) => {

  const ref = useRef<HTMLDivElement | null>(null);
  const pathname = usePathname()

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    console.log(pathname)

    let fired = false;

    const onScroll = () => {
      if (fired) return;

      const maxScroll = el.scrollHeight - el.clientHeight;
      if (maxScroll <= 0) return;

      const progress = el.scrollTop / maxScroll;
      if (progress >= 0.9) {
        fired = true;
        console.log("reached end")
        // GA4 event (gtag). If you use GTM, you’d push to dataLayer instead.
        scrollAnalytics.scrollToEnd({ scrollPercent: progress * 100 });
      }
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [pathname]);

  const source = analyticSourceFromPathname(pathname);


  return (
    <ScrollArea 
      viewportRef={ref}
      viewportId="scroll-container"
      className='h-screen overflow-y-auto [&>[data-slot=scroll-area-viewport]>div]:!block'
    >
      <SourceProvider value={{ source }}>
        <div className="min-h-full flex flex-col justify-between">
          <SiteHeader />
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
