"use client";

import * as React from "react";
import { useDebounce } from "./multi-select"; // reuse your debounce
import MultipleSelector, {
   type Option,
   type MultipleSelectorProps,
} from "./multi-select";
import { ScrollArea } from "../ui/scroll-area";

interface AsyncPaginatedMultiSelectProps
   extends Omit<MultipleSelectorProps, "onSearch"> {
   fetchOptions: (
      query: string,
      page: number
   ) => Promise<{ items: Option[]; hasMore: boolean }>;
   pageSize?: number;
}

const AsyncPaginatedMultiSelect = ({
   fetchOptions,
   pageSize = 20,
   ...props
}: AsyncPaginatedMultiSelectProps) => {
   const [options, setOptions] = React.useState<Option[]>([]);
   const [page, setPage] = React.useState(1);
   const [hasMore, setHasMore] = React.useState(true);
   const [loading, setLoading] = React.useState(false);
   const [inputValue, setInputValue] = React.useState("");
   const debouncedSearch = useDebounce(inputValue, 500);

   const loadOptions = React.useCallback(
      async (reset = false) => {
         if (loading || (!hasMore && !reset)) return;

         setLoading(true);
         const nextPage = reset ? 1 : page;
         const { items, hasMore: more } = await fetchOptions(
            debouncedSearch,
            nextPage
         );

         setOptions((prev) => (reset ? items : [...prev, ...items]));
         setPage(nextPage + 1);
         setHasMore(more);
         setLoading(false);
      },
      [debouncedSearch, fetchOptions, page, hasMore, loading]
   );

   // Reset on new search
   React.useEffect(() => {
      setPage(1);
      setHasMore(true);
      void loadOptions(true);
   }, [debouncedSearch]);

   const handleScroll = React.useCallback(
      (e: React.UIEvent<HTMLDivElement>) => {
         const target = e.target as HTMLDivElement;
         if (
            target.scrollHeight - target.scrollTop - target.clientHeight <
            50
         ) {
            void loadOptions();
         }
      },
      [loadOptions]
   );

   return (
      <MultipleSelector
         {...props}
         onSearchSync={undefined} // prevent default sync search
         onSearch={undefined} // prevent default async search
         options={options}
         inputProps={{
            onValueChange: (value) => setInputValue(value),
            ...props.inputProps,
         }}
         loadingIndicator={
            props.loadingIndicator || (
               <div className="p-2 text-center">Loading...</div>
            )
         }
         commandProps={{
            children: (
               <ScrollArea className="h-[300px]" onScroll={handleScroll}>
                  {props.commandProps?.children}
               </ScrollArea>
            ),
         }}
      />
   );
};

export default AsyncPaginatedMultiSelect;
