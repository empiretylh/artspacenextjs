import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
   Table,
   TableHeader,
   TableBody,
   TableRow,
   TableCell,
   TableHead,
} from "@/components/ui/table";
import {
   LineChart,
   Line,
   XAxis,
   YAxis,
   CartesianGrid,
   Tooltip,
   ResponsiveContainer,
} from "recharts";
import { DashboardCard } from "../components/dashboard-card";

const stats = [
   { title: "Total Users", value: "1,245", subtitle: "+8% this week" },
   { title: "Revenue", value: "$24,580", subtitle: "+12% this month" },
   { title: "Active Sessions", value: "342", subtitle: "-3% from yesterday" },
   { title: "Bounce Rate", value: "24%", subtitle: "-1.5%" },
];

const chartData = [
   { name: "Mon", users: 400 },
   { name: "Tue", users: 300 },
   { name: "Wed", users: 600 },
   { name: "Thu", users: 800 },
   { name: "Fri", users: 500 },
   { name: "Sat", users: 700 },
   { name: "Sun", users: 650 },
];

const recentUsers = [
   { name: "Alice Johnson", email: "alice@example.com", status: "Active" },
   { name: "Bob Smith", email: "bob@example.com", status: "Inactive" },
   { name: "Carol White", email: "carol@example.com", status: "Active" },
   { name: "David Brown", email: "david@example.com", status: "Pending" },
];

export default function DashboardPage() {
   return (
      <div className="p-6 space-y-8">
         <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>

         {/* Stats Cards */}
         <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((s) => (
               <DashboardCard
                  key={s.title}
                  title={s.title}
                  value={s.value}
                  subtitle={s.subtitle}
               />
            ))}
         </div>

         {/* Chart */}
         <Card>
            <CardHeader>
               <CardTitle>User Growth</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
               <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                     <CartesianGrid strokeDasharray="3 3" />
                     <XAxis dataKey="name" />
                     <YAxis />
                     <Tooltip />
                     <Line
                        type="monotone"
                        dataKey="users"
                        stroke="#3b82f6"
                        strokeWidth={2}
                     />
                  </LineChart>
               </ResponsiveContainer>
            </CardContent>
         </Card>

         {/* Table */}
         <Card>
            <CardHeader>
               <CardTitle>Recent Users</CardTitle>
            </CardHeader>
            <CardContent>
               <Table>
                  <TableHeader>
                     <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Status</TableHead>
                     </TableRow>
                  </TableHeader>
                  <TableBody>
                     {recentUsers.map((user) => (
                        <TableRow key={user.email}>
                           <TableCell className="font-medium">
                              {user.name}
                           </TableCell>
                           <TableCell>{user.email}</TableCell>
                           <TableCell>{user.status}</TableCell>
                        </TableRow>
                     ))}
                  </TableBody>
               </Table>
            </CardContent>
         </Card>
      </div>
   );
}
