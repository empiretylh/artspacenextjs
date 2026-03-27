"use client";




export type StatusFilter = "active" | "deleted";

interface OrderStatusFilterProps {
   readonly initialValue?: StatusFilter;
   readonly onChange: (status: StatusFilter) => void;
}

export function OrderStatusFilter({
   initialValue = "active",
   onChange,
}: OrderStatusFilterProps) {
   const handleSelect = (value: StatusFilter) => {
      onChange(value);
   };

   return (
      // <DropdownMenu modal={false}>
      //    <DropdownMenuTrigger asChild>
      //       <Button
      //          variant="outline"
      //          size="sm"
      //          className={cn("ml-auto hidden h-8 lg:flex")}
      //       >
      //          {initialValue === "active" ? "Active" : "Deleted"} Data
      //       </Button>
      //    </DropdownMenuTrigger>
      //    <DropdownMenuContent align="start">
      //       <DropdownMenuItem onClick={() => handleSelect("active")}>
      //          Active
      //       </DropdownMenuItem>
      //       <DropdownMenuItem onClick={() => handleSelect("deleted")}>
      //          Deleted
      //       </DropdownMenuItem>
      //    </DropdownMenuContent>
      // </DropdownMenu>
      <></>
   );
}
