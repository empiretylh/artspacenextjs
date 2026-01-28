import { IconTrendingUp } from "@tabler/icons-react";
import {
   Card,
   CardAction,
   CardDescription,
   CardHeader,
   CardTitle,
} from "@/components/ui/card";

export function SectionCards() {
   return (
      <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
         <Card className="@container/card">
            <CardHeader>
               <CardDescription>Total Revenue</CardDescription>
               <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                  $1,250.00
               </CardTitle>
               <CardAction className="col-span-2 my-auto">
                  <IconTrendingUp />
               </CardAction>
            </CardHeader>
         </Card>
         <Card className="@container/card">
            <CardHeader>
               <CardDescription>New Customers</CardDescription>
               <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                  1,234
               </CardTitle>
               <CardAction className="col-span-2 my-auto">
                  <IconTrendingUp />
               </CardAction>
            </CardHeader>
         </Card>
         <Card className="@container/card">
            <CardHeader>
               <CardDescription>Artworks Sold</CardDescription>
               <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                  45,678
               </CardTitle>
               <CardAction className="col-span-2 my-auto">
                  <IconTrendingUp />
               </CardAction>
            </CardHeader>
         </Card>
         <Card className="@container/card">
            <CardHeader>
               <CardDescription>Average Sale Price</CardDescription>
               <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                  $1,25
               </CardTitle>
               <CardAction className="col-span-2 my-auto">
                  <IconTrendingUp />
               </CardAction>
            </CardHeader>
         </Card>
      </div>
   );
}
