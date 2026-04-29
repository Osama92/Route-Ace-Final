import IndustryLayout from "@/components/industry/IndustryLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Truck, Route, MapPin, BarChart3 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const routes = [
  { name: "Warehouse → Lekki", distance: "35km", trips: 12, onTime: "92%", cost: "₦2.4M" },
  { name: "Warehouse → Abuja", distance: "820km", trips: 4, onTime: "78%", cost: "₦8.1M" },
  { name: "Warehouse → Ibadan", distance: "128km", trips: 8, onTime: "88%", cost: "₦3.6M" },
  { name: "Supplier → Warehouse", distance: "45km", trips: 18, onTime: "95%", cost: "₦1.8M" },
];

const weeklyVolume = [
  { day: "Mon", deliveries: 8 }, { day: "Tue", deliveries: 12 }, { day: "Wed", deliveries: 15 },
  { day: "Thu", deliveries: 10 }, { day: "Fri", deliveries: 14 }, { day: "Sat", deliveries: 6 },
];

const BuildingSupplyLogistics = () => (
  <IndustryLayout industryCode="building">
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
          <Truck className="w-7 h-7 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground">Supply Logistics</h1>
          <p className="text-muted-foreground">Track deliveries and optimize supply routes to construction sites</p>
        </div>
      </div>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Route className="w-5 h-5 text-amber-500" />Active Routes</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {routes.map((r) => (
              <div key={r.name} className="flex items-center justify-between p-4 rounded-xl border border-border bg-muted/20">
                <div><p className="font-medium text-foreground">{r.name}</p><p className="text-xs text-muted-foreground">{r.distance} • {r.trips} trips this month</p></div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground">On-time: {r.onTime}</span>
                  <span className="text-sm font-medium text-foreground">{r.cost}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><BarChart3 className="w-5 h-5 text-amber-500" />Weekly Delivery Volume</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={weeklyVolume}>
              <XAxis dataKey="day" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="deliveries" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  </IndustryLayout>
);

export default BuildingSupplyLogistics;
