'use client'

import { UserOrderList } from "../components/user-order-list";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React, { useState } from 'react';

const OrdersPage = () => {
  const [activeTab, setActiveTab] = useState('all');

  const filters = activeTab === 'processing' 
    ? { payment_status: 'PROCESSING', order_status: 'PENDING' }
    : {};

  return (
    <div className="flex flex-col max-w-5xl mx-auto w-full">
      <div className="@container/main flex flex-col gap-2 px-4 md:px-0">
        <div className="flex flex-col gap-4 py-8 md:gap-8 md:py-12">
          <div className="mb-2 space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">Your Orders</h1>
            <p className="text-muted-foreground">
              Track and manage all your purchased artworks here.
            </p>
          </div>

          <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Orders</TabsTrigger>
              <TabsTrigger value="processing">Processing</TabsTrigger>
            </TabsList>
            <TabsContent value="all">
              <UserOrderList />
            </TabsContent>
            <TabsContent value="processing">
              <UserOrderList filters={filters} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;
