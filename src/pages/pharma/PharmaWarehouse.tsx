import IndustryLayout from "@/components/industry/IndustryLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Warehouse, Thermometer, Package, AlertTriangle, Clock, CheckCircle, BarChart3 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const warehouseZones = [
  { name: "Ambient Storage", capacity: 72, skus: 340, value: "₦890M", temp: "25°C", status: "normal" },
  { name: "Cold Room (2–8°C)", capacity: 81, skus: 85, value: "₦2.1B", temp: "4.2°C", status: "normal" },
  { name: "Frozen (-20°C)", capacity: 45, skus: 18, value: "₦340M", temp: "-19.5°C", status: "normal" },
  { name: "Controlled Substances", capacity: 62, skus: 24, value: "₦180M", temp: "22°C", status: "secured" },
  { name: "Quarantine Zone", capacity: 28, skus: 12, value: "₦45M", temp: "24°C", status: "restricted" },
];

const expiryBreakdown = [
  { range: "Expired", count: 4, color: "hsl(0 84% 60%)" },
  { range: "<90 days", count: 38, color: "hsl(25 95% 53%)" },
  { range: "90–180 days", count: 82, color: "hsl(45 93% 47%)" },
  { range: ">180 days", count: 355, color: "hsl(142 76% 36%)" },
];

const stockMovement = [
  { month: "Jan", inbound: 12400, outbound: 11800 },
  { month: "Feb", inbound: 13200, outbound: 12600 },
  { month: "Mar", inbound: 14800, outbound: 13200 },
  { month: "Apr", inbound: 13600, outbound: 14100 },
  { month: "May", inbound: 15200, outbound: 14800 },
];

const PharmaWarehouse = () => (
  <IndustryLayout industryCode="pharma">
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-bold text-foreground">Pharmaceutical Warehouse</h1>
        <p className="text-muted-foreground mt-1">Cold storage monitoring, batch traceability, and regulatory-compliant inventory management</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Total SKUs", value: "479", icon: Package, color: "text-primary" },
          { label: "Warehouse Utilization", value: "68%", icon: Warehouse, color: "text-primary" },
          { label: "Expiring (<90d)", value: "38", icon: Clock, color: "text-amber-500" },
          { label: "Stock Accuracy", value: "99.2%", icon: CheckCircle, color: "text-emerald-500" },
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
        <CardHeader><CardTitle className="text-lg">Storage Zones</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {warehouseZones.map((z) => (
              <div key={z.name} className="p-4 rounded-xl border border-border">
                <div className="flex items-center justify-between mb-3">
                  <p className="font-medium text-foreground text-sm">{z.name}</p>
                  <Badge variant={z.status === "normal" ? "default" : z.status === "secured" ? "secondary" : "destructive"} className="text-xs capitalize">{z.status}</Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Capacity</span>
                    <span className="text-foreground font-medium">{z.capacity}%</span>
                  </div>
                  <Progress value={z.capacity} className="h-2" />
                  <div className="grid grid-cols-2 gap-1 text-xs text-muted-foreground mt-2">
                    <span>{z.skus} SKUs</span>
                    <span className="text-right">{z.value}</span>
                    <span className="flex items-center gap-1"><Thermometer className="w-3 h-3" />{z.temp}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-lg">Expiry Distribution</CardTitle></CardHeader>
          <CardContent className="flex justify-center">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={expiryBreakdown} dataKey="count" nameKey="range" cx="50%" cy="50%" outerRadius={90} label={({ range, count }) => `${range}: ${count}`}>
                  {expiryBreakdown.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-lg">Stock Movement</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={stockMovement}>
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }} />
                <Bar dataKey="inbound" fill="hsl(var(--primary))" name="Inbound" radius={[4, 4, 0, 0]} />
                <Bar dataKey="outbound" fill="hsl(142 76% 36%)" name="Outbound" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  </IndustryLayout>
);

export default PharmaWarehouse;
