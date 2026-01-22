"use client";

import { Command as CommandPrimitive } from "cmdk";
import { XCircleIcon, XIcon } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";
import {
   Command,
   CommandGroup,
   CommandItem,
   CommandList,
} from "@/components/ui/command";
import { Spinner } from "../ui/spinner";

export interface Option {
   value: string;
   label: string;
   disable?: boolean;
   fixed?: boolean;
   [key: string]: string | boolean | undefined;
}
interface GroupOption {
   [key: string]: Option[];
}

export interface MultipleSelectorProps {
   value?: Option[];
   defaultOptions?: Option[];
   options?: Option[];
   placeholder?: string;
   emptyIndicator?: React.ReactNode;
   onChange?: (options: Option[]) => void;
   maxSelected?: number;
   onMaxSelected?: (maxLimit: number) => void;
   hidePlaceholderWhenSelected?: boolean;
   disabled?: boolean;
   groupBy?: string;
   className?: string;
   badgeClassName?: string;
   selectFirstItem?: boolean;
   creatable?: boolean;
   commandProps?: React.ComponentPropsWithoutRef<typeof Command>;
   inputProps?: Omit<
      React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>,
      "value" | "placeholder" | "disabled"
   >;
   hideClearAllButton?: boolean;
   onUserScrollToEnd?: () => void;

   // NEW: callback for input change
   onSearchChange?: (value: string) => void;
   searchDebounce?: number;
   loading?: boolean;
}

export interface MultipleSelectorRef {
   selectedValue: Option[];
   input: HTMLInputElement;
   focus: () => void;
   reset: () => void;
}

// Debounce hook
function useDebounce<T>(value: T, delay: number) {
   const [debouncedValue, setDebouncedValue] = React.useState<T>(value);

   React.useEffect(() => {
      const timer = setTimeout(() => setDebouncedValue(value), delay);
      return () => clearTimeout(timer);
   }, [value, delay]);

   return debouncedValue;
}

function transToGroupOption(options: Option[], groupBy?: string) {
   if (options.length === 0) return {};
   if (!groupBy) return { "": options };

   const groupOption: GroupOption = {};
   options.forEach((option) => {
      const key = (option[groupBy] as string) || "";
      if (!groupOption[key]) groupOption[key] = [];
      groupOption[key].push(option);
   });
   return groupOption;
}

function removePickedOption(groupOption: GroupOption, picked: Option[]) {
   const cloneOption = JSON.parse(JSON.stringify(groupOption)) as GroupOption;
   for (const [key, value] of Object.entries(cloneOption)) {
      cloneOption[key] = value.filter(
         (val) => !picked.find((p) => p.value === val.value)
      );
   }
   return cloneOption;
}

const CommandEmpty = ({
   className,
   ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
   return (
      <div
         className={cn("px-2 py-4 text-center text-sm", className)}
         role="presentation"
         {...props}
      />
   );
};

const MultipleSelector = ({
   value,
   onChange,
   placeholder,
   defaultOptions: arrayDefaultOptions = [],
   options: arrayOptions,
   emptyIndicator,
   maxSelected = Number.MAX_SAFE_INTEGER,
   onMaxSelected,
   hidePlaceholderWhenSelected,
   disabled,
   groupBy,
   className,
   badgeClassName,
   selectFirstItem = true,
   creatable = false,
   commandProps,
   inputProps,
   hideClearAllButton = false,
   onUserScrollToEnd,
   onSearchChange,
   searchDebounce = 300,
   loading,
}: MultipleSelectorProps) => {
   const inputRef = React.useRef<HTMLInputElement>(null);
   const selectDropdownRef = React.useRef<HTMLDivElement>(null);
   const bottomSentinelRef = React.useRef<HTMLDivElement | null>(null);
   const [open, setOpen] = React.useState(false);
   const [selected, setSelected] = React.useState<Option[]>(value || []);
   const [options, setOptions] = React.useState<GroupOption>(
      transToGroupOption(arrayDefaultOptions, groupBy)
   );
   const [inputValue, setInputValue] = React.useState("");
   const scrollTimeout = React.useRef<NodeJS.Timeout | null>(null);
   const dropdownRef = React.useRef<HTMLDivElement>(null);

   const debouncedInputValue = useDebounce(inputValue, searchDebounce);

   // Call onSearchChange when debounced input changes
   React.useEffect(() => {
      if (onSearchChange) {
         onSearchChange(debouncedInputValue);
      }

      if (debouncedInputValue === "" && arrayOptions) {
         setOptions(transToGroupOption(arrayOptions || [], groupBy));
      }
   }, [debouncedInputValue, onSearchChange]);

   React.useEffect(() => {
      selectDropdownRef.current?.scrollTo({ top: 0, behavior: "smooth" });
   }, [debouncedInputValue]);

   const handleClickOutside = React.useCallback(
      (event: MouseEvent | TouchEvent) => {
         if (
            dropdownRef.current &&
            !dropdownRef.current.contains(event.target as Node) &&
            inputRef.current &&
            !inputRef.current.contains(event.target as Node)
         ) {
            setOpen(false);
            inputRef.current.blur();
         }
      },
      []
   );

   const handleUnselect = React.useCallback(
      (option: Option) => {
         const newOptions = selected.filter((s) => s.value !== option.value);
         setSelected(newOptions);
         onChange?.(newOptions);
      },
      [onChange, selected]
   );

   React.useEffect(() => {
      if (open) {
         document.addEventListener("mousedown", handleClickOutside);
         document.addEventListener("touchend", handleClickOutside);
      } else {
         document.removeEventListener("mousedown", handleClickOutside);
         document.removeEventListener("touchend", handleClickOutside);
      }
      return () => {
         document.removeEventListener("mousedown", handleClickOutside);
         document.removeEventListener("touchend", handleClickOutside);
      };
   }, [open, handleClickOutside]);

   React.useEffect(() => {
      if (value) setSelected(value);
   }, [value]);

   React.useEffect(() => {
      setOptions(transToGroupOption(arrayOptions || [], groupBy));
   }, [arrayOptions, groupBy]);

   const selectables = React.useMemo(
      () => removePickedOption(options, selected),
      [options, selected]
   );

   const EmptyItem = React.useCallback(() => {
      if (!emptyIndicator) return undefined;
      return <CommandEmpty>{emptyIndicator}</CommandEmpty>;
   }, [emptyIndicator]);

   React.useEffect(() => {
      if (!bottomSentinelRef.current || !onUserScrollToEnd) return;

      const observer = new IntersectionObserver(
         ([entry]) => {
            if (entry.isIntersecting) {
               onUserScrollToEnd(); // Trigger fetch/load more
            }
         },
         {
            root: selectDropdownRef.current, // scroll container
            threshold: 1.0,
         }
      );

      observer.observe(bottomSentinelRef.current);

      return () => observer.disconnect();
   }, [onUserScrollToEnd]);

   return (
      <Command
         shouldFilter={false}
         ref={dropdownRef}
         {...commandProps}
         className={cn(
            "h-auto overflow-visible bg-transparent",
            commandProps?.className
         )}
      >
         <div
            className={cn(
               "relative bg-transparent dark:bg-input/30 min-h-[38px] rounded-md border border-input text-sm outline-none transition-[color,box-shadow] focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50",
               className
            )}
            onClick={() => {
               setOpen(true);
               inputRef?.current?.focus();
            }}
         >
            <div className="flex flex-wrap gap-1 px-3 py-2">
               {selected.map((option) => (
                  <div
                     className={cn(
                        "relative inline-flex h-7 animate-fadeIn cursor-default items-center rounded-md border bg-background ps-2 pe-7 pl-2 font-medium text-foreground text-xs transition-all hover:bg-background",
                        badgeClassName
                     )}
                     data-fixed={option.fixed}
                     key={option.value}
                  >
                     {option.label}
                     <button
                        aria-label="Remove"
                        className="-inset-y-px -end-px absolute flex size-7 items-center justify-center rounded-e-md border border-transparent p-0 text-muted-foreground/80 outline-none outline-hidden transition-[color,box-shadow] hover:text-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                        onClick={() => handleUnselect(option)}
                        type="button"
                     >
                        <XIcon aria-hidden="true" size={14} />
                     </button>
                  </div>
               ))}
               <CommandPrimitive.Input
                  {...inputProps}
                  className={cn(
                     "flex-1 bg-transparent outline-hidden placeholder:text-muted-foreground/70 disabled:cursor-not-allowed",
                     {
                        "ml-1": selected.length !== 0,
                        "": selected.length === 0,
                        "w-full": hidePlaceholderWhenSelected,
                     },
                     inputProps?.className
                  )}
                  disabled={disabled}
                  placeholder={
                     hidePlaceholderWhenSelected && selected.length !== 0
                        ? ""
                        : placeholder
                  }
                  ref={inputRef}
                  value={inputValue}
                  onValueChange={(value) => setInputValue(value)}
                  onKeyDown={(e) => {
                     if (e.key === "Tab") {
                        setOpen(false);
                     }
                  }}
                  onFocus={() => setOpen(true)}
                  // onBlur={() => setOpen(false)}
               />
               {loading && (
                  <div className="flex items-center px-2">
                     <Spinner />
                  </div>
               )}
               {selected.length > 0 && !hideClearAllButton && (
                  <button
                     type="button"
                     onClick={() => {
                        setSelected([]);
                        onChange?.([]);
                     }}
                     className="flex items-center px-2"
                  >
                     <XCircleIcon size={16} />
                  </button>
               )}
            </div>
         </div>

         <div className="relative">
            <div
               className={cn(
                  "absolute top-2 z-10 w-full overflow-hidden rounded-md border border-input",
                  !open && "hidden"
               )}
               data-state={open ? "open" : "closed"}
            >
               {open && (
                  <CommandList
                     className="bg-popover text-popover-foreground shadow-lg outline-hidden"
                     onMouseEnter={() => {}}
                     onMouseLeave={() => {}}
                  >
                     {EmptyItem()}
                     <div
                        ref={selectDropdownRef}
                        className="h-[200px] overflow-y-auto"
                        onScroll={(e) => {
                           const target = e.target as HTMLDivElement;
                           if (scrollTimeout.current)
                              clearTimeout(scrollTimeout.current);
                           scrollTimeout.current = setTimeout(() => {
                              const distanceFromBottom =
                                 target.scrollHeight -
                                 target.scrollTop -
                                 target.clientHeight;
                              if (distanceFromBottom <= 5)
                                 onUserScrollToEnd?.();
                           }, 200);
                        }}
                     >
                        {/* <div>
                           {Object.entries(options).map(([key, dropdowns]) => {
                              if (dropdowns.length === 0) return null;
                              return (
                                 <CommandGroup key={key}>
                                    {dropdowns.map((option) => {
                                       return (
                                          <CommandItem
                                             key={option.value}
                                             className={cn(
                                                "cursor-pointer",
                                                option.disable &&
                                                   "pointer-events-none cursor-not-allowed opacity-50"
                                             )}
                                             value={option.value}
                                          >
                                             {option.label}
                                          </CommandItem>
                                       );
                                    })}
                                 </CommandGroup>
                              );
                           })}
                        </div> */}
                        <div>
                           {Object.entries(selectables).map(
                              ([key, dropdowns]) => (
                                 <CommandGroup key={key}>
                                    {dropdowns.map((option) => (
                                       <CommandItem
                                          key={option.value}
                                          className={cn(
                                             "cursor-pointer",
                                             option.disable &&
                                                "pointer-events-none cursor-not-allowed opacity-50"
                                          )}
                                          disabled={option.disable}
                                          onMouseDown={(e) => {
                                             e.preventDefault();
                                             e.stopPropagation();
                                          }}
                                          onSelect={() => {
                                             if (
                                                selected.length >= maxSelected
                                             ) {
                                                onMaxSelected?.(
                                                   selected.length
                                                );
                                                return;
                                             }
                                             const newOptions = [
                                                ...selected,
                                                option,
                                             ];
                                             setSelected(newOptions);
                                             onChange?.(newOptions);
                                          }}
                                          value={String(option.value)}
                                       >
                                          {option.label}
                                       </CommandItem>
                                    ))}
                                 </CommandGroup>
                              )
                           )}
                        </div>
                        <div
                           ref={bottomSentinelRef}
                           className="h-1 w-full"
                        ></div>
                     </div>
                  </CommandList>
               )}
            </div>
         </div>
      </Command>
   );
};

MultipleSelector.displayName = "MultipleSelector";
export default MultipleSelector;
