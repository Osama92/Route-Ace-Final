import IndustryLayout from "@/components/industry/IndustryLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Truck, MapPin, Clock, CheckCircle, Thermometer, Route, Package } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const activeShipments = [
  { id: "SHP-4821", destination: "MedPlus, VI Lagos", driver: "Yusuf Musa", status: "in_transit", eta: "14:30", temp: "4.1°C", items: 12, cold: true },
  { id: "SHP-4822", destination: "Alpha Pharmacy, Abuja", driver: "Emmanuel Ike", status: "loading", eta: "—", temp: "—", items: 28, cold: false },
  { id: "SHP-4823", destination: "LUTH Hospital", driver: "Bola Adeniyi", status: "in_transit", eta: "15:45", temp: "3.8°C", items: 8, cold: true },
  { id: "SHP-4824", destination: "Bagudu Pharmacy, Kano", driver: "Sani Abdullahi", status: "delivered", eta: "Completed", temp: "—", items: 34, cold: false },
  { id: "SHP-4825", destination: "HealthPlus, Lekki", driver: "Tunde Olaiya", status: "in_transit", eta: "16:20", temp: "5.2°C", items: 15, cold: true },
];

const routePerformance = [
  { route: "Lagos Central", deliveries: 48, onTime: 94, avgTime: "2.1h" },
  { route: "Lagos–Ibadan", deliveries: 22, onTime: 88, avgTime: "4.5h" },
  { route: "Abuja Metro", deliveries: 34, onTime: 91, avgTime: "1.8h" },
  { route: "Lagos–PH", deliveries: 12, onTime: 82, avgTime: "8.2h" },
  { route: "Kano Region", deliveries: 18, onTime: 86, avgTime: "3.4h" },
];

const PharmaDistributionLogistics = () => (
  <IndustryLayout industryCode="pharma">
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-bold text-foreground">Distribution Logistics</h1>
        <p className="text-muted-foreground mt-1">Track pharmaceutical shipments, cold chain compliance, and delivery performance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Active Shipments", value: "24", icon: Truck, color: "text-primary" },
          { label: "On-Time Delivery", value: "91.2%", icon: Clock, color: "text-emerald-500" },
          { label: "Cold Chain Active", value: "14", icon: Thermometer, color: "text-primary" },
          { label: "Delivered Today", value: "38", icon: CheckCircle, color: "text-emerald-500" },
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
        <CardHeader><CardTitle className="text-lg">Active Shipments</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Shipment</TableHead>
                <TableHead>Destination</TableHead>
                <TableHead>Driver</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Cold Chain</TableHead>
                <TableHead>ETA</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activeShipments.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="font-mono text-sm">{s.id}</TableCell>
                  <TableCell className="font-medium">{s.destination}</TableCell>
                  <TableCell className="text-muted-foreground">{s.driver}</TableCell>
                  <TableCell>{s.items}</TableCell>
                  <TableCell>
                    {s.cold ? (
                      <div className="flex items-center gap-1">
                        <Thermometer className="w-4 h-4 text-primary" />
                        <span className="text-sm text-foreground">{s.temp}</span>
                      </div>
                    ) : <span className="text-muted-foreground text-sm">N/A</span>}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{s.eta}</TableCell>
                  <TableCell>
                    <Badge variant={s.status === "delivered" ? "default" : s.status === "in_transit" ? "secondary" : "outline"} className="text-xs capitalize">
                      {s.status.replace("_", " ")}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-lg">Route Performance</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {routePerformance.map((r) => (
              <div key={r.route} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <Route className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium text-foreground text-sm">{r.route}</p>
                    <p className="text-xs text-muted-foreground">{r.deliveries} deliveries • Avg {r.avgTime}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Progress value={r.onTime} className="h-2 w-20" />
                  <span className="text-sm font-medium text-foreground">{r.onTime}%</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  </IndustryLayout>
);

export default PharmaDistributionLogistics;
