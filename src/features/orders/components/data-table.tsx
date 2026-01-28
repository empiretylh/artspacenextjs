import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from "@/components/ui/table";
import {
   type ColumnDef,
   type ColumnFiltersState,
   type OnChangeFn,
   type PaginationState,
   type SortingState,
   type VisibilityState,
   flexRender,
   getCoreRowModel,
   getFacetedRowModel,
   getFacetedUniqueValues,
   getPaginationRowModel,
   getSortedRowModel,
   useReactTable,
} from "@tanstack/react-table";
import * as React from "react";
import { DataTablePagination } from "./data-table-pagination";
import { DataTableToolbar } from "./data-table-toolbar";
import { OrdersDialogs } from "./orders-dialogs";

interface DataTableProps<TData, TValue> {
   columns: ColumnDef<TData, TValue>[];
   data: TData[];
   config: {
      filters?: ColumnFiltersState;
      globalFilter?: string;
      setGlobalFilter?: OnChangeFn<string>;
      pagination: { pageIndex: number; pageSize: number };
      setPagination: OnChangeFn<PaginationState>;
      sorting: SortingState;
      setSorting: OnChangeFn<SortingState>;
      rowSelection?: any;
      setRowSelection: OnChangeFn<any>;
      // onFilter
      setFilters: OnChangeFn<ColumnFiltersState>;
      dataMeta?: Record<string, any>;
   };
}

export function DataTable<TData, TValue>({
   columns,
   data,
   config,
}: DataTableProps<TData, TValue>) {
   const [columnVisibility, setColumnVisibility] =
      React.useState<VisibilityState>({});

   const table = useReactTable({
      data: data,
      columns,
      state: {
         globalFilter: config?.globalFilter ?? "",
         pagination: config?.pagination ?? { pageIndex: 0, pageSize: 10 },
         columnFilters: config.filters,
         sorting: config.sorting,
         columnVisibility,
         rowSelection: config.rowSelection,
      },
      onGlobalFilterChange: config.setGlobalFilter,
      rowCount: config?.dataMeta?.totalRows ?? -1,
      pageCount: config?.dataMeta?.totalPages ?? -1,
      enableRowSelection: true,
      onColumnFiltersChange: config.setFilters,
      onPaginationChange: config.setPagination,
      onRowSelectionChange: config.setRowSelection,
      onSortingChange: config.setSorting,
      onColumnVisibilityChange: setColumnVisibility,
      getCoreRowModel: getCoreRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
      getSortedRowModel: getSortedRowModel(),
      getFacetedRowModel: getFacetedRowModel(),
      getFacetedUniqueValues: getFacetedUniqueValues(),
      manualFiltering: true,
      manualPagination: true,
      manualSorting: true,
      // enableColumnFilters: false,
   });

   return (
      <div className="space-y-4">
         <DataTableToolbar table={table} />
         <div className="rounded-md border">
            <Table>
               <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                     <TableRow key={headerGroup.id}>
                        {headerGroup.headers.map((header) => {
                           return (
                              <TableHead
                                 key={header.id}
                                 colSpan={header.colSpan}
                              >
                                 {header.isPlaceholder
                                    ? null
                                    : flexRender(
                                       header.column.columnDef.header,
                                       header.getContext()
                                    )}
                              </TableHead>
                           );
                        })}
                     </TableRow>
                  ))}
               </TableHeader>
               <TableBody>
                  {table.getRowModel().rows?.length ? (
                     table.getRowModel().rows.map((row) => (
                        <TableRow
                           key={row.id}
                           data-state={row.getIsSelected() && "selected"}
                        >
                           {row.getVisibleCells().map((cell) => (
                              <TableCell key={cell.id}>
                                 {flexRender(
                                    cell.column.columnDef.cell,
                                    cell.getContext()
                                 )}
                              </TableCell>
                           ))}
                        </TableRow>
                     ))
                  ) : (
                     <TableRow>
                        <TableCell
                           colSpan={columns.length}
                           className="h-24 text-center"
                        >
                           No results.
                        </TableCell>
                     </TableRow>
                  )}
               </TableBody>
            </Table>
         </div>
         <DataTablePagination table={table} />
         <OrdersDialogs table={table} />
      </div>
   );
}
