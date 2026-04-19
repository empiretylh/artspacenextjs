'use client'

import { UserOrderList } from "../components/user-order-list";
import React, { useState, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ORDER_STATUS_OPTIONS = [
  { label: "All Order Status", value: "all" },
  { label: "Pending", value: "PENDING" },
  { label: "Shipped", value: "SHIPPED" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Cancelled", value: "CANCELLED" },
  { label: "Failed", value: "FAILED" },
];

const PAYMENT_STATUS_OPTIONS = [
  { label: "All Payment Status", value: "all" },
  { label: "Pending", value: "PENDING" },
  { label: "Processing", value: "PROCESSING" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Failed", value: "FAILED" },
];

const OrdersPage = () => {
  const [orderStatus, setOrderStatus] = useState<string>("all");
  const [paymentStatus, setPaymentStatus] = useState<string>("all");

  const filters = useMemo(() => {
    const f: Record<string, any> = {};
    if (orderStatus !== "all") {
      f.order_status = orderStatus;
    }
    if (paymentStatus !== "all") {
      f.payment_status = paymentStatus;
    }
    return f;
  }, [orderStatus, paymentStatus]);

  const isFiltered = orderStatus !== "all" || paymentStatus !== "all";

  const resetFilters = () => {
    setOrderStatus("all");
    setPaymentStatus("all");
  };

  return (
    <div className="flex flex-col max-w-5xl mx-auto w-full">
      <div className="@container/main flex flex-col gap-2 px-4 md:px-0">
        <div className="flex flex-col gap-4 py-8 md:gap-8 md:py-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-primary/5 pb-8">
            <div className="space-y-1.5">
              <h1 className="text-4xl font-black tracking-tight text-primary uppercase">Your Orders</h1>
              <p className="text-muted-foreground font-medium font-sans">
                Track and manage all your purchased artworks here.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Select value={orderStatus} onValueChange={setOrderStatus}>
                <SelectTrigger className="w-[180px] h-10 font-bold uppercase tracking-widest text-[10px] border-2 shadow-sm font-sans">
                  <SelectValue placeholder="Order Status" />
                </SelectTrigger>
                <SelectContent>
                  {ORDER_STATUS_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value} className="font-bold text-xs uppercase tracking-wider font-sans">
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={paymentStatus} onValueChange={setPaymentStatus}>
                <SelectTrigger className="w-[180px] h-10 font-bold uppercase tracking-widest text-[10px] border-2 shadow-sm font-sans">
                  <SelectValue placeholder="Payment Status" />
                </SelectTrigger>
                <SelectContent>
                  {PAYMENT_STATUS_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value} className="font-bold text-xs uppercase tracking-wider font-sans">
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {isFiltered && (
                <Button
                  variant="ghost"
                  onClick={resetFilters}
                  className="h-10 px-3 text-muted-foreground hover:text-primary transition-colors font-bold text-xs uppercase tracking-widest font-sans"
                >
                  Reset
                  <X className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          <div className="mt-2">
            <UserOrderList filters={filters} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;
