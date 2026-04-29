import IndustryLayout from "@/components/industry/IndustryLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import {
  Users, TrendingUp, TrendingDown, Target, BarChart3, MapPin,
  Star, Award, Brain, Zap, Truck, Package,
} from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from "recharts";

const distributors = [
  { name: "PrimeBev Distributors", rank: 1, score: 96, revenue: "₦186M", growth: "+22%", retailers: 431, coverage: 94, sla: 98, brands: 48, territory: "VI / Ikoyi" },
  { name: "Peninsula Wines", rank: 2, score: 92, revenue: "₦94M", growth: "+18%", retailers: 124, coverage: 91, sla: 96, brands: 62, territory: "Ikoyi (Wine)" },
  { name: "Lagos Spirits Co.", rank: 3, score: 88, revenue: "₦142M", growth: "+12%", retailers: 396, coverage: 87, sla: 92, brands: 35, territory: "Lekki / Ajah" },
  { name: "NorthCity Beverages", rank: 4, score: 79, revenue: "₦98M", growth: "+8%", retailers: 312, coverage: 72, sla: 88, brands: 42, territory: "Ikeja / Ogba" },
  { name: "Mainland Drinks Ltd", rank: 5, score: 65, revenue: "₦62M", growth: "-3%", retailers: 557, coverage: 58, sla: 78, brands: 28, territory: "Surulere / Yaba" },
];

const radarData = [
  { metric: "Revenue", PrimeBev: 96, Lagos: 88, NorthCity: 72 },
  { metric: "Coverage", PrimeBev: 94, Lagos: 87, NorthCity: 72 },
  { metric: "SLA", PrimeBev: 98, Lagos: 92, NorthCity: 88 },
  { metric: "Brands", PrimeBev: 80, Lagos: 58, NorthCity: 70 },
  { metric: "Growth", PrimeBev: 92, Lagos: 78, NorthCity: 68 },
  { metric: "Retailer Sat.", PrimeBev: 95, Lagos: 84, NorthCity: 76 },
];

const performanceMetrics = distributors.map(d => ({
  name: d.name.split(" ")[0],
  score: d.score,
  coverage: d.coverage,
  sla: d.sla,
}));

const LiquorDistributorCompetition = () => {
  return (
    <IndustryLayout industryCode="liquor">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Distributor Competition Intelligence</h1>
          <p className="text-sm text-muted-foreground">Benchmark distributor performance across territory, sales, and compliance metrics</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Active Distributors", value: "128", icon: Users, color: "text-primary" },
            { label: "Avg Performance Score", value: "84", icon: Award, color: "text-emerald-500" },
            { label: "Top Growth Rate", value: "+22%", icon: TrendingUp, color: "text-blue-500" },
            { label: "Below Threshold", value: "8", icon: Target, color: "text-rose-500" },
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

        <Tabs defaultValue="rankings" className="space-y-4">
          <TabsList>
            <TabsTrigger value="rankings">Rankings</TabsTrigger>
            <TabsTrigger value="comparison">Comparison</TabsTrigger>
            <TabsTrigger value="benchmark">Benchmark Chart</TabsTrigger>
          </TabsList>

          <TabsContent value="rankings" className="space-y-3">
            {distributors.map((d, i) => (
              <motion.div key={d.name} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                <Card className="hover:border-primary/30 transition-all">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${d.rank <= 3 ? "bg-primary/10" : "bg-muted/50"}`}>
                          <span className={`text-lg font-bold ${d.rank <= 3 ? "text-primary" : "text-muted-foreground"}`}>#{d.rank}</span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-semibold">{d.name}</p>
                            {d.rank === 1 && <Badge className="bg-amber-500/15 text-amber-600">Top Performer</Badge>}
                          </div>
                          <p className="text-xs text-muted-foreground">{d.territory} · {d.brands} brands</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold">{d.revenue}</p>
                        <Badge className={d.growth.startsWith("+") ? "bg-emerald-500/15 text-emerald-600" : "bg-rose-500/15 text-rose-600"}>
                          {d.growth}
                        </Badge>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { label: "Score", value: `${d.score}/100` },
                        { label: "Retailers", value: String(d.retailers) },
                        { label: "Coverage", value: `${d.coverage}%` },
                        { label: "SLA Score", value: `${d.sla}%` },
                      ].map(m => (
                        <div key={m.label} className="text-center p-2 bg-muted/30 rounded-lg">
                          <p className="text-sm font-bold">{m.value}</p>
                          <p className="text-[10px] text-muted-foreground">{m.label}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </TabsContent>

          <TabsContent value="comparison">
            <Card>
              <CardHeader><CardTitle className="text-sm">Top 3 Distributor Comparison</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={280}>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="hsl(var(--border))" />
                    <PolarAngleAxis dataKey="metric" fontSize={10} stroke="hsl(var(--muted-foreground))" />
                    <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar dataKey="PrimeBev" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.15} strokeWidth={2} name="PrimeBev" />
                    <Radar dataKey="Lagos" stroke="hsl(142 76% 36%)" fill="hsl(142 76% 36%)" fillOpacity={0.1} strokeWidth={2} name="Lagos Spirits" />
                    <Radar dataKey="NorthCity" stroke="hsl(45 93% 47%)" fill="hsl(45 93% 47%)" fillOpacity={0.1} strokeWidth={2} name="NorthCity" />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="benchmark">
            <Card>
              <CardHeader><CardTitle className="text-sm">Performance Benchmark</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={performanceMetrics}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" fontSize={10} stroke="hsl(var(--muted-foreground))" />
                    <YAxis fontSize={10} stroke="hsl(var(--muted-foreground))" domain={[0, 100]} />
                    <Tooltip />
                    <Bar dataKey="score" fill="hsl(var(--primary))" name="Score" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="coverage" fill="hsl(142 76% 36%)" name="Coverage %" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="sla" fill="hsl(217 91% 60%)" name="SLA %" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4 flex items-start gap-3">
            <Brain className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <p className="font-semibold text-sm">Competition Intelligence</p>
              <p className="text-sm text-muted-foreground mt-1">
                Mainland Drinks Ltd shows declining performance (-3% growth, 58% coverage). 
                Consider reallocating premium brand allocations to higher-performing distributors. 
                PrimeBev maintains dominance with 98% SLA and +22% growth — ideal partner for 
                new product launches.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </IndustryLayout>
  );
};

export default LiquorDistributorCompetition;
