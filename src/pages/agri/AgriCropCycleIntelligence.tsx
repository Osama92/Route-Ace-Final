import IndustryLayout from "@/components/industry/IndustryLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Sprout, Sun, CloudRain, Wheat, TrendingUp, Calendar, MapPin, BarChart3 } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const cropPhases = [
  { name: "Pre-Planting", status: "complete", progress: 100, duration: "Jan–Feb", color: "hsl(var(--primary))" },
  { name: "Planting Season", status: "active", progress: 65, duration: "Mar–Apr", color: "hsl(142 76% 36%)" },
  { name: "Growth & Monitoring", status: "upcoming", progress: 0, duration: "May–Jul", color: "hsl(45 93% 47%)" },
  { name: "Harvest Window", status: "upcoming", progress: 0, duration: "Aug–Oct", color: "hsl(25 95% 53%)" },
];

const inputDemand = [
  { month: "Jan", seeds: 1200, fertilizer: 800, pesticide: 300 },
  { month: "Feb", seeds: 2800, fertilizer: 1200, pesticide: 400 },
  { month: "Mar", seeds: 4500, fertilizer: 3200, pesticide: 1100 },
  { month: "Apr", seeds: 3800, fertilizer: 4800, pesticide: 2200 },
  { month: "May", seeds: 800, fertilizer: 5200, pesticide: 3100 },
  { month: "Jun", seeds: 200, fertilizer: 4100, pesticide: 3800 },
  { month: "Jul", seeds: 100, fertilizer: 2800, pesticide: 2500 },
];

const cropMix = [
  { name: "Maize", value: 35, color: "#f59e0b" },
  { name: "Rice", value: 25, color: "#10b981" },
  { name: "Cassava", value: 20, color: "#8b5cf6" },
  { name: "Sorghum", value: 12, color: "#ef4444" },
  { name: "Cowpea", value: 8, color: "#3b82f6" },
];

const AgriCropCycleIntelligence = () => (
  <IndustryLayout industryCode="agri">
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center">
          <Sprout className="w-7 h-7 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground">Crop Cycle Intelligence</h1>
          <p className="text-muted-foreground">Align input distribution to the agricultural cycle</p>
        </div>
      </div>

      {/* Crop Cycle Timeline */}
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Calendar className="w-5 h-5 text-emerald-500" />2026 Crop Cycle Phases</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-4">
            {cropPhases.map((phase) => (
              <div key={phase.name} className="flex items-center gap-4">
                <div className="w-36 text-sm font-medium text-foreground">{phase.name}</div>
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-xs text-muted-foreground">{phase.duration}</span>
                    <Badge variant={phase.status === "complete" ? "default" : phase.status === "active" ? "secondary" : "outline"} className="text-[10px]">
                      {phase.status}
                    </Badge>
                  </div>
                  <Progress value={phase.progress} className="h-2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Demand Curve */}
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><TrendingUp className="w-5 h-5 text-emerald-500" />Seasonal Input Demand</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={inputDemand}>
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Area type="monotone" dataKey="seeds" stackId="1" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.4} name="Seeds" />
                <Area type="monotone" dataKey="fertilizer" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.4} name="Fertilizer" />
                <Area type="monotone" dataKey="pesticide" stackId="1" stroke="#ef4444" fill="#ef4444" fillOpacity={0.4} name="Pesticide" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Crop Mix */}
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Wheat className="w-5 h-5 text-amber-500" />Regional Crop Mix</CardTitle></CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              <ResponsiveContainer width="50%" height={220}>
                <PieChart>
                  <Pie data={cropMix} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value">
                    {cropMix.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2">
                {cropMix.map((c) => (
                  <div key={c.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: c.color }} />
                    <span className="text-sm text-foreground">{c.name}</span>
                    <span className="text-xs text-muted-foreground ml-auto">{c.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Active Farm Zones", value: "342", icon: MapPin, color: "text-emerald-500" },
          { label: "Planting Progress", value: "65%", icon: Sprout, color: "text-green-500" },
          { label: "Weather Risk Zones", value: "12", icon: CloudRain, color: "text-blue-500" },
          { label: "Yield Forecast", value: "4.2t/ha", icon: BarChart3, color: "text-amber-500" },
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
    </div>
  </IndustryLayout>
);

export default AgriCropCycleIntelligence;
