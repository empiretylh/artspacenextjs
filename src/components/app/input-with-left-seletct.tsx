'use client'
import * as React from "react";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "../ui/select";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import { Button } from "../ui/button";
import { paths } from "@/config/paths";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { InputWithLeftSelectSkeleton } from "./input-with-left-select-skeleton";
import { searchAnalytics } from "@/lib/analytics";
import { useSource } from "@/lib/analytics-source";

const routeMap: Record<string, string> = {
   artists: paths.artists.path,
   artworks: paths.artworks.path,
   collectors: paths.collectors.path,
   galleries: paths.galleries.path,
   events: paths.events.path,
};

function InputWithLeftSelect({
   className,
   type,
   ...props
}: React.ComponentProps<"input">) {
   const [selectedOption, setSelectedOption] = React.useState("artists");
   const [search, setSearch] = React.useState("");
   const searchParams = useSearchParams();
   const router = useRouter();
   const pathname = usePathname();
   const { source } = useSource();
   const searchParam = searchParams.get("search") ?? "";

   const onSearchClick = () => {
      const basePath = routeMap[selectedOption];
      if (!basePath) return;

      const params = new URLSearchParams(searchParams);

      params.delete("search");
      if (search) params.set("search", search);

      const queryString = params.toString();
      let finalUrl = `${basePath}${queryString ? `?${queryString}` : ""}`;

      console.log(pathname)

      if (pathname === basePath) {
         finalUrl = `${basePath}${queryString ? `?${queryString}` : ""}`
      } else {
         finalUrl = `${basePath}?search=${params.get('search')}`
      }

      searchAnalytics.search(search, { source });

      router.push(finalUrl);
   };

   const [mounted, setMounted] = React.useState(false);

   // This only runs on the client after the first render
   React.useEffect(() => {
      setMounted(true);
   }, []);

   React.useEffect(() => {
      const matched = Object.entries(routeMap).find(([, path]) => path === pathname);
      if (matched) setSelectedOption(matched[0]);
      setSearch(searchParam);
   }, [pathname, searchParam]);

   // If not mounted yet, return a placeholder with the EXACT same height/width
   // to reserve the space and prevent layout shift.
   if (!mounted) {
      return <InputWithLeftSelectSkeleton />;
   }

   return (
      <div
         className={cn(
            "flex justify-center items-center shadow border-2 gap-2 rounded-full p-1",
            className
         )}
      >
         <Select
            defaultValue="artists"
            value={selectedOption}
            onValueChange={(value) => setSelectedOption(value)}
         >
            <SelectTrigger className="w-18 md:w-20 lg:w-auto lg:max-w-28 rounded-full bg-primary! text-primary-foreground [&>svg]:stroke-primary-foreground">
               <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent defaultValue={"artists"} className="rounded-2xl">
               <SelectItem className="rounded-2xl" value="artists">
                  Artists
               </SelectItem>
               <SelectItem className="rounded-2xl" value="artworks">
                  Artworks
               </SelectItem>
               <SelectItem className="rounded-2xl" value="collectors">
                  Collectors
               </SelectItem>
               <SelectItem className="rounded-2xl" value="galleries">
                  Galleries
               </SelectItem>
               <SelectItem className="rounded-2xl" value="events">
                  Events
               </SelectItem>
            </SelectContent>
         </Select>

         <input
            type={type}
            data-slot="input"
            data-testid="global-search-input"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
               if (e.key === "Enter") {
                  e.preventDefault(); // prevents form submission if inside a form
                  onSearchClick();
               }
            }}
            className={cn(
               "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 flex h-9 w-full min-w-0 md:w-[280px] lg:w-[350px] bg-transparent rounded-full px-3 py-1 text-base transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
               "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
               "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive"
            )}
            {...props}
         />

         <Button onClick={onSearchClick} className="rounded-full">
            <Search />
         </Button>
      </div>
   );
}

export { InputWithLeftSelect };
