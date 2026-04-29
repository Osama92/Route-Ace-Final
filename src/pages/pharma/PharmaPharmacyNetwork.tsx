import IndustryLayout from "@/components/industry/IndustryLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Store, MapPin, TrendingUp, Users, Package, Star, Activity } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const pharmacyCoverage = [
  { state: "Lagos", total: 2400, active: 2180, coverage: 91 },
  { state: "Abuja", total: 890, active: 780, coverage: 88 },
  { state: "Rivers", total: 640, active: 520, coverage: 81 },
  { state: "Kano", total: 580, active: 410, coverage: 71 },
  { state: "Oyo", total: 450, active: 380, coverage: 84 },
  { state: "Anambra", total: 380, active: 290, coverage: 76 },
];

const topPharmacies = [
  { name: "MedPlus Pharmacy", location: "Victoria Island, Lagos", orders: 342, revenue: "₦18.4M", compliance: 98, tier: "Platinum" },
  { name: "HealthPlus Ltd", location: "Lekki, Lagos", orders: 289, revenue: "₦15.2M", compliance: 96, tier: "Gold" },
  { name: "Alpha Pharmacy", location: "Wuse, Abuja", orders: 234, revenue: "₦12.8M", compliance: 94, tier: "Gold" },
  { name: "Bagudu Pharmacy", location: "Kano Central", orders: 198, revenue: "₦9.6M", compliance: 91, tier: "Silver" },
  { name: "RxPharmacy", location: "GRA, Port Harcourt", orders: 176, revenue: "₦8.4M", compliance: 89, tier: "Silver" },
];

const PharmaPharmacyNetwork = () => (
  <IndustryLayout industryCode="pharma">
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-bold text-foreground">Pharmacy Network Management</h1>
        <p className="text-muted-foreground mt-1">Monitor pharmacy coverage, performance, and compliance across the distribution network</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Total Pharmacies", value: "5,340", icon: Store, color: "text-primary" },
          { label: "Active Partners", value: "4,560", icon: Users, color: "text-emerald-500" },
          { label: "Avg. Order Value", value: "₦284K", icon: Package, color: "text-primary" },
          { label: "Network Coverage", value: "85.4%", icon: MapPin, color: "text-emerald-500" },
        ].map((kpi) => (
          <Card key={kpi.label}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{kpi.label}</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{kpi.value}</p>
                </div>
                <kpi.icon className={`w-8 h-8 ${kpi.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader><CardTitle className="text-lg">Coverage by State</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={pharmacyCoverage} layout="vertical">
              <XAxis type="number" domain={[0, 100]} stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis type="category" dataKey="state" stroke="hsl(var(--muted-foreground))" fontSize={12} width={80} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }} />
              <Bar dataKey="coverage" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-lg">Top Performing Pharmacies</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pharmacy</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Orders (MTD)</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead>Compliance</TableHead>
                <TableHead>Tier</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topPharmacies.map((p) => (
                <TableRow key={p.name}>
                  <TableCell className="font-medium">{p.name}</TableCell>
                  <TableCell className="text-muted-foreground">{p.location}</TableCell>
                  <TableCell>{p.orders}</TableCell>
                  <TableCell>{p.revenue}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={p.compliance} className="h-2 w-16" />
                      <span className="text-sm">{p.compliance}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={p.tier === "Platinum" ? "default" : "secondary"} className="text-xs">{p.tier}</Badge>
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

export default PharmaPharmacyNetwork;
