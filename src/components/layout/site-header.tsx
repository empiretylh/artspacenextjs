'use client'
import { Button } from "@/components/ui/button";
import { paths } from "@/config/paths";
import ArtworkCreateModal from "@/features/artwork/components/artwork-create-modal";
import { useAuth } from "@/features/auth/store";
import { cn } from "@/lib/utils";
import AppImage from "@/components/common/app-image";
import {
   ArrowLeft,
   Search,
   Plus
} from "lucide-react";
import { Suspense, useState } from "react";
import { InputWithLeftSelectSkeleton } from "../app/input-with-left-select-skeleton";
import { InputWithLeftSelect } from "../app/input-with-left-seletct";
import { ProfileDropdown } from "../app/profile-dropdown";
import Link from "../common/link";
import { ThemeSwitcher } from "../theme-switcher";
import { LanguageSwitcher } from "./language-switcher";
import { SidebarTrigger } from "../ui/sidebar";
import { SourceProvider } from "@/lib/analytics-source";
import { useTranslations, useLocale } from "next-intl";
import { NotificationDropdown } from "@/features/notifications";

export function SiteHeader() {
   const t = useTranslations("Header");
   const locale = useLocale();
   const isMy = locale === "my";

   const [isArtworkCreateModalOpen, setIsArtworkCreateModalOpen] =
      useState(false);
   const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
   const handleMobileSearchOpen = () => setMobileSearchOpen(true);
   const handleMobileSearchClose = () => setMobileSearchOpen(false);
   const { user } = useAuth();
   const isLoggedIn = !!user;

   return (
      <SourceProvider value={{ source: "header" }}>
         <header className="bg-background sticky top-0 py-4 z-50 flex h-[var(--header-height)] items-center px-2 lg:px-4">
            {/* Mobile Search Mode */}
            {mobileSearchOpen ? (
               <div className="flex w-full items-center gap-2">
                  <Button
                     onClick={handleMobileSearchClose}
                     variant="ghost"
                     className="h-10 w-10 p-0"
                     aria-label={t("search")}
                  >
                     <ArrowLeft className="size-6" />
                  </Button>
                  <Suspense fallback={<InputWithLeftSelectSkeleton />}>
                     <InputWithLeftSelect className="flex-1" />
                  </Suspense>
               </div>
            ) : (
               <div className="flex w-full items-center justify-between gap-2">
                  {/* Left Section (Logo + Sidebar Trigger) */}
                  <div className="flex gap-2 items-center md:hidden shrink-0">
                     <SidebarTrigger className="-ml-1 shrink-0" />
                     <Link
                        to={"/"}
                        className="flex items-center shrink-0 hover:opacity-90 transition-opacity"
                        aria-label={t("title")}
                     >
                        <AppImage
                           src="/assets/logo.png"
                           alt="Logo"
                           width={32}
                           height={32}
                           className="size-8 object-contain shrink-0"
                           withoutContainer={true}
                           loading="eager"
                        />
                     </Link>
                  </div>
 
                  {/* Search Input on Desktop */}
                  <div className={cn(
                     "hidden lg:flex fixed left-(--sidebar-width) lg:left-1/2 lg:-translate-x-1/2",
                  )}>
                     <Suspense fallback={<InputWithLeftSelectSkeleton />}>
                        <InputWithLeftSelect />
                     </Suspense>
                  </div>
 
                  {/* Right Section */}
                  <div className="flex items-center justify-end gap-1 sm:gap-2 ml-auto">
                     {/* Mobile Search Icon */}
                     <Button
                        onClick={handleMobileSearchOpen}
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 p-0 lg:hidden"
                        data-testid="open-search"
                        aria-label={t("search")}
                     >
                        <Search className="size-6" />
                     </Button>

                     {isLoggedIn && (
                        <>
                           <NotificationDropdown />

                           {/* Compact Create (mobile / tablet) */}
                           <Button
                              data-testid="mobile-header-create-artwork-button"
                              onClick={() => setIsArtworkCreateModalOpen(true)}
                              variant="ghost"
                              size="icon"
                              aria-label={t("create")}
                              className={cn(
                                 "rounded-full h-10 w-10 p-0 cursor-pointer",
                                 isMy ? "xl:hidden" : "lg:hidden"
                              )}
                           >
                              <Plus className="size-6" />
                           </Button>

                           {/* Labeled Create (desktop) */}
                           <Button
                              data-testid="header-create-artwork-button"
                              onClick={() => setIsArtworkCreateModalOpen(true)}
                              className={cn(
                                 "rounded-full font-semibold shadow-xs items-center gap-1.5 select-none cursor-pointer",
                                 isMy ? "hidden xl:inline-flex h-9 px-4" : "hidden lg:inline-flex h-9 px-4"
                              )}
                           >
                              <Plus className="h-4 w-4 shrink-0" />
                              <span>{t("create")}</span>
                           </Button>
                        </>
                     )}

                     {/* Auth Button / Profile */}
                     {!isLoggedIn ? (
                        <Link
                           to={paths.auth.login.path}
                           className="inline-flex shrink-0"
                        >
                           <Button className="rounded-full h-8 px-3 sm:px-4 text-xs sm:text-sm font-semibold">
                              {t("signIn")}
                           </Button>
                        </Link>
                     ) : (
                        <ProfileDropdown />
                     )}

                     <div className="hidden md:flex items-center gap-2">
                        <LanguageSwitcher />
                        <ThemeSwitcher />
                     </div>
                  </div>
               </div>
            )}
         </header>
         <ArtworkCreateModal
            isArtworkCreateModalOpen={isArtworkCreateModalOpen}
            setIsArtworkCreateModalOpen={setIsArtworkCreateModalOpen}
         />
      </SourceProvider>
   );
}
