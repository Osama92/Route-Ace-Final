import { useState } from "react";
import IndustryLayout from "@/components/industry/IndustryLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import {
  Users, MapPin, AlertTriangle, Target, TrendingUp, Truck, Globe,
  ShieldCheck, Zap, Eye, Brain, BarChart3, ArrowRight,
} from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from "recharts";

const distributors = [
  { name: "PrimeBev Distributors", territory: "Victoria Island / Ikoyi", retailers: 431, coverage: 94, brands: 48, revenue: "₦186M", score: 96, overlap: false },
  { name: "Lagos Spirits Co.", territory: "Lekki / Ajah", retailers: 396, coverage: 87, brands: 35, revenue: "₦142M", score: 88, overlap: true },
  { name: "NorthCity Beverages", territory: "Ikeja / Ogba", retailers: 312, coverage: 72, brands: 42, revenue: "₦98M", score: 79, overlap: true },
  { name: "Mainland Drinks Ltd", territory: "Surulere / Yaba", retailers: 557, coverage: 58, brands: 28, revenue: "₦62M", score: 65, overlap: false },
  { name: "Peninsula Wines", territory: "Ikoyi / VI (Wine)", retailers: 124, coverage: 91, brands: 62, revenue: "₦94M", score: 92, overlap: true },
];

const serviceGaps = [
  { zone: "Ajah East", unservedOutlets: 148, potentialRevenue: "₦28M", nearestDist: "Lagos Spirits Co.", distance: "14km", priority: "High" },
  { zone: "Festac Town", unservedOutlets: 92, potentialRevenue: "₦18M", nearestDist: "Mainland Drinks", distance: "8km", priority: "High" },
  { zone: "Gbagada", unservedOutlets: 67, potentialRevenue: "₦12M", nearestDist: "NorthCity Beverages", distance: "6km", priority: "Medium" },
  { zone: "Magodo", unservedOutlets: 54, potentialRevenue: "₦9M", nearestDist: "NorthCity Beverages", distance: "11km", priority: "Medium" },
  { zone: "Maryland", unservedOutlets: 38, potentialRevenue: "₦7M", nearestDist: "NorthCity Beverages", distance: "4km", priority: "Low" },
];

const overlapConflicts = [
  { zone: "Lekki Phase 1", distributors: ["Lagos Spirits Co.", "Peninsula Wines"], category: "Premium Wine", impact: "Price undercutting reported", severity: "High" },
  { zone: "Ikeja GRA", distributors: ["NorthCity Beverages", "Lagos Spirits Co."], category: "Spirits", impact: "Duplicate servicing, retailer confusion", severity: "Medium" },
  { zone: "Ikoyi", distributors: ["PrimeBev Distributors", "Peninsula Wines"], category: "Champagne", impact: "Healthy competition, no action needed", severity: "Low" },
];

const coverageChart = distributors.map(d => ({ name: d.name.split(" ")[0], coverage: d.coverage, retailers: d.retailers }));

const LiquorDistributorCoverage = () => {
  return (
    <IndustryLayout industryCode="liquor">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Distributor Coverage Intelligence</h1>
          <p className="text-sm text-muted-foreground">Territory mapping, gap analysis, and overlap detection</p>
        </div>

        {/* Summary KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Active Distributors", value: "128", icon: Users, color: "text-primary" },
            { label: "Avg Coverage", value: "76%", icon: Target, color: "text-emerald-500" },
            { label: "Service Gaps", value: "399", icon: AlertTriangle, color: "text-amber-500" },
            { label: "Overlap Conflicts", value: "12", icon: ShieldCheck, color: "text-rose-500" },
          ].map(k => (
            <Card key={k.label}>
              <CardContent className="p-3 text-center">
                <k.icon className={`w-5 h-5 mx-auto mb-1 ${k.color}`} />
                <p className="text-xl font-bold">{k.value}</p>
                <p className="text-[10px] text-muted-foreground">{k.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="distributors" className="space-y-4">
          <TabsList>
            <TabsTrigger value="distributors">Distributor Performance</TabsTrigger>
            <TabsTrigger value="gaps">Service Gaps</TabsTrigger>
            <TabsTrigger value="overlaps">Overlap Conflicts</TabsTrigger>
          </TabsList>

          {/* Distributors */}
          <TabsContent value="distributors" className="space-y-3">
            <Card>
              <CardHeader><CardTitle className="text-sm">Coverage by Distributor (%)</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={coverageChart} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis type="number" domain={[0, 100]} fontSize={10} stroke="hsl(var(--muted-foreground))" />
                    <YAxis type="category" dataKey="name" fontSize={10} stroke="hsl(var(--muted-foreground))" width={100} />
                    <Tooltip />
                    <Bar dataKey="coverage" radius={[0, 4, 4, 0]}>
                      {coverageChart.map((entry, i) => (
                        <Cell key={i} fill={entry.coverage >= 85 ? "hsl(142 76% 36%)" : entry.coverage >= 65 ? "hsl(45 93% 47%)" : "hsl(0 84% 60%)"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {distributors.map((d, i) => (
              <motion.div key={d.name} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                <Card className="hover:border-primary/30 transition-all">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{d.name}</h3>
                          <Badge variant="outline">{d.score} pts</Badge>
                          {d.overlap && <Badge className="bg-amber-500/15 text-amber-600">Overlap</Badge>}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{d.territory} · {d.brands} brands</p>
                      </div>
                      <span className="font-bold text-lg">{d.revenue}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="text-center p-2 bg-muted/30 rounded-lg">
                        <p className="text-sm font-bold">{d.retailers}</p>
                        <p className="text-[10px] text-muted-foreground">Retailers</p>
                      </div>
                      <div className="text-center p-2 bg-muted/30 rounded-lg">
                        <p className="text-sm font-bold">{d.coverage}%</p>
                        <p className="text-[10px] text-muted-foreground">Coverage</p>
                      </div>
                      <div className="text-center p-2 bg-muted/30 rounded-lg">
                        <Progress value={d.coverage} className="h-2 mt-1" />
                        <p className="text-[10px] text-muted-foreground mt-1">Health</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </TabsContent>

          {/* Service Gaps */}
          <TabsContent value="gaps" className="space-y-3">
            {serviceGaps.map((g, i) => (
              <motion.div key={g.zone} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                <Card className="hover:border-primary/30 transition-all">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className={`w-4 h-4 ${g.priority === "High" ? "text-rose-500" : g.priority === "Medium" ? "text-amber-500" : "text-blue-500"}`} />
                        <div>
                          <h3 className="font-semibold text-sm">{g.zone}</h3>
                          <p className="text-xs text-muted-foreground">Nearest: {g.nearestDist} ({g.distance})</p>
                        </div>
                      </div>
                      <Badge className={g.priority === "High" ? "bg-rose-500/15 text-rose-600" : g.priority === "Medium" ? "bg-amber-500/15 text-amber-600" : "bg-blue-500/15 text-blue-600"}>
                        {g.priority}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div><span className="text-muted-foreground">Unserved Outlets:</span> <span className="font-bold">{g.unservedOutlets}</span></div>
                      <div><span className="text-muted-foreground">Potential Revenue:</span> <span className="font-bold text-emerald-600">{g.potentialRevenue}/mo</span></div>
                    </div>
                    <Button size="sm" className="mt-3"><Zap className="w-3 h-3 mr-1" /> Assign Distributor</Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </TabsContent>

          {/* Overlaps */}
          <TabsContent value="overlaps" className="space-y-3">
            {overlapConflicts.map((o, i) => (
              <motion.div key={o.zone} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                <Card className={`border-l-4 ${o.severity === "High" ? "border-l-rose-500" : o.severity === "Medium" ? "border-l-amber-500" : "border-l-emerald-500"}`}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-sm">{o.zone} — {o.category}</h3>
                      <Badge variant="outline">{o.severity}</Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm mb-2">
                      <span className="font-medium">{o.distributors[0]}</span>
                      <ArrowRight className="w-3 h-3 text-muted-foreground" />
                      <span className="font-medium">{o.distributors[1]}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{o.impact}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </TabsContent>
        </Tabs>

        {/* AI Insight */}
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4 flex items-start gap-3">
            <Brain className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <p className="font-semibold text-sm">Coverage Intelligence</p>
              <p className="text-sm text-muted-foreground mt-1">
                Mainland Drinks Ltd operates at only 58% coverage in Surulere/Yaba — 
                the fastest-growing beer market (+28% QoQ). Recommend either expanding their fleet 
                by 3 vehicles or onboarding a secondary distributor for the Yaba corridor. 
                Estimated missed revenue: ₦24M/month.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </IndustryLayout>
  );
};

export default LiquorDistributorCoverage;
