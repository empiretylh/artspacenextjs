'use client'
import {
  type ColumnFiltersState,
  type PaginationState,
  type SortingState,
} from "@tanstack/react-table";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useGetOrders } from "../api/get-orders";
import OrdersProvider from "../context/orders-context";
import { columns } from "./columns";
import { DataTable } from "./data-table";

export default function OrdersContainer() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const [filters, setFilters] = React.useState<ColumnFiltersState>(
    JSON.parse(searchParams.get("filters") || "[]")
  );
  const [sorts, setSorts] = React.useState<SortingState>(
    JSON.parse(searchParams.get("sorts") || "[]")
  );
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: Number(searchParams.get("pageIndex")) || 0,
    pageSize: Number(searchParams.get("pageSize")) || 10,
  });
  const [globalFilter, setGlobalFilter] = useState<any>(
    searchParams.get("search") || ""
  );
  const [rowSelection, setRowSelection] = useState({});

  const ordersQuery = useGetOrders({
    search: globalFilter,
    filters,
    sorts,
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
  });

  const orders = ordersQuery?.data?.data ?? [];

  const getTotalPages = () => {
    const total = ordersQuery?.data?.count ?? 0;
    const limit = pagination.pageSize ?? 10;
    return Math.ceil(total / limit);
  }

  useEffect(() => {
    const params = new URLSearchParams(searchParams);

    if (filters.length > 0) {
      params.set("filters", JSON.stringify(filters));
    } else {
      params.delete("filters");
    }

    if (sorts.length > 0) {
      params.set("sorts", JSON.stringify(sorts));
    } else {
      params.delete("sorts");
    }

    params.set("pageIndex", String(pagination.pageIndex));
    params.set("pageSize", String(pagination.pageSize));

    if (globalFilter) {
      params.set("search", globalFilter);
    } else {
      params.delete("search");
    }

    // ✅ only push if something actually changed
    if (params.toString() !== searchParams.toString()) {
      replace(`${pathname}?${params.toString()}`);
    }
  }, [filters, sorts, pagination, globalFilter]);

  useEffect(() => {
    setFilters(JSON.parse(searchParams.get("filters") || "[]"));
    setSorts(JSON.parse(searchParams.get("sorts") || "[]"));
    setPagination({
      pageIndex: Number(searchParams.get("pageIndex")) || 0,
      pageSize: Number(searchParams.get("pageSize")) || 10,
    });
    setGlobalFilter(searchParams.get("search") || "");
  }, [searchParams]);

  return (
    <OrdersProvider>
      {/* <div className="mb-2 flex flex-wrap items-center justify-between gap-x-4 space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight"> Orders </h2>
          <p className="text-muted-foreground">
            Here & apos;s a list of your orders for this month!
          </p>
        </div>
        <OrdersPrimaryButtons />
      </div> */}
      <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
        <DataTable
          data={orders}
          columns={columns}
          config={{
            filters,
            setFilters,
            pagination,
            setPagination,
            globalFilter,
            setGlobalFilter,
            sorting: sorts,
            setSorting: setSorts,
            rowSelection,
            setRowSelection,
            dataMeta: {
              totalPages: getTotalPages(),
              totalRows: ordersQuery?.data?.count ?? 0,
              page: pagination.pageIndex ?? 1,
            },
          }}
        />
      </div>
    </OrdersProvider>
  );
}
