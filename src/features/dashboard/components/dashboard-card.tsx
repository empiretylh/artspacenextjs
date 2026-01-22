import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface DashboardCardProps {
   title: string;
   value: string;
   subtitle?: string;
}

export function DashboardCard({ title, value, subtitle }: DashboardCardProps) {
   return (
      <Card className="w-full">
         <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-500">
               {title}
            </CardTitle>
         </CardHeader>
         <CardContent>
            <p className="text-3xl font-semibold">{value}</p>
            {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
         </CardContent>
      </Card>
   );
}
