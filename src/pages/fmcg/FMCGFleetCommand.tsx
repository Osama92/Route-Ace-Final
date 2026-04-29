import FMCGLayout from "@/components/fmcg/FMCGLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Truck, Fuel, Clock, AlertTriangle, MapPin, Route,
  Gauge, ShieldCheck, Wrench, Users, BarChart3, Activity,
} from "lucide-react";

const fleetStats = [
  { label: "Total Fleet", value: "15", icon: Truck, color: "text-primary" },
  { label: "On Route", value: "12", icon: Route, color: "text-emerald-600" },
  { label: "Avg Fuel Level", value: "58%", icon: Fuel, color: "text-orange-600" },
  { label: "SLA On-Time", value: "91.3%", icon: ShieldCheck, color: "text-blue-600" },
];

const vehicles = [
  { plate: "LAG-234-KJ", type: "Van", driver: "Emeka O.", status: "on_route", route: "Ikeja-Ogba Loop", fuel: 65, deliveries: 8, km: 42, lastMaint: "2026-02-15", health: 92 },
  { plate: "LAG-891-AB", type: "Truck", driver: "Adamu M.", status: "on_route", route: "Surulere-Yaba", fuel: 42, deliveries: 5, km: 28, lastMaint: "2026-01-20", health: 78 },
  { plate: "LAG-567-CD", type: "Van", driver: "Uche K.", status: "returning", route: "Victoria Island", fuel: 28, deliveries: 6, km: 35, lastMaint: "2026-03-01", health: 95 },
  { plate: "LAG-123-EF", type: "Truck", driver: "Bayo T.", status: "on_route", route: "Ikorodu Express", fuel: 88, deliveries: 1, km: 12, lastMaint: "2026-02-28", health: 88 },
  { plate: "LAG-456-GH", type: "Van", driver: "Kunle B.", status: "loading", route: "Ajah Corridor", fuel: 95, deliveries: 0, km: 0, lastMaint: "2026-03-05", health: 96 },
  { plate: "LAG-789-IJ", type: "Truck", driver: "Segun A.", status: "maintenance", route: "—", fuel: 50, deliveries: 0, km: 0, lastMaint: "2026-03-08", health: 45 },
];

const slaMetrics = [
  { route: "Ikeja-Ogba Loop", target: "3hr", actual: "2h 45m", status: "on_track", deliveries: 12, completion: 67 },
  { route: "Surulere-Yaba", target: "2.5hr", actual: "2h 50m", status: "at_risk", deliveries: 8, completion: 38 },
  { route: "Victoria Island", target: "2hr", actual: "1h 55m", status: "on_track", deliveries: 6, completion: 100 },
  { route: "Ikorodu Express", target: "4hr", actual: "0h 45m", status: "on_track", deliveries: 10, completion: 10 },
  { route: "Ajah Corridor", target: "3hr", actual: "—", status: "not_started", deliveries: 8, completion: 0 },
];

const exceptions = [
  { id: "EX-01", vehicle: "LAG-891-AB", type: "Fuel Low", details: "42% fuel — may not complete remaining 5 drops", severity: "medium" },
  { id: "EX-02", vehicle: "LAG-789-IJ", type: "Breakdown", details: "Engine warning light — sent to workshop", severity: "high" },
  { id: "EX-03", vehicle: "LAG-567-CD", type: "Late Return", details: "Expected 2:00 PM, currently ETA 2:40 PM", severity: "low" },
];

const statusColor = (s: string) => {
  switch (s) {
    case "on_route": return "default";
    case "returning": case "loading": return "secondary";
    case "maintenance": return "destructive";
    default: return "outline";
  }
};

const FMCGFleetCommand = () => (
  <FMCGLayout title="Fleet Command Center" subtitle="FMCG distribution fleet, SLA monitoring & exception handling">
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {fleetStats.map((s) => (
        <Card key={s.label}>
          <CardContent className="pt-6 flex items-center gap-4">
            <s.icon className={`w-8 h-8 ${s.color}`} />
            <div>
              <p className="text-sm text-muted-foreground">{s.label}</p>
              <p className="text-2xl font-bold">{s.value}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>

    <Tabs defaultValue="fleet">
      <TabsList className="mb-4">
        <TabsTrigger value="fleet">Fleet Status</TabsTrigger>
        <TabsTrigger value="sla">SLA Monitor</TabsTrigger>
        <TabsTrigger value="exceptions">Exceptions</TabsTrigger>
        <TabsTrigger value="fuel">Fuel Analytics</TabsTrigger>
      </TabsList>

      <TabsContent value="fleet">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Truck className="w-5 h-5" /> Vehicle Fleet</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {vehicles.map((v) => (
                <div key={v.plate} className="p-3 rounded-lg border space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Truck className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="font-mono font-medium text-sm">{v.plate}</p>
                        <p className="text-xs text-muted-foreground">{v.type} · {v.driver} · {v.route}</p>
                      </div>
                    </div>
                    <Badge variant={statusColor(v.status)}>{v.status.replace("_", " ")}</Badge>
                  </div>
                  <div className="grid grid-cols-5 gap-3 text-xs">
                    <div className="flex items-center gap-1"><Fuel className="w-3 h-3" /> {v.fuel}%</div>
                    <div className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {v.deliveries} drops</div>
                    <div className="flex items-center gap-1"><Route className="w-3 h-3" /> {v.km} km</div>
                    <div className="flex items-center gap-1"><Wrench className="w-3 h-3" /> {v.lastMaint}</div>
                    <div className="flex items-center gap-1">
                      <Gauge className="w-3 h-3" />
                      <span className={v.health >= 80 ? "text-emerald-600" : v.health >= 60 ? "text-orange-600" : "text-destructive"}>{v.health}% health</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="sla">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><ShieldCheck className="w-5 h-5" /> Delivery SLA Monitoring</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {slaMetrics.map((sla) => (
                <div key={sla.route} className="p-3 rounded-lg border space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">{sla.route}</p>
                      <p className="text-xs text-muted-foreground">Target: {sla.target} · Actual: {sla.actual}</p>
                    </div>
                    <Badge variant={sla.status === "on_track" ? "default" : sla.status === "at_risk" ? "destructive" : "outline"}>
                      {sla.status.replace("_", " ")}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Completion: {sla.completion}% ({sla.deliveries} drops)</p>
                    <Progress value={sla.completion} className="h-1.5" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="exceptions">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-destructive" /> Delivery Exceptions</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {exceptions.map((e) => (
                <div key={e.id} className="flex items-start gap-3 p-3 rounded-lg border">
                  <div className={`w-2.5 h-2.5 rounded-full mt-1.5 ${e.severity === "high" ? "bg-destructive" : e.severity === "medium" ? "bg-orange-500" : "bg-yellow-500"}`} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm">{e.type}</p>
                      <Badge variant="outline" className="font-mono text-xs">{e.vehicle}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{e.details}</p>
                  </div>
                  <Badge variant={e.severity === "high" ? "destructive" : "secondary"}>{e.severity}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="fuel">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Fuel className="w-5 h-5" /> Fuel Cost Analytics</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="p-4 rounded-lg bg-muted/50 text-center"><p className="text-2xl font-bold">₦847K</p><p className="text-xs text-muted-foreground">Total Fuel Cost MTD</p></div>
              <div className="p-4 rounded-lg bg-muted/50 text-center"><p className="text-2xl font-bold">8.2 km/L</p><p className="text-xs text-muted-foreground">Avg Fleet Efficiency</p></div>
              <div className="p-4 rounded-lg bg-muted/50 text-center"><p className="text-2xl font-bold">₦56K</p><p className="text-xs text-muted-foreground">Avg Cost per Vehicle/Day</p></div>
            </div>
            <div className="space-y-2">
              {vehicles.filter(v => v.status !== "maintenance").map((v) => (
                <div key={v.plate} className="flex items-center gap-3">
                  <span className="font-mono text-xs w-24">{v.plate}</span>
                  <div className="flex-1"><Progress value={v.fuel} className="h-2" /></div>
                  <span className={`text-sm font-medium w-12 text-right ${v.fuel < 40 ? "text-destructive" : "text-foreground"}`}>{v.fuel}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  </FMCGLayout>
);

export default FMCGFleetCommand;
