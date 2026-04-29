import IndustryLayout from "@/components/industry/IndustryLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Truck, Route, BarChart3 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const routes = [
  { name: "Lagos Island Circuit", stops: 32, deliveries: 28, onTime: "92%", revenue: "₦18.4M" },
  { name: "Abuja Distribution", stops: 24, deliveries: 20, onTime: "88%", revenue: "₦14.2M" },
  { name: "Ibadan/Oyo Belt", stops: 18, deliveries: 16, onTime: "91%", revenue: "₦8.6M" },
  { name: "PH/Warri Route", stops: 14, deliveries: 12, onTime: "85%", revenue: "₦6.4M" },
];

const weeklyData = [
  { day: "Mon", deliveries: 45 }, { day: "Tue", deliveries: 52 }, { day: "Wed", deliveries: 68 },
  { day: "Thu", deliveries: 48 }, { day: "Fri", deliveries: 58 }, { day: "Sat", deliveries: 32 },
];

const ConsumerLogistics = () => (
  <IndustryLayout industryCode="consumer">
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center">
          <Truck className="w-7 h-7 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground">Route Optimization & Logistics</h1>
          <p className="text-muted-foreground">Optimize delivery routes and track distribution performance</p>
        </div>
      </div>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Route className="w-5 h-5 text-teal-500" />Active Routes</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {routes.map((r) => (
              <div key={r.name} className="flex items-center justify-between p-4 rounded-xl border border-border bg-muted/20">
                <div><p className="font-medium text-foreground">{r.name}</p><p className="text-xs text-muted-foreground">{r.stops} stops • {r.deliveries} deliveries</p></div>
                <div className="flex items-center gap-4"><span className="text-sm text-muted-foreground">On-time: {r.onTime}</span><span className="text-sm font-medium text-foreground">{r.revenue}</span></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><BarChart3 className="w-5 h-5 text-teal-500" />Weekly Delivery Volume</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={weeklyData}>
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

export default ConsumerLogistics;
