import { type RowData } from "@tanstack/react-table";

declare module "@tanstack/table-core" {
    
   interface TableMeta<TData extends RowData> {
      onFilterChange?: (filters: any) => void;
      filters?: FilterProducts;
   }
}

export interface FilterProducts {
   archived?: boolean;
   page?: number;
   limit?: number;
   deleted?: boolean;
   category?: string;
   search?: string;
   sortBy?: string;
}
