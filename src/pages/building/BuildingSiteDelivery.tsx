import IndustryLayout from "@/components/industry/IndustryLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Truck, MapPin, Clock, CheckCircle, AlertTriangle } from "lucide-react";

const deliveries = [
  { id: "DEL-001", project: "Lekki Tower III", material: "Cement 42.5R", qty: "500 bags", truck: "TRK-045", eta: "10:30 AM", status: "in_transit" },
  { id: "DEL-002", project: "Abuja Metro Mall", material: "Steel Rebar 16mm", qty: "20 tons", truck: "TRK-012", eta: "2:15 PM", status: "loading" },
  { id: "DEL-003", project: "Ibadan Housing", material: "Ceramic Tiles", qty: "2000 sqm", truck: "TRK-078", eta: "Delivered", status: "delivered" },
  { id: "DEL-004", project: "PH Industrial", material: "PVC Pipes", qty: "200 lengths", truck: "TRK-034", eta: "4:00 PM", status: "scheduled" },
  { id: "DEL-005", project: "Lekki Tower III", material: "Paint (Emulsion)", qty: "500 ltrs", truck: "TRK-056", eta: "Delayed", status: "delayed" },
];

const BuildingSiteDelivery = () => (
  <IndustryLayout industryCode="building">
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
          <Truck className="w-7 h-7 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground">Site Delivery Scheduling</h1>
          <p className="text-muted-foreground">Track and schedule material deliveries to construction sites</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-foreground">18</p><p className="text-xs text-muted-foreground">Today's Deliveries</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-emerald-500">12</p><p className="text-xs text-muted-foreground">Completed</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-amber-500">4</p><p className="text-xs text-muted-foreground">In Transit</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-red-500">2</p><p className="text-xs text-muted-foreground">Delayed</p></CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><MapPin className="w-5 h-5 text-amber-500" />Delivery Schedule</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {deliveries.map((d) => (
              <div key={d.id} className="flex items-center justify-between p-4 rounded-xl border border-border bg-muted/20">
                <div className="flex items-center gap-4">
                  {d.status === "delivered" ? <CheckCircle className="w-5 h-5 text-emerald-500" /> :
                   d.status === "delayed" ? <AlertTriangle className="w-5 h-5 text-red-500" /> :
                   <Truck className="w-5 h-5 text-amber-500" />}
                  <div>
                    <p className="font-medium text-foreground">{d.material}</p>
                    <p className="text-xs text-muted-foreground">{d.project} • {d.qty} • {d.truck}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3" />{d.eta}</span>
                  <Badge variant={d.status === "delivered" ? "default" : d.status === "delayed" ? "destructive" : "secondary"}>
                    {d.status.replace("_", " ")}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  </IndustryLayout>
);

export default BuildingSiteDelivery;
