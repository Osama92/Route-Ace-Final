import IndustryLayout from "@/components/industry/IndustryLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Truck, Package, MapPin, Clock, AlertTriangle, CheckCircle, Route,
  Warehouse, BarChart3, Zap, ShieldCheck,
} from "lucide-react";

const fleetStatus = [
  { vehicle: "LG-234-KJA", driver: "Musa K.", route: "Victoria Island Route", drops: 8, completed: 5, status: "in_transit", eta: "1:30 PM", cases: 124 },
  { vehicle: "LG-567-ABJ", driver: "Emeka O.", route: "Ikeja-Allen Route", drops: 6, completed: 6, status: "completed", eta: "Done", cases: 96 },
  { vehicle: "LG-891-PHC", driver: "Kunle B.", route: "Surulere Route", drops: 10, completed: 3, status: "in_transit", eta: "3:15 PM", cases: 180 },
  { vehicle: "LG-112-KAN", driver: "Femi A.", route: "Lekki Corridor", drops: 5, completed: 0, status: "loading", eta: "12:00 PM", cases: 72 },
];

const warehouseStatus = [
  { zone: "Spirits Zone A", capacity: 85, items: 12400, temp: "18°C", alerts: 0 },
  { zone: "Beer Cold Storage", capacity: 72, items: 24800, temp: "4°C", alerts: 1 },
  { zone: "Wine Cellar", capacity: 45, items: 3200, temp: "14°C", alerts: 0 },
  { zone: "Staging Area", capacity: 90, items: 840, temp: "22°C", alerts: 2 },
];

const statusColors = {
  in_transit: "bg-blue-500/15 text-blue-400",
  completed: "bg-emerald-500/15 text-emerald-400",
  loading: "bg-amber-500/15 text-amber-400",
};

const LiquorDistribution = () => (
  <IndustryLayout industryCode="liquor">
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, hsl(0 72% 51%), hsl(348 83% 47%))" }}>
          <Truck className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-heading font-bold">Distribution Logistics</h1>
          <p className="text-sm text-muted-foreground">Fleet tracking, warehouse ops & delivery execution</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card><CardContent className="pt-5 text-center">
          <Truck className="w-5 h-5 mx-auto mb-1 text-blue-400" />
          <p className="text-xl font-bold">18</p>
          <p className="text-xs text-muted-foreground">Active Vehicles</p>
        </CardContent></Card>
        <Card><CardContent className="pt-5 text-center">
          <Package className="w-5 h-5 mx-auto mb-1 text-rose-400" />
          <p className="text-xl font-bold">1,240</p>
          <p className="text-xs text-muted-foreground">Cases in Transit</p>
        </CardContent></Card>
        <Card><CardContent className="pt-5 text-center">
          <CheckCircle className="w-5 h-5 mx-auto mb-1 text-emerald-400" />
          <p className="text-xl font-bold">94.1%</p>
          <p className="text-xs text-muted-foreground">On-Time Delivery</p>
        </CardContent></Card>
        <Card><CardContent className="pt-5 text-center">
          <ShieldCheck className="w-5 h-5 mx-auto mb-1 text-violet-400" />
          <p className="text-xl font-bold">99.2%</p>
          <p className="text-xs text-muted-foreground">Breakage-Free Rate</p>
        </CardContent></Card>
      </div>

      <Tabs defaultValue="fleet" className="space-y-4">
        <TabsList>
          <TabsTrigger value="fleet">Fleet Tracker</TabsTrigger>
          <TabsTrigger value="warehouse">Warehouse Status</TabsTrigger>
          <TabsTrigger value="3pl">3PL Partners</TabsTrigger>
        </TabsList>

        <TabsContent value="fleet" className="space-y-3">
          {fleetStatus.map((v) => (
            <Card key={v.vehicle}>
              <CardContent className="py-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <Truck className="w-5 h-5 text-rose-400" />
                    <div>
                      <p className="font-semibold text-sm">{v.route}</p>
                      <p className="text-xs text-muted-foreground">{v.vehicle} · {v.driver} · {v.cases} cases</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={`text-xs ${statusColors[v.status as keyof typeof statusColors]}`}>{v.status.replace("_", " ")}</Badge>
                    <Badge variant="outline">{v.eta}</Badge>
                  </div>
                </div>
                <Progress value={(v.completed / v.drops) * 100} className="h-1.5" />
                <p className="text-xs text-muted-foreground mt-1">{v.completed}/{v.drops} drops completed</p>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="warehouse" className="space-y-3">
          {warehouseStatus.map((w) => (
            <Card key={w.zone} className={w.alerts > 0 ? "border-amber-500/30" : ""}>
              <CardContent className="py-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <Warehouse className="w-5 h-5 text-violet-400" />
                    <div>
                      <p className="font-semibold text-sm">{w.zone}</p>
                      <p className="text-xs text-muted-foreground">{w.items.toLocaleString()} items · {w.temp}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {w.alerts > 0 && <Badge variant="destructive" className="text-xs">{w.alerts} alert{w.alerts > 1 ? "s" : ""}</Badge>}
                    <span className="text-sm font-bold">{w.capacity}%</span>
                  </div>
                </div>
                <Progress value={w.capacity} className="h-1.5" />
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="3pl" className="space-y-3">
          {[
            { partner: "SwiftMove Logistics", territory: "Lagos Island / VI", slaScore: 96, deliveries: 842, onTime: 94.8, breakage: 0.3, costPerCase: "₦280", vehicles: 8, contract: "Active", renewal: "Jun 2026" },
            { partner: "Eagle Transport Co.", territory: "Lagos Mainland", slaScore: 88, deliveries: 614, onTime: 89.2, breakage: 1.1, costPerCase: "₦320", vehicles: 5, contract: "Active", renewal: "Sep 2026" },
            { partner: "Capital Freight Ltd", territory: "Abuja / FCT", slaScore: 91, deliveries: 428, onTime: 92.1, breakage: 0.6, costPerCase: "₦410", vehicles: 4, contract: "Active", renewal: "Dec 2026" },
            { partner: "Southern Carriers", territory: "Port Harcourt", slaScore: 72, deliveries: 286, onTime: 82.5, breakage: 2.4, costPerCase: "₦380", vehicles: 3, contract: "Under Review", renewal: "Apr 2026" },
          ].map((p) => (
            <Card key={p.partner} className={p.slaScore < 80 ? "border-destructive/30" : ""}>
              <CardContent className="py-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Route className="w-5 h-5 text-violet-400" />
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-sm">{p.partner}</p>
                        <Badge className={p.contract === "Active" ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30 text-xs" : "bg-amber-500/15 text-amber-400 border-amber-500/30 text-xs"}>{p.contract}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{p.territory} · {p.vehicles} vehicles · Renewal: {p.renewal}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold">{p.slaScore}</p>
                    <p className="text-xs text-muted-foreground">SLA Score</p>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-4 text-center">
                  <div>
                    <p className="text-sm font-bold">{p.deliveries.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Deliveries MTD</p>
                  </div>
                  <div>
                    <p className="text-sm font-bold">{p.onTime}%</p>
                    <p className="text-xs text-muted-foreground">On-Time Rate</p>
                  </div>
                  <div>
                    <p className={`text-sm font-bold ${p.breakage > 1.0 ? "text-destructive" : ""}`}>{p.breakage}%</p>
                    <p className="text-xs text-muted-foreground">Breakage Rate</p>
                  </div>
                  <div>
                    <p className="text-sm font-bold">{p.costPerCase}</p>
                    <p className="text-xs text-muted-foreground">Cost/Case</p>
                  </div>
                </div>
                <Progress value={p.slaScore} className="h-1.5 mt-3" />
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  </IndustryLayout>
);

export default LiquorDistribution;
