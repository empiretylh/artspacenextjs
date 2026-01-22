import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
   Table,
   TableHeader,
   TableBody,
   TableRow,
   TableCell,
   TableHead,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
   DropdownMenu,
   DropdownMenuTrigger,
   DropdownMenuContent,
   DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";

// --- Mock Data ---
const mockOrders = [
   {
      id: "ORD-1001",
      customer: "Alice Johnson",
      date: "2025-11-03",
      amount: 129.99,
      status: "Pending",
   },
   {
      id: "ORD-1002",
      customer: "Bob Smith",
      date: "2025-11-02",
      amount: 249.5,
      status: "Completed",
   },
   {
      id: "ORD-1003",
      customer: "Charlie Brown",
      date: "2025-11-01",
      amount: 89.0,
      status: "Cancelled",
   },
   {
      id: "ORD-1004",
      customer: "Diana Prince",
      date: "2025-10-31",
      amount: 520.0,
      status: "Completed",
   },
   {
      id: "ORD-1005",
      customer: "Ethan Clark",
      date: "2025-10-30",
      amount: 75.25,
      status: "Pending",
   },
];

// --- Helper for status color ---
function StatusBadge({ status }: { status: string }) {
   let color = "bg-gray-200 text-gray-800";
   if (status === "Completed") color = "bg-green-100 text-green-700";
   if (status === "Pending") color = "bg-yellow-100 text-yellow-700";
   if (status === "Cancelled") color = "bg-red-100 text-red-700";

   return <Badge className={`${color} capitalize`}>{status}</Badge>;
}

export default function OrdersPage() {
   const [search, setSearch] = useState("");
   const filteredOrders = mockOrders.filter(
      (order) =>
         order.customer.toLowerCase().includes(search.toLowerCase()) ||
         order.id.toLowerCase().includes(search.toLowerCase())
   );

   return (
      <div className="p-6 space-y-8">
         <h1 className="text-3xl font-bold tracking-tight">Orders</h1>

         <Card>
            <CardHeader>
               <CardTitle className="flex flex-col md:flex-row justify-start gap-4 md:items-center md:justify-between">
                  <span>Order List</span>
                  <div className="flex gap-2">
                     <Input
                        placeholder="Search orders..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-64"
                     />
                  </div>
               </CardTitle>
            </CardHeader>

            <CardContent>
               <Table>
                  <TableHeader>
                     <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                     </TableRow>
                  </TableHeader>
                  <TableBody>
                     {filteredOrders.map((order) => (
                        <TableRow key={order.id}>
                           <TableCell className="font-medium">
                              {order.id}
                           </TableCell>
                           <TableCell>{order.customer}</TableCell>
                           <TableCell>{order.date}</TableCell>
                           <TableCell>${order.amount.toFixed(2)}</TableCell>
                           <TableCell>
                              <StatusBadge status={order.status} />
                           </TableCell>
                           <TableCell className="text-right">
                              <DropdownMenu>
                                 <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                       <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                 </DropdownMenuTrigger>
                                 <DropdownMenuContent align="end">
                                    <DropdownMenuItem>
                                       View Details
                                    </DropdownMenuItem>
                                 </DropdownMenuContent>
                              </DropdownMenu>
                           </TableCell>
                        </TableRow>
                     ))}

                     {filteredOrders.length === 0 && (
                        <TableRow>
                           <TableCell
                              colSpan={6}
                              className="text-center text-gray-500 py-6"
                           >
                              No orders found.
                           </TableCell>
                        </TableRow>
                     )}
                  </TableBody>
               </Table>
            </CardContent>
         </Card>
      </div>
   );
}
