'use client'

import { usePathname, useRouter } from "@/i18n/routing";
import { useLocale } from "next-intl";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Globe, ChevronDown } from "lucide-react";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export function LanguageSwitcher() {
   const router = useRouter();
   const pathname = usePathname();
   const locale = useLocale();
   const [isPending, startTransition] = useTransition();

   const onSelectChange = (nextLocale: string) => {
      startTransition(() => {
         router.replace(pathname, { locale: nextLocale });
      });
   };

   return (
      <DropdownMenu>
         <DropdownMenuTrigger asChild>
            <Button
               variant="outline"
               size="sm"
               className={cn(
                  "h-8 px-3 gap-2 rounded-full border border-input bg-background hover:bg-accent hover:text-accent-foreground text-xs font-semibold transition-all shadow-xs shrink-0 select-none cursor-pointer",
                  isPending && "opacity-50 pointer-events-none"
               )}
               disabled={isPending}
            >
               <Globe className="h-3.5 w-3.5 text-muted-foreground" />
               <span>{locale === "en" ? "EN" : "MY"}</span>
               <ChevronDown className="h-3 w-3 text-muted-foreground" />
            </Button>
         </DropdownMenuTrigger>
         <DropdownMenuContent align="end" className="w-[140px] animate-in fade-in duration-200">
            <DropdownMenuItem
               onClick={() => onSelectChange("en")}
               className={cn(
                  "flex items-center justify-between cursor-pointer font-medium text-sm transition-colors",
                  locale === "en" && "bg-primary/10 text-primary hover:bg-primary/20"
               )}
            >
               English
               {locale === "en" && (
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
               )}
            </DropdownMenuItem>
            <DropdownMenuItem
               onClick={() => onSelectChange("my")}
               className={cn(
                  "flex items-center justify-between cursor-pointer font-medium text-sm transition-colors",
                  locale === "my" && "bg-primary/10 text-primary hover:bg-primary/20"
               )}
            >
               မြန်မာ
               {locale === "my" && (
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
               )}
            </DropdownMenuItem>
         </DropdownMenuContent>
      </DropdownMenu>
   );
}
