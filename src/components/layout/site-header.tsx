'use client'
import { Button } from "@/components/ui/button";
import { paths } from "@/config/paths";
import ArtworkCreateModal from "@/features/artwork/components/artwork-create-modal";
import { useAuth } from "@/features/auth/store";
import { useCartStore } from "@/features/cart/store/cart-store";
import { cn } from "@/lib/utils";
import {
   ArrowLeft,
   Bell,
   MoreVerticalIcon,
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
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { SidebarTrigger } from "../ui/sidebar";
import { SourceProvider } from "@/lib/analytics-source";
import { useTranslations, useLocale } from "next-intl";

export function SiteHeader() {
   const t = useTranslations("Header");
   const locale = useLocale();
   const isMy = locale === "my";

   const [isArtworkCreateModalOpen, setIsArtworkCreateModalOpen] =
      useState(false);
   const { items } = useCartStore();
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
                  <div className="flex gap-2 items-center md:hidden min-w-0">
                     <SidebarTrigger className="-ml-1 shrink-0" />
                     <Link to={"/"} className="uppercase font-display font-bold text-sm whitespace-nowrap truncate max-w-[150px] xs:max-w-none">
                        {t("title")}
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
                  <div className="flex items-center justify-end gap-2 ml-auto">
                     {/* Mobile Search Icon */}
                     <Button
                        onClick={handleMobileSearchOpen}
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 p-0 lg:hidden"
                        data-testid="open-search"
                     >
                        <Search className="size-6" />
                     </Button>
 
                     <Button
                        variant="ghost"
                        className="h-8 w-8 p-0 relative hidden lg:flex"
                     >
                        <span className="absolute text-xs text-primary-foreground p-1 w-5 h-5 flex items-center justify-center -top-2 right-0 bg-primary rounded-full">
                           0
                        </span>
                        <Bell className="h-4 w-4" />
                     </Button>
 
                     {isLoggedIn && (
                        <Button
                           onClick={() => setIsArtworkCreateModalOpen(true)}
                           className={cn(
                              "rounded-full font-semibold transition-all duration-300 hover:scale-105 active:scale-95 shadow-xs flex items-center gap-1.5 select-none cursor-pointer",
                              isMy ? "hidden xl:inline-flex h-9 px-4" : "hidden lg:inline-flex h-9 px-4"
                           )}
                        >
                           <Plus className="h-4 w-4 shrink-0" />
                           <span>{t("create")}</span>
                        </Button>
                     )}
 
                     {/* Auth Buttons / Profile */}
                     {!isLoggedIn ? (
                        <>
                           <Link
                              to={paths.auth.login.path}
                              className={cn(isMy ? "hidden 2xl:inline-flex" : "hidden xl:inline-flex")}
                           >
                              <Button className="rounded-full h-8">{t("signIn")}</Button>
                           </Link>
                           <Link
                              to={paths.auth.register.path}
                              className={cn(isMy ? "hidden 2xl:inline-flex" : "hidden xl:inline-flex")}
                           >
                              <Button variant="outline" className="rounded-full h-8">
                                 {t("joinNow")}
                              </Button>
                           </Link>
                        </>
                     ) : (
                        <ProfileDropdown />
                     )}
 
                     <div
                        className={cn(
                           "flex items-center",
                           isLoggedIn && (isMy ? "xl:hidden" : "lg:hidden"),
                           !isLoggedIn && (isMy ? "2xl:hidden" : "xl:hidden")
                        )}
                     >
                        <DropdownMenu>
                           <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-10 w-10 p-0">
                                 <MoreVerticalIcon className="size-6" />
                              </Button>
                           </DropdownMenuTrigger>
                           <DropdownMenuContent align="end" className="w-56">
                              {isLoggedIn && (
                                 <DropdownMenuItem
                                    onClick={() =>
                                       setIsArtworkCreateModalOpen(true)
                                    }
                                    className={cn("cursor-pointer flex items-center gap-2", isMy ? "xl:hidden" : "lg:hidden")}
                                 >
                                    <Plus className="h-4 w-4 text-muted-foreground" />
                                    <span>{t("create")}</span>
                                 </DropdownMenuItem>
                              )}
                              {!isLoggedIn && (
                                 <>
                                    <DropdownMenuItem>
                                       <Link
                                          className="w-full"
                                          to={paths.auth.login.path}
                                       >
                                          {t("signIn")}
                                       </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                       <Link
                                          className="w-full"
                                          to={paths.auth.register.path}
                                       >
                                          {t("joinNow")}
                                       </Link>
                                    </DropdownMenuItem>
                                 </>
                              )}
                              <DropdownMenuItem className={cn("cursor-pointer flex justify-between items-center focus:text-accent-foreground", isMy ? "xl:hidden" : "lg:hidden")}>
                                 <div className="flex items-center gap-2">
                                    <Bell className="h-4 w-4 text-muted-foreground" />
                                    <span>{t("notifications")}</span>
                                 </div>
                                 <span className="text-xs font-semibold px-2 py-0.5 bg-primary/10 text-primary rounded-full">
                                    0
                                 </span>
                              </DropdownMenuItem>
                               <div className="md:hidden p-2 border-t mt-2 space-y-2">
                                  <div className="flex justify-between items-center gap-4 px-2 py-1.5">
                                     <span className="text-xs font-medium text-muted-foreground">Language</span>
                                     <LanguageSwitcher />
                                  </div>
                                  <div className="flex justify-between items-center gap-4 px-2 py-1.5">
                                     <span className="text-xs font-medium text-muted-foreground">Theme</span>
                                     <ThemeSwitcher />
                                  </div>
                               </div>
                            </DropdownMenuContent>
                        </DropdownMenu>
                     </div>
 
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
