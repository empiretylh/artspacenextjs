import { Checkbox } from "@/components/ui/checkbox";
import { type ColumnDef } from "@tanstack/react-table";
import { ArchiveColumnHeader } from "./archive-column-header";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import type { Order } from "@/types";
import { DataTableHeaderActions } from "./data-table-header-actions";
import { getDate } from "@/lib/utils";

export const columns: ColumnDef<Order>[] = [
   // {
   //    id: "select",
   //    header: ({ table }) => (
   //       <Checkbox
   //          checked={
   //             table.getIsAllPageRowsSelected() ||
   //             (table.getIsSomePageRowsSelected() && "indeterminate")
   //          }
   //          onCheckedChange={(value) =>
   //             table.toggleAllPageRowsSelected(!!value)
   //          }
   //          aria-label="Select all"
   //          className="translate-y-[2px]"
   //       />
   //    ),
   //    cell: ({ row }) => (
   //       <Checkbox
   //          checked={row.getIsSelected()}
   //          onCheckedChange={(value) => row.toggleSelected(!!value)}
   //          aria-label="Select row"
   //          className="translate-y-[2px]"
   //       />
   //    ),
   //    enableSorting: false,
   //    enableHiding: false,
   // },
   // {
   //    accessorKey: "id",
   //    header: ({ column }) => (
   //       <DataTableColumnHeader column={column} title="Order ID" />
   //    ),
   //    cell: ({ row }) => <div className="w-[80px]">{row.getValue("id")}</div>,
   // },
   {
      accessorKey: "id",
      header: ({ column }) => (
         <DataTableColumnHeader column={column} title="Order Id" />
      ),
      cell: ({ row }) => row.getValue("id"),
   },
   {
      accessorKey: "buyer",
      header: ({ column }) => (
         <DataTableColumnHeader column={column} title="Buyer" />
      ),
      cell: ({ row }) => <span>{row.original.buyer.first_name + " " + row.original.buyer.last_name}</span>,
   },
   {
      accessorKey: "created_at",
      header: ({ column }) => (
         <DataTableColumnHeader column={column} title="Created At" />
      ),
      cell: ({ row }) =>
         getDate(row.getValue("created_at")),
   },
   {
      accessorKey: "status",
      header: ({ column }) => (
         <ArchiveColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => (row.getValue("status")),
   },
   {
      id: "actions",
      header: ({ table }) => (
         // <DataTableHeaderActions
         //    table={table}
         //    selectedRows={table.getSelectedRowModel().rows}
         // />
         <></>
      ),
      cell: ({ row }) => <DataTableRowActions row={row} />,
   },
];
