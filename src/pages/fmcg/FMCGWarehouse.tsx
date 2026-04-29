import FMCGLayout from "@/components/fmcg/FMCGLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Warehouse, Package, Truck, AlertTriangle } from "lucide-react";

const warehouses = [
  { name: "Lagos Hub", location: "Apapa, Lagos", capacity: 85, picklist: 42, dispatching: 12, alerts: 2 },
  { name: "Abuja DC", location: "Kubwa, Abuja", capacity: 62, picklist: 18, dispatching: 5, alerts: 0 },
  { name: "Kano Regional", location: "Bompai, Kano", capacity: 74, picklist: 24, dispatching: 8, alerts: 1 },
  { name: "PH Depot", location: "Trans Amadi, PH", capacity: 91, picklist: 31, dispatching: 10, alerts: 3 },
];

const picklist = [
  { order: "ORD-8821", outlet: "ShopRite Ikeja", items: 24, priority: "urgent", status: "picking" },
  { order: "ORD-8820", outlet: "Game VI", items: 18, priority: "normal", status: "queued" },
  { order: "ORD-8819", outlet: "Spar Lekki", items: 32, priority: "urgent", status: "picked" },
  { order: "ORD-8818", outlet: "Market Square", items: 12, priority: "normal", status: "queued" },
  { order: "ORD-8817", outlet: "Justrite Oshodi", items: 28, priority: "normal", status: "picking" },
];

const FMCGWarehouse = () => (
  <FMCGLayout title="Warehouse Operations" subtitle="Real-time pick, pack & dispatch management">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      {warehouses.map((w) => (
        <Card key={w.name}>
          <CardContent className="pt-6 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Warehouse className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-semibold text-sm">{w.name}</p>
                  <p className="text-xs text-muted-foreground">{w.location}</p>
                </div>
              </div>
              {w.alerts > 0 && <Badge variant="destructive">{w.alerts} alerts</Badge>}
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Capacity</span>
                <span className="font-medium">{w.capacity}%</span>
              </div>
              <Progress value={w.capacity} className="h-1.5" />
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-1"><Package className="w-3 h-3" /><span>Picklist: {w.picklist}</span></div>
              <div className="flex items-center gap-1"><Truck className="w-3 h-3" /><span>Dispatching: {w.dispatching}</span></div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>

    <Card>
      <CardHeader><CardTitle>Active Picklist Queue</CardTitle></CardHeader>
      <CardContent>
        <div className="space-y-3">
          {picklist.map((p) => (
            <div key={p.order} className="flex items-center gap-4 py-3 border-b last:border-0">
              <span className="font-mono text-sm w-24">{p.order}</span>
              <span className="flex-1 font-medium">{p.outlet}</span>
              <span className="text-sm w-20">{p.items} items</span>
              <Badge variant={p.priority === "urgent" ? "destructive" : "secondary"}>{p.priority}</Badge>
              <Badge variant={p.status === "picked" ? "default" : p.status === "picking" ? "secondary" : "outline"}>{p.status}</Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  </FMCGLayout>
);

export default FMCGWarehouse;
