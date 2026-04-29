import IndustryLayout from "@/components/industry/IndustryLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Building2, HardHat, Calendar, TrendingUp, MapPin, BarChart3, Package, Clock } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const projects = [
  { name: "Lekki Tower Phase III", stage: "Superstructure", progress: 62, materials: 847, deliveries: 34, status: "on_track", value: "₦2.4B" },
  { name: "Abuja Metro Mall", stage: "Foundation", progress: 28, materials: 312, deliveries: 18, status: "delayed", value: "₦890M" },
  { name: "Ibadan Housing Estate", stage: "Finishing", progress: 85, materials: 1240, deliveries: 67, status: "on_track", value: "₦1.7B" },
  { name: "PH Industrial Park", stage: "Planning", progress: 8, materials: 45, deliveries: 3, status: "at_risk", value: "₦3.1B" },
];

const stageData = [
  { stage: "Planning", cement: 200, steel: 50, tiles: 0, paint: 0 },
  { stage: "Foundation", cement: 4500, steel: 3200, tiles: 0, paint: 0 },
  { stage: "Structure", cement: 3800, steel: 5100, tiles: 0, paint: 0 },
  { stage: "MEP", cement: 800, steel: 400, tiles: 1200, paint: 200 },
  { stage: "Finishing", cement: 400, steel: 100, tiles: 3800, paint: 2800 },
];

const kpis = [
  { label: "Active Projects", value: "24", change: "+3", icon: Building2 },
  { label: "Supply Fulfillment", value: "91.2%", change: "+2.8%", icon: Package },
  { label: "Delivery Accuracy", value: "87.5%", change: "+1.3%", icon: TrendingUp },
  { label: "Contractor Retention", value: "94%", change: "+4%", icon: HardHat },
];

const BuildingProjectTracker = () => (
  <IndustryLayout industryCode="building">
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
          <Building2 className="w-7 h-7 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground">Project Supply Tracker</h1>
          <p className="text-muted-foreground">Monitor construction projects and material supply chains</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {kpis.map((k) => (
          <Card key={k.label}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <k.icon className="w-5 h-5 text-amber-500" />
                <Badge variant="secondary" className="text-emerald-600 bg-emerald-50">{k.change}</Badge>
              </div>
              <p className="text-2xl font-bold text-foreground">{k.value}</p>
              <p className="text-xs text-muted-foreground">{k.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Calendar className="w-5 h-5 text-amber-500" />Active Projects Pipeline</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-4">
            {projects.map((p) => (
              <div key={p.name} className="p-4 rounded-xl border border-border bg-muted/20">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-semibold text-foreground">{p.name}</p>
                    <p className="text-xs text-muted-foreground">Stage: {p.stage} • Value: {p.value}</p>
                  </div>
                  <Badge variant={p.status === "on_track" ? "default" : p.status === "delayed" ? "destructive" : "secondary"}>
                    {p.status.replace("_", " ")}
                  </Badge>
                </div>
                <Progress value={p.progress} className="h-2 mb-2" />
                <div className="flex gap-4 text-xs text-muted-foreground">
                  <span>{p.progress}% complete</span>
                  <span>{p.materials} materials ordered</span>
                  <span>{p.deliveries} deliveries</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><BarChart3 className="w-5 h-5 text-amber-500" />Material Demand by Construction Stage</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stageData}>
              <XAxis dataKey="stage" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="cement" fill="hsl(var(--primary))" name="Cement (tons)" />
              <Bar dataKey="steel" fill="#ef4444" name="Steel (tons)" />
              <Bar dataKey="tiles" fill="#8b5cf6" name="Tiles (sqm)" />
              <Bar dataKey="paint" fill="#f59e0b" name="Paint (ltrs)" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  </IndustryLayout>
);

export default BuildingProjectTracker;
