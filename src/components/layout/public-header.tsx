'use client'

import { useTranslations } from "next-intl";
import AppImage from "@/components/common/app-image";
import Link from "../common/link";
import { LanguageSwitcher } from "./language-switcher";
import { ThemeSwitcher } from "../theme-switcher";
import { SourceProvider } from "@/lib/analytics-source";

export function PublicHeader() {
   const t = useTranslations("Header");

   return (
      <SourceProvider value={{ source: "header" }}>
         <header className="bg-background sticky top-0 py-4 z-50 flex h-[var(--header-height)] items-center px-4 md:px-6 border-b border-border">
            <div className="flex w-full items-center justify-between">
               {/* Left: Brand Logo & Title */}
               <Link to={"/"} className="flex items-center gap-2.5 min-w-0 hover:opacity-90 transition-opacity">
                  <AppImage
                     src="/assets/logo.png"
                     alt="Logo"
                     width={32}
                     height={32}
                     className="size-8 object-contain shrink-0"
                     withoutContainer={true}
                     loading="eager"
                  />
                  <span className="uppercase font-display font-bold text-[15px] tracking-tight text-primary whitespace-nowrap truncate">
                     {t("title")}
                  </span>
               </Link>

               {/* Right: Switchers */}
               <div className="flex items-center gap-4">
                  <LanguageSwitcher />
                  <ThemeSwitcher />
               </div>
            </div>
         </header>
      </SourceProvider>
   );
}

export default PublicHeader;
