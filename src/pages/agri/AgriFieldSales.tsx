import IndustryLayout from "@/components/industry/IndustryLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { MapPin, Users, Target, TrendingUp, Route, ClipboardList, Store, Sprout } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const fieldOfficers = [
  { name: "Adamu Sani", territory: "Kaduna North", dealers: 24, visits: 18, target: 22, adoptionRate: 74 },
  { name: "Ngozi Okafor", territory: "Benue Valley", dealers: 31, visits: 28, target: 30, adoptionRate: 82 },
  { name: "Yusuf Ibrahim", territory: "Kano Central", dealers: 19, visits: 14, target: 20, adoptionRate: 68 },
  { name: "Grace Eze", territory: "Oyo West", dealers: 27, visits: 25, target: 26, adoptionRate: 79 },
];

const dealerPerformance = [
  { dealer: "Kaduna Agro Supplies", revenue: "₦4.2M", orders: 45, growth: 12 },
  { dealer: "Benue Farm Centre", revenue: "₦3.8M", orders: 38, growth: 8 },
  { dealer: "Kano Seed & Feed", revenue: "₦2.9M", orders: 32, growth: -3 },
  { dealer: "Oyo Agrochemicals", revenue: "₦2.1M", orders: 28, growth: 15 },
];

const territoryData = [
  { territory: "Kaduna", revenue: 4200, target: 5000 },
  { territory: "Benue", revenue: 3800, target: 4200 },
  { territory: "Kano", revenue: 2900, target: 3500 },
  { territory: "Oyo", revenue: 2100, target: 2800 },
  { territory: "Sokoto", revenue: 1800, target: 2500 },
];

const AgriFieldSales = () => (
  <IndustryLayout industryCode="agri">
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
          <MapPin className="w-7 h-7 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground">Field Sales Operations</h1>
          <p className="text-muted-foreground">Territory management, dealer visits, and farmer engagement</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Active Field Officers", value: "48", icon: Users, color: "text-amber-500" },
          { label: "Dealer Coverage", value: "1,284", icon: Store, color: "text-emerald-500" },
          { label: "Visit Completion", value: "85%", icon: ClipboardList, color: "text-blue-500" },
          { label: "Territory Achievement", value: "78%", icon: Target, color: "text-violet-500" },
        ].map((kpi) => (
          <Card key={kpi.label} className="border-border/50">
            <CardContent className="pt-5 pb-4">
              <kpi.icon className={`w-5 h-5 ${kpi.color} mb-2`} />
              <p className="text-2xl font-bold text-foreground">{kpi.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{kpi.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Field Officer Performance</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Officer</TableHead>
                  <TableHead>Territory</TableHead>
                  <TableHead>Visits</TableHead>
                  <TableHead>Adoption</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fieldOfficers.map((o) => (
                  <TableRow key={o.name}>
                    <TableCell className="font-medium">{o.name}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{o.territory}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{o.visits}/{o.target}</span>
                        <Progress value={(o.visits / o.target) * 100} className="h-1.5 w-16" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={o.adoptionRate > 75 ? "default" : "secondary"} className="text-[10px]">{o.adoptionRate}%</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Territory Revenue vs Target</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={territoryData}>
                <XAxis dataKey="territory" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(val: number) => `₦${(val / 1000).toFixed(1)}K`} />
                <Bar dataKey="target" fill="hsl(var(--muted))" radius={[4, 4, 0, 0]} name="Target" />
                <Bar dataKey="revenue" fill="hsl(142 76% 36%)" radius={[4, 4, 0, 0]} name="Revenue" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Top Agro-Dealer Performance</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Dealer</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead>Growth</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dealerPerformance.map((d) => (
                <TableRow key={d.dealer}>
                  <TableCell className="font-medium">{d.dealer}</TableCell>
                  <TableCell>{d.revenue}</TableCell>
                  <TableCell>{d.orders}</TableCell>
                  <TableCell>
                    <span className={d.growth > 0 ? "text-emerald-500" : "text-destructive"}>
                      {d.growth > 0 ? "+" : ""}{d.growth}%
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  </IndustryLayout>
);

export default AgriFieldSales;
