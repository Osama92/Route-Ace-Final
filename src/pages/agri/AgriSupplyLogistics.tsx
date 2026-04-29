import IndustryLayout from "@/components/industry/IndustryLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Truck, Route, MapPin, Package, Clock, TrendingUp, Users, Shield } from "lucide-react";

const routes = [
  { route: "Kaduna → Zaria → Funtua", status: "in_transit", driver: "Musa Danladi", load: "Fertilizer (12t)", eta: "4h 20m", progress: 65 },
  { route: "Kano → Dutse → Hadejia", status: "loading", driver: "Ibrahim Yusuf", load: "Seeds (8t)", eta: "—", progress: 10 },
  { route: "Benue → Otukpo → Idah", status: "delivered", driver: "Emmanuel Obi", load: "Pesticide (5t)", eta: "Completed", progress: 100 },
  { route: "Oyo → Ogbomoso → Ilorin", status: "in_transit", driver: "Funke Balogun", load: "Mixed inputs (10t)", eta: "2h 45m", progress: 78 },
];

const AgriSupplyLogistics = () => (
  <IndustryLayout industryCode="agri">
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center">
          <Truck className="w-7 h-7 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground">Agricultural Supply Logistics</h1>
          <p className="text-muted-foreground">Rural delivery routes, fleet tracking, and last-mile distribution</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Active Shipments", value: "34", icon: Truck, color: "text-teal-500" },
          { label: "On-Time Delivery", value: "91%", icon: Clock, color: "text-emerald-500" },
          { label: "Fleet Utilization", value: "78%", icon: Route, color: "text-blue-500" },
          { label: "Rural Coverage", value: "284 zones", icon: MapPin, color: "text-amber-500" },
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

      <Card>
        <CardHeader><CardTitle>Live Delivery Routes</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Route</TableHead>
                <TableHead>Driver</TableHead>
                <TableHead>Load</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {routes.map((r) => (
                <TableRow key={r.route}>
                  <TableCell className="font-medium text-xs">{r.route}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{r.driver}</TableCell>
                  <TableCell className="text-xs">{r.load}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={r.progress} className="h-1.5 w-20" />
                      <span className="text-xs text-muted-foreground">{r.eta}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={r.status === "delivered" ? "default" : r.status === "in_transit" ? "secondary" : "outline"}
                      className="text-[10px]"
                    >
                      {r.status.replace("_", " ")}
                    </Badge>
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

export default AgriSupplyLogistics;
