import IndustryLayout from "@/components/industry/IndustryLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Thermometer, AlertTriangle, CheckCircle, Truck, Warehouse, Activity } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";

const tempReadings = [
  { time: "00:00", wh1: 4.2, wh2: 3.8, truck1: 5.1 },
  { time: "04:00", wh1: 4.1, wh2: 3.9, truck1: 5.8 },
  { time: "08:00", wh1: 4.3, wh2: 4.0, truck1: 6.2 },
  { time: "12:00", wh1: 4.5, wh2: 4.1, truck1: 7.1 },
  { time: "16:00", wh1: 4.4, wh2: 4.0, truck1: 6.8 },
  { time: "20:00", wh1: 4.2, wh2: 3.9, truck1: 5.5 },
  { time: "23:59", wh1: 4.1, wh2: 3.8, truck1: 5.2 },
];

const zones = [
  { name: "Lagos Cold Store A", temp: 4.2, status: "normal", humidity: 45, drugs: 142, capacity: 78 },
  { name: "Lagos Cold Store B", temp: 3.9, status: "normal", humidity: 42, drugs: 98, capacity: 65 },
  { name: "Abuja Cold Room", temp: 5.1, status: "warning", humidity: 51, drugs: 76, capacity: 82 },
  { name: "Truck LG-234-KJA", temp: 6.8, status: "alert", humidity: 55, drugs: 24, capacity: 60 },
  { name: "Kano Cold Chamber", temp: 4.0, status: "normal", humidity: 44, drugs: 58, capacity: 45 },
];

const excursionLog = [
  { zone: "Truck LG-234-KJA", peak: 8.2, duration: "42 min", drug: "Insulin Glargine", impact: "Under review", date: "2026-03-07" },
  { zone: "Abuja Cold Room", peak: 6.5, duration: "18 min", drug: "Vaccines (MMR)", impact: "No impact", date: "2026-03-06" },
];

const PharmaColdChain = () => (
  <IndustryLayout industryCode="pharma">
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-bold text-foreground">Cold Chain Logistics</h1>
        <p className="text-muted-foreground mt-1">Real-time temperature monitoring for pharmaceutical cold chain compliance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Active Zones", value: "12", icon: Warehouse, color: "text-primary" },
          { label: "In-Transit Units", value: "8", icon: Truck, color: "text-primary" },
          { label: "Temp Excursions (24h)", value: "2", icon: AlertTriangle, color: "text-amber-500" },
          { label: "Compliance Score", value: "97.3%", icon: CheckCircle, color: "text-emerald-500" },
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
        <CardHeader><CardTitle className="text-lg">Temperature Monitoring (Last 24h)</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={tempReadings}>
              <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis domain={[0, 10]} stroke="hsl(var(--muted-foreground))" fontSize={12} label={{ value: "°C", position: "insideLeft" }} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }} />
              <ReferenceLine y={8} stroke="hsl(0 84% 60%)" strokeDasharray="5 5" label="Max (8°C)" />
              <ReferenceLine y={2} stroke="hsl(220 70% 50%)" strokeDasharray="5 5" label="Min (2°C)" />
              <Line type="monotone" dataKey="wh1" stroke="hsl(var(--primary))" name="Cold Store A" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="wh2" stroke="hsl(142 76% 36%)" name="Cold Store B" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="truck1" stroke="hsl(25 95% 53%)" name="Truck LG-234" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-lg">Cold Storage Zones</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {zones.map((z) => (
              <div key={z.name} className={`p-4 rounded-xl border ${z.status === "alert" ? "border-destructive/50 bg-destructive/5" : z.status === "warning" ? "border-amber-500/50 bg-amber-500/5" : "border-border"}`}>
                <div className="flex items-center justify-between mb-3">
                  <p className="font-medium text-foreground text-sm">{z.name}</p>
                  <Badge variant={z.status === "normal" ? "default" : z.status === "warning" ? "secondary" : "destructive"} className="text-xs capitalize">{z.status}</Badge>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-1">
                    <Thermometer className="w-4 h-4 text-primary" />
                    <span className="text-foreground font-bold">{z.temp}°C</span>
                  </div>
                  <div className="text-muted-foreground">Humidity: {z.humidity}%</div>
                  <div className="text-muted-foreground">{z.drugs} SKUs stored</div>
                  <div className="text-muted-foreground">Capacity: {z.capacity}%</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-lg flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-amber-500" /> Temperature Excursion Log</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {excursionLog.map((e, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-lg border border-border">
                <div>
                  <p className="font-medium text-foreground">{e.zone}</p>
                  <p className="text-sm text-muted-foreground">Peak: {e.peak}°C for {e.duration} — {e.drug}</p>
                  <p className="text-xs text-muted-foreground">{e.date}</p>
                </div>
                <Badge variant={e.impact === "Under review" ? "secondary" : "default"} className="text-xs">{e.impact}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  </IndustryLayout>
);

export default PharmaColdChain;
