"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import Cookies from "js-cookie";
import { motion } from "framer-motion";
import AppImage from "@/components/common/app-image";
import { getImage } from "@/lib/utils";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { useAuth } from "@/features/auth/store";
import Footer from "@/components/layout/footer";

type Banner = {
  id: number;
  title: string;
  link: string;
  image: string;
  image_mobile: string;
  image_desktop: string;
  is_active: boolean;
};

interface Props {
  banner: Banner | null;
  locale: string;
}

export default function LandingPageView({ banner, locale }: Props) {
  const t = useTranslations("Landing");
  const router = useRouter();
  const { user } = useAuth();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const lastScrollTopRef = useRef(0);
  const viewportRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const handleScroll = () => {
      const scrollTop = viewport.scrollTop;
      const headerElement = headerRef.current;
      const threshold = headerElement ? headerElement.offsetHeight : 100;

      if (scrollTop <= threshold) {
        setIsHeaderVisible(true);
      } else {
        if (scrollTop > lastScrollTopRef.current) {
          setIsHeaderVisible(false);
        } else {
          setIsHeaderVisible(true);
        }
      }
      lastScrollTopRef.current = scrollTop;
    };

    viewport.addEventListener("scroll", handleScroll, { passive: true });
    return () => viewport.removeEventListener("scroll", handleScroll);
  }, []);

  const handleExploreMore = () => {
    Cookies.set("artspace_explored", "true", { expires: 30 });
    router.push("/home");
  };

  const handleCreateAcc = () => {
    Cookies.set("artspace_explored", "true", { expires: 30 });
    router.push("/sign-up");
  };

  return (
    <ScrollArea viewportRef={viewportRef} className="h-screen w-full bg-background text-foreground font-sans">
      
      <motion.header 
         ref={headerRef}
         initial={{ y: 0 }}
         animate={{ y: isHeaderVisible ? 0 : "-100%" }}
         transition={{ duration: 0.3, ease: "easeInOut" }}
         className="sticky top-0 z-50 w-full flex items-center justify-between px-6 md:px-12 py-6 md:py-8 bg-background border-b-2 border-border/60"
      >
        <div className="flex items-center gap-3">
            <span className="uppercase font-display font-semibold text-base sm:text-lg tracking-widest">
                Myanmar Art Space
            </span>
        </div>
        <div className="flex items-center gap-3 sm:gap-6 text-sm">
          {!user && (
            <button 
               onClick={handleCreateAcc}
               className="hidden sm:block text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors font-medium cursor-pointer"
            >
               {t("createAccountButton")}
            </button>
          )}
          <button 
             onClick={handleExploreMore}
             className="hidden sm:block text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors font-medium cursor-pointer"
          >
             {t("exploreButton")}
          </button>
          <div className="hidden sm:flex items-center gap-4">
            <LanguageSwitcher />
            <ThemeSwitcher />
          </div>

          {/* Mobile Navigation Drawer */}
          <div className="sm:hidden flex items-center">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 p-0 cursor-pointer"
                  aria-label="Open menu"
                >
                  <Menu className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] p-6 flex flex-col justify-between">
                <div>
                  <SheetHeader className="p-0 mb-6 text-left">
                    <SheetTitle className="font-display uppercase tracking-widest text-base font-semibold">
                      Myanmar Art Space
                    </SheetTitle>
                    <SheetDescription className="text-xs text-muted-foreground">
                      {t("welcome")}
                    </SheetDescription>
                  </SheetHeader>

                  <div className="flex flex-col gap-3 py-4 border-t border-border/40">
                    <Button
                      variant="default"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        handleExploreMore();
                      }}
                      className="w-full justify-center text-xs uppercase tracking-widest h-11 cursor-pointer"
                    >
                      {t("exploreButton")}
                    </Button>

                    {!user && (
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          handleCreateAcc();
                        }}
                        className="w-full justify-center text-xs uppercase tracking-widest h-11 cursor-pointer"
                      >
                        {t("createAccountButton")}
                      </Button>
                    )}
                  </div>
                </div>

                <div className="pt-6 border-t border-border/40 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
                      Language
                    </span>
                    <LanguageSwitcher />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
                      Theme
                    </span>
                    <ThemeSwitcher />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </motion.header>

      <main className="max-w-[1600px] mx-auto px-6 md:px-12">
        {/* Banner Section - 8:3 Ratio */}
        <section className="pt-4 pb-16 md:pt-6 md:pb-24">
            {banner ? (
                <motion.div 
                    initial={{ opacity: 0, scale: 0.98 }} 
                    whileInView={{ opacity: 1, scale: 1 }} 
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="relative w-full aspect-[4/3] md:aspect-[8/3] overflow-hidden rounded-sm"
                >
                    <>
                        <AppImage
                            src={getImage(banner.image_desktop || banner.image)}
                            alt={banner.title}
                            fill
                            priority
                            sizes="100vw"
                            className="object-cover"
                            containerClassName="hidden md:block"
                        />
                        <AppImage
                            src={getImage(banner.image_mobile || banner.image)}
                            alt={banner.title}
                            fill
                            priority
                            sizes="100vw"
                            className="object-cover"
                            containerClassName="block md:hidden"
                        />
                    </>
                </motion.div>
            ) : (
                <div className="relative w-full aspect-[4/3] md:aspect-[8/3] bg-secondary/30 rounded-sm" />
            )}
        </section>

        {/* Welcome Typography Section */}
        <section className="pb-16 md:pb-32 text-center max-w-5xl mx-auto space-y-6 md:space-y-8">
            <motion.h2 
                initial={{ opacity: 0, y: 30 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="text-xs md:text-sm uppercase tracking-widest text-muted-foreground"
            >
                {t("welcome")}
            </motion.h2>
            <motion.h1 
                initial={{ opacity: 0, y: 30 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
                className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-medium leading-[1.1] tracking-tight text-balance"
            >
                {t("welcomeSubtitle")}
            </motion.h1>
        </section>

        {/* Editorial Text Block: What is MAS */}
        <section className="py-16 md:py-40 border-t border-border/40">
            <div className="max-w-4xl mx-auto text-center space-y-8 md:space-y-10">
                <motion.h2 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight"
                >
                    {t("whatIsMas")}
                </motion.h2>
                <motion.div 
                    initial={{ opacity: 0, scaleX: 0 }}
                    whileInView={{ opacity: 1, scaleX: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
                    className="w-16 h-[1px] bg-foreground/30 mx-auto" 
                />
                <motion.p 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
                    className="text-base sm:text-lg md:text-xl lg:text-2xl font-light leading-relaxed text-foreground/80 text-balance"
                >
                    {t("whatIsMasContent")}
                </motion.p>
            </div>
        </section>

        {/* Trilogy Space - Gallery Grid Style */}
        <section className="py-16 md:py-32 border-t border-border/40">
            <div className="mb-16 md:mb-20 max-w-4xl space-y-6">
                <motion.h2 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight"
                >
                    {t("trilogyTitle")}
                </motion.h2>
                <motion.p 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
                    className="text-base sm:text-lg md:text-xl lg:text-2xl font-light text-muted-foreground leading-relaxed text-balance"
                >
                    {t("trilogyContent")}
                </motion.p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-10">
                {[
                    { title: t("pillars.artistsTitle"), desc: t("pillars.artistsDesc") },
                    { title: t("pillars.galleriesTitle"), desc: t("pillars.galleriesDesc") },
                    { title: t("pillars.collectorsTitle"), desc: t("pillars.collectorsDesc") }
                ].map((pillar, i) => (
                    <motion.div 
                        key={i} 
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.7, delay: 0.1 + (i * 0.15), ease: "easeOut" }}
                        className="space-y-4 md:space-y-5"
                    >
                        <div className="w-12 h-[1px] bg-foreground/20 mb-6 md:mb-8" />
                        <h3 className="font-display text-xl md:text-2xl lg:text-3xl font-medium">{pillar.title}</h3>
                        <p className="font-light text-muted-foreground leading-relaxed text-base md:text-lg">{pillar.desc}</p>
                    </motion.div>
                ))}
            </div>
        </section>

        {/* The Mission Block */}
        <section className="py-16 md:py-40 border-t border-border/40">
            <div className="max-w-4xl mx-auto text-center space-y-8 md:space-y-10">
                <motion.h2 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight"
                >
                    {t("missionTitle")}
                </motion.h2>
                <motion.div 
                    initial={{ opacity: 0, scaleX: 0 }}
                    whileInView={{ opacity: 1, scaleX: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
                    className="w-16 h-[1px] bg-foreground/30 mx-auto" 
                />
                <motion.p 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
                    className="text-base sm:text-lg md:text-xl lg:text-2xl font-light leading-relaxed text-foreground/80 text-balance"
                >
                    {t("missionContent")}
                </motion.p>
            </div>
        </section>

        {/* Dedicated CTA Section */}
        <section className="py-16 md:py-40 bg-secondary/10 border border-border/20 mb-12 rounded-3xl mx-auto">
            <div className="max-w-3xl mx-auto text-center space-y-8 md:space-y-10 px-6 md:px-12">
                <motion.h2 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight"
                >
                    {t("createAccountTitle")}
                </motion.h2>
                <motion.p 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
                    className="text-base sm:text-lg md:text-xl lg:text-2xl font-light leading-relaxed text-foreground/80 text-balance px-4 md:px-0"
                >
                    {t("createAccountContent")}
                </motion.p>
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                    className="pt-6 md:pt-8 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 w-full max-w-sm sm:max-w-none mx-auto"
                >
                     {!user && (
                         <Button 
                            size="lg"
                            onClick={handleCreateAcc}
                            className="rounded-sm px-10 h-12 md:h-14 text-sm uppercase tracking-widest w-full sm:w-auto cursor-pointer"
                        >
                            {t("createAccountButton")}
                        </Button>
                     )}
                     <Button 
                        variant={user ? "default" : "outline"}
                        size="lg"
                        onClick={handleExploreMore}
                        className="rounded-sm px-10 h-12 md:h-14 text-sm uppercase tracking-widest w-full sm:w-auto cursor-pointer"
                     >
                        {t("exploreButton")}
                     </Button>
                </motion.div>
            </div>
        </section>
      </main>
      <Footer 
         className="mt-16 md:mt-24" 
         contentClassName="max-w-[1600px] px-6 md:px-12 py-20 md:py-28 gap-16 md:gap-24" 
         columnClassName="space-y-6"
         listClassName="space-y-4 text-[15px]"
      />
    </ScrollArea>
  );
}
