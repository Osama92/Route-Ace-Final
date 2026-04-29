import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import {
  Truck,
  MapPin,
  Fuel,
  Thermometer,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  Zap,
  Wind,
  Navigation,
  Shield,
  BarChart3,
  RefreshCw,
  Radio,
  Brain,
  ChevronUp,
  ChevronDown,
} from "lucide-react";

// ─── Mock Fleet Data ───
const mockVehicles = [
  { id: "1", plate: "LAG-234-KT", type: "30T Truck", driver: "Emeka Obi", status: "in_transit", lat: 6.52, lng: 3.38, fuel: 72, speed: 60, route: "Lagos → Ibadan", eta: "14:30", health: 88, alert: null },
  { id: "2", plate: "ABJ-890-LM", type: "20T Truck", driver: "Chukwu Ada", status: "idle", lat: 9.07, lng: 7.39, fuel: 41, speed: 0, route: "Abuja Depot", eta: "—", health: 95, alert: "Idle >2hrs" },
  { id: "3", plate: "KAN-567-RT", type: "15T Truck", driver: "Musa Garba", status: "maintenance", lat: 12.00, lng: 8.59, fuel: 15, speed: 0, route: "Kano Workshop", eta: "—", health: 42, alert: "Low Fuel + Service Due" },
  { id: "4", plate: "PHC-123-GA", type: "40T Truck", driver: "Amina Sule", status: "in_transit", lat: 4.81, lng: 7.04, fuel: 88, speed: 72, route: "PHC → Warri", eta: "16:00", health: 91, alert: null },
  { id: "5", plate: "ENO-445-BC", type: "Bike", driver: "Tunde Bello", status: "in_transit", lat: 6.45, lng: 3.41, fuel: 60, speed: 35, route: "VI → Lekki", eta: "13:50", health: 78, alert: null },
];

const mockKPIs = [
  { label: "On-Time Rate", value: "84%", trend: "+2%", up: true, icon: CheckCircle },
  { label: "Cost per KM", value: "₦87", trend: "-₦5", up: true, icon: Fuel },
  { label: "Revenue / Vehicle", value: "₦1.2M", trend: "+12%", up: true, icon: TrendingUp },
  { label: "Revenue / Driver", value: "₦980K", trend: "+8%", up: true, icon: Navigation },
  { label: "Idle Time Ratio", value: "18%", trend: "-3%", up: true, icon: Clock },
  { label: "Trip Completion", value: "96%", trend: "+1%", up: true, icon: Activity },
];

const mockAlerts = [
  { id: "1", type: "fuel_fraud", severity: "critical", vehicle: "KAN-567-RT", msg: "Fuel consumption 40% above route benchmark. Possible siphoning detected.", time: "12:14" },
  { id: "2", type: "geo_fence", severity: "high", vehicle: "ABJ-890-LM", msg: "Vehicle departed approved zone without dispatch assignment.", time: "11:58" },
  { id: "3", type: "fatigue", severity: "medium", vehicle: "PHC-123-GA", msg: "Driver Amina Sule has been driving for 6h 40min. Rest break recommended.", time: "11:30" },
  { id: "4", type: "maintenance", severity: "high", vehicle: "KAN-567-RT", msg: "Oil service overdue by 1,200km. Engine risk elevated.", time: "09:00" },
];

const statusColors: Record<string, string> = {
  in_transit: "bg-blue-500/20 text-blue-700 dark:text-blue-400",
  idle: "bg-yellow-500/20 text-yellow-700 dark:text-yellow-400",
  maintenance: "bg-destructive/20 text-destructive",
  available: "bg-green-500/20 text-green-700 dark:text-green-400",
};

const alertColors: Record<string, string> = {
  critical: "border-destructive bg-destructive/10",
  high: "border-orange-500 bg-orange-500/10",
  medium: "border-yellow-500 bg-yellow-500/10",
};

export default function FleetCommandCenter() {
  const [activeTab, setActiveTab] = useState("live");
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);

  const { data: fleetData, refetch } = useQuery({
    queryKey: ["fleet-command"],
    queryFn: async () => {
      const { data } = await supabase.from("vehicles").select("id, registration_number, truck_type, status").limit(20);
      return data || [];
    },
  });

  const selected = mockVehicles.find((v) => v.id === selectedVehicle);

  return (
    <DashboardLayout title="Fleet Command Center" subtitle="Real-time global fleet operations intelligence">
      {/* KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        {mockKPIs.map((k) => (
          <Card key={k.label}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-1">
                <k.icon className="w-4 h-4 text-muted-foreground" />
                <span className={`text-xs flex items-center ${k.up ? "text-green-500" : "text-destructive"}`}>
                  {k.up ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  {k.trend}
                </span>
              </div>
              <p className="text-xl font-bold">{k.value}</p>
              <p className="text-xs text-muted-foreground">{k.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Critical Alerts Banner */}
      {mockAlerts.filter((a) => a.severity === "critical").length > 0 && (
        <Alert className="mb-4 border-destructive bg-destructive/10">
          <AlertTriangle className="w-4 h-4 text-destructive" />
          <AlertDescription className="text-destructive font-medium">
            {mockAlerts.filter((a) => a.severity === "critical").length} critical fleet alert(s) require immediate attention.
          </AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="flex-wrap h-auto gap-1 mb-4">
          <TabsTrigger value="live">Live Tracking</TabsTrigger>
          <TabsTrigger value="alerts">Alerts & Fraud</TabsTrigger>
          <TabsTrigger value="fuel">Fuel Analytics</TabsTrigger>
          <TabsTrigger value="predictive">Predictive AI</TabsTrigger>
          <TabsTrigger value="kpi">KPI Dashboard</TabsTrigger>
        </TabsList>

        {/* ─── LIVE TRACKING ─── */}
        <TabsContent value="live">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Vehicle List */}
            <div className="lg:col-span-1 space-y-2">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-sm">Fleet Status ({mockVehicles.length})</h3>
                <Button variant="ghost" size="sm" onClick={() => refetch()}><RefreshCw className="w-3 h-3" /></Button>
              </div>
              {mockVehicles.map((v) => (
                <Card
                  key={v.id}
                  className={`cursor-pointer transition-all ${selectedVehicle === v.id ? "ring-2 ring-primary" : ""}`}
                  onClick={() => setSelectedVehicle(v.id === selectedVehicle ? null : v.id)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-mono font-semibold text-sm">{v.plate}</p>
                        <p className="text-xs text-muted-foreground">{v.driver}</p>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[v.status]}`}>{v.status.replace("_", " ")}</span>
                    </div>
                    <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{v.route.split("→")[0].trim()}</span>
                      <span className="flex items-center gap-1"><Fuel className="w-3 h-3" />{v.fuel}%</span>
                      {v.speed > 0 && <span>{v.speed} km/h</span>}
                    </div>
                    {v.alert && (
                      <div className="mt-2 flex items-center gap-1 text-xs text-destructive">
                        <AlertTriangle className="w-3 h-3" />{v.alert}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Map placeholder + Vehicle Detail */}
            <div className="lg:col-span-2 space-y-4">
              <Card className="h-72">
                <CardContent className="p-0 h-full">
                  <div className="w-full h-full bg-gradient-to-br from-muted/50 to-muted rounded-lg flex flex-col items-center justify-center gap-3">
                    <Radio className="w-10 h-10 text-primary animate-pulse" />
                    <p className="font-medium">Live Map View</p>
                    <p className="text-sm text-muted-foreground text-center px-8">
                      Connect Mapbox token in Settings to enable real-time vehicle tracking map with geo-fencing, heat maps, and route overlays.
                    </p>
                    <div className="flex gap-2 flex-wrap justify-center">
                      {mockVehicles.filter(v => v.status === "in_transit").map(v => (
                        <Badge key={v.id} variant="outline" className="text-xs">
                          <Navigation className="w-3 h-3 mr-1" />{v.plate}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {selected && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Truck className="w-4 h-4" />{selected.plate} — {selected.type}
                    </CardTitle>
                    <CardDescription>Driver: {selected.driver}</CardDescription>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="space-y-1">
                      <p className="text-muted-foreground text-xs">Fuel Level</p>
                      <Progress value={selected.fuel} className="h-2" />
                      <p className="font-medium">{selected.fuel}%</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-muted-foreground text-xs">Fleet Health Score</p>
                      <Progress value={selected.health} className="h-2" />
                      <p className="font-medium">{selected.health}/100</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-muted-foreground text-xs">Speed</p>
                      <p className="text-xl font-bold">{selected.speed} <span className="text-xs font-normal">km/h</span></p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-muted-foreground text-xs">ETA</p>
                      <p className="text-xl font-bold">{selected.eta}</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        {/* ─── ALERTS & FRAUD ─── */}
        <TabsContent value="alerts">
          <div className="space-y-3">
            {mockAlerts.map((alert) => (
              <Card key={alert.id} className={`border ${alertColors[alert.severity]}`}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${alert.severity === "critical" ? "text-destructive" : alert.severity === "high" ? "text-orange-500" : "text-yellow-500"}`} />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-sm">{alert.vehicle}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">{alert.time}</span>
                          <Badge variant="outline" className="text-xs capitalize">{alert.severity}</Badge>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{alert.msg}</p>
                      <div className="flex gap-2 mt-2">
                        <Button size="sm" variant="outline" className="h-7 text-xs">Acknowledge</Button>
                        <Button size="sm" variant="outline" className="h-7 text-xs text-destructive">Escalate</Button>
                        <Button size="sm" variant="outline" className="h-7 text-xs">View Vehicle</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* ─── FUEL ANALYTICS ─── */}
        <TabsContent value="fuel">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader><CardTitle className="text-base flex items-center gap-2"><Fuel className="w-4 h-4" /> Fuel Status by Vehicle</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {mockVehicles.map((v) => (
                  <div key={v.id} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="font-mono">{v.plate}</span>
                      <span className={v.fuel < 25 ? "text-destructive font-medium" : ""}>{v.fuel}%</span>
                    </div>
                    <Progress value={v.fuel} className={`h-2 ${v.fuel < 25 ? "[&>div]:bg-destructive" : ""}`} />
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-base">Fuel Consumption vs Benchmark</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {mockVehicles.slice(0, 4).map((v, i) => {
                  const variance = [-5, 40, 8, -3][i];
                  return (
                    <div key={v.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div>
                        <p className="font-mono font-medium text-sm">{v.plate}</p>
                        <p className="text-xs text-muted-foreground">{v.type}</p>
                      </div>
                      <span className={`flex items-center gap-1 font-medium text-sm ${variance > 10 ? "text-destructive" : variance < 0 ? "text-green-500" : "text-yellow-500"}`}>
                        {variance > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        {variance > 0 ? "+" : ""}{variance}%
                      </span>
                    </div>
                  );
                })}
                <p className="text-xs text-muted-foreground">* Variance from expected consumption per route km</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ─── PREDICTIVE AI ─── */}
        <TabsContent value="predictive">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { title: "Delay Risk Prediction", icon: Clock, insights: ["PHC-123-GA: 34% delay risk (traffic on Warri road)", "ABJ-890-LM: Low risk – routes clear", "KAN-567-RT: High risk – maintenance pending"] },
              { title: "Driver Fatigue Monitor", icon: Wind, insights: ["Amina Sule: 6h 40m driving – rest break advised", "Emeka Obi: 4h 20m – within safe limits", "Musa Garba: Not driving – in workshop"] },
              { title: "Maintenance Prediction", icon: Thermometer, insights: ["KAN-567-RT: Oil change overdue (1,200km past schedule)", "ENO-445-BC: Tyre check due in 3 days", "LAG-234-KT: All checks up to date"] },
              { title: "Route Profitability AI", icon: Brain, insights: ["Lagos–Ibadan: ₦892/km margin – top performer", "PHC–Warri: ₦641/km – watch fuel costs", "Kano routes: Deprioritise until maintenance resolved"] },
            ].map((section) => (
              <Card key={section.title}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <section.icon className="w-4 h-4 text-primary" />{section.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {section.insights.map((insight, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                      {insight}
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* ─── KPI DASHBOARD ─── */}
        <TabsContent value="kpi">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vehicle</TableHead>
                <TableHead>Driver</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Trips MTD</TableHead>
                <TableHead>Revenue MTD</TableHead>
                <TableHead>On-Time %</TableHead>
                <TableHead>Health</TableHead>
                <TableHead>Fuel Efficiency</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockVehicles.map((v, i) => (
                <TableRow key={v.id}>
                  <TableCell className="font-mono text-sm">{v.plate}</TableCell>
                  <TableCell className="text-sm">{v.driver}</TableCell>
                  <TableCell><span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[v.status]}`}>{v.status.replace("_", " ")}</span></TableCell>
                  <TableCell>{8 + i * 2}</TableCell>
                  <TableCell>₦{(800 + i * 120).toFixed(0)}K</TableCell>
                  <TableCell>
                    <span className={[92, 78, 0, 95, 88][i] < 80 ? "text-destructive" : "text-green-500"}>{[92, 78, 0, 95, 88][i]}%</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={v.health} className="h-1.5 w-16" />
                      <span className="text-xs">{v.health}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={v.fuel < 25 ? "text-destructive" : ""}>{[8.2, 9.4, 11.1, 7.9, 5.2][i]} L/100km</span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}
