import { Button } from "@/components/ui/button";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { type Column } from "@tanstack/react-table";
import { RxCheckCircled, RxEyeNone } from "react-icons/rx";

interface ArchiveColumnHeaderProps<TData, TValue>
   extends React.HTMLAttributes<HTMLDivElement> {
   column: Column<TData, TValue>;
   title: string;
}

export function ArchiveColumnHeader<TData, TValue>({
   column,
   title,
   className,
}: ArchiveColumnHeaderProps<TData, TValue>) {
   if (!column.getCanSort()) {
      return <div className={cn(className)}>{title}</div>;
   }

   return (
      <div className={cn("flex items-center space-x-2", className)}>
         <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
               <Button
                  variant="ghost"
                  size="sm"
                  className="-ml-3 h-8 flex flex-col gap-0 justify-center items-start data-[state=open]:bg-accent"
               >
                  <span className="block">{title}</span>
                  {typeof column.getFilterValue() === "string" && (
                     <div className="block text-xs text-muted-foreground">
                        Archived: {column.getFilterValue() as string}
                     </div>
                  )}
               </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
               <DropdownMenuItem onClick={() => column.setFilterValue('PENDING')}>
                  <RxCheckCircled className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
                  PENDING
               </DropdownMenuItem>
               <DropdownMenuItem onClick={() => column.setFilterValue('COMPLETED')}>
                  <RxCheckCircled className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
                  COMPLETED
               </DropdownMenuItem>
               <DropdownMenuItem onClick={() => column.setFilterValue('FAILED')}>
                  <RxCheckCircled className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
                  FAILED
               </DropdownMenuItem>
               <DropdownMenuItem onClick={() => column.setFilterValue('SHIPPED')}>
                  <RxCheckCircled className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
                  SHIPPED
               </DropdownMenuItem>
               {column.getCanHide() && (
                  <>
                     <DropdownMenuSeparator />
                     <DropdownMenuItem
                        onClick={() => column.toggleVisibility(false)}
                     >
                        <RxEyeNone className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
                        Hide
                     </DropdownMenuItem>
                  </>
               )}
            </DropdownMenuContent>
         </DropdownMenu>
      </div>
   );
}
