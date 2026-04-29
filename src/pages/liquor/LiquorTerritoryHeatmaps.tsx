import { useState } from "react";
import IndustryLayout from "@/components/industry/IndustryLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import {
  Map, TrendingUp, TrendingDown, Flame, Target, Wine, Beer, Martini,
  Brain, Filter, Zap, BarChart3,
} from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

const categoryFilter = ["All Categories", "Spirits", "Wine", "Beer", "Champagne", "RTD"];

const heatmapDistricts = [
  { name: "Victoria Island", intensity: 95, volume: "₦248M", growth: "+22%", topCategory: "Premium Spirits", topBrand: "Hennessy", outlets: 342, trend: "up" },
  { name: "Ikoyi", intensity: 88, volume: "₦186M", growth: "+15%", topCategory: "Champagne", topBrand: "Moët", outlets: 89, trend: "up" },
  { name: "Lekki Phase 1", intensity: 82, volume: "₦164M", growth: "+18%", topCategory: "Wine", topBrand: "Jacob's Creek", outlets: 218, trend: "up" },
  { name: "Ikeja GRA", intensity: 71, volume: "₦98M", growth: "+8%", topCategory: "Beer", topBrand: "Heineken", outlets: 156, trend: "stable" },
  { name: "Yaba", intensity: 58, volume: "₦62M", growth: "+28%", topCategory: "Beer & RTD", topBrand: "Smirnoff Ice", outlets: 312, trend: "up" },
  { name: "Surulere", intensity: 42, volume: "₦38M", growth: "-3%", topCategory: "Value Spirits", topBrand: "Chelsea Gin", outlets: 245, trend: "down" },
  { name: "Ajah", intensity: 35, volume: "₦24M", growth: "+42%", topCategory: "Beer", topBrand: "Star Lager", outlets: 178, trend: "up" },
  { name: "Festac", intensity: 28, volume: "₦18M", growth: "+6%", topCategory: "Stout", topBrand: "Guinness FES", outlets: 134, trend: "stable" },
];

const demandByCategory = [
  { category: "Premium Spirits", demand: 34 },
  { category: "Champagne", demand: 18 },
  { category: "Wine", demand: 22 },
  { category: "Beer", demand: 28 },
  { category: "RTD / Ciders", demand: 14 },
  { category: "Value Spirits", demand: 8 },
];

const emergingSignals = [
  { signal: "Tequila demand surging +67% in cocktail bars, Victoria Island", confidence: 94, category: "Spirits" },
  { signal: "Craft beer gaining traction in Lekki restaurants (+45% QoQ)", confidence: 87, category: "Beer" },
  { signal: "Rosé wine showing seasonal spike in Ikoyi fine dining", confidence: 82, category: "Wine" },
  { signal: "Non-alcoholic spirits emerging in premium on-premise accounts", confidence: 76, category: "NA Spirits" },
  { signal: "Aperol Spritz trend driving aperitif category growth +38%", confidence: 89, category: "Spirits" },
];

const LiquorTerritoryHeatmaps = () => {
  const [category, setCategory] = useState("All Categories");

  return (
    <IndustryLayout industryCode="liquor">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Territory Demand Heatmaps</h1>
            <p className="text-sm text-muted-foreground">AI-powered demand intensity mapping by district and category</p>
          </div>
          <div className="flex items-center gap-2">
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                {categoryFilter.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Visual Heatmap */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2"><Map className="w-4 h-4" /> Demand Intensity Map — Lagos</CardTitle>
              <div className="flex items-center gap-2 text-xs">
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-rose-600" /> Hot</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-amber-500" /> Warm</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-blue-400" /> Cool</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-2 min-h-[300px]">
              {heatmapDistricts.map(d => {
                const hue = d.intensity > 80 ? "bg-rose-500" : d.intensity > 60 ? "bg-amber-500" : d.intensity > 40 ? "bg-blue-400" : "bg-blue-200";
                const opacity = Math.max(0.3, d.intensity / 100);
                return (
                  <motion.div
                    key={d.name}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: heatmapDistricts.indexOf(d) * 0.05 }}
                    className={`${hue} rounded-xl p-3 flex flex-col justify-between text-white cursor-pointer hover:scale-[1.02] transition-transform`}
                    style={{ opacity }}
                  >
                    <div>
                      <p className="font-bold text-sm">{d.name}</p>
                      <p className="text-[10px] opacity-80">{d.outlets} outlets</p>
                    </div>
                    <div className="mt-2">
                      <p className="text-lg font-bold">{d.volume}</p>
                      <div className="flex items-center gap-1 text-xs">
                        {d.trend === "up" ? <TrendingUp className="w-3 h-3" /> : d.trend === "down" ? <TrendingDown className="w-3 h-3" /> : null}
                        <span>{d.growth}</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Demand by Category */}
          <Card>
            <CardHeader><CardTitle className="text-sm">Demand Distribution by Category (%)</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={demandByCategory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="category" fontSize={9} stroke="hsl(var(--muted-foreground))" angle={-15} textAnchor="end" height={50} />
                  <YAxis fontSize={10} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip />
                  <Bar dataKey="demand" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Emerging Demand Signals */}
          <Card>
            <CardHeader><CardTitle className="text-sm flex items-center gap-2"><Flame className="w-4 h-4 text-amber-500" /> Emerging Demand Signals</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {emergingSignals.map((s, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }} className="flex items-start gap-2 p-2 bg-muted/30 rounded-lg">
                  <Zap className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-xs">{s.signal}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-[10px]">{s.category}</Badge>
                      <span className="text-[10px] text-muted-foreground">{s.confidence}% confidence</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* District Detail */}
        <div className="space-y-2">
          <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">District Breakdown</h3>
          {heatmapDistricts.map((d, i) => (
            <motion.div key={d.name} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
              <Card className="hover:border-primary/30 transition-all">
                <CardContent className="p-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <span className="font-bold text-sm text-primary">{d.intensity}</span>
                    </div>
                    <div>
                      <p className="font-medium text-sm">{d.name}</p>
                      <p className="text-xs text-muted-foreground">{d.topCategory} · {d.topBrand}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-bold text-sm">{d.volume}</p>
                      <p className="text-[10px] text-muted-foreground">{d.outlets} outlets</p>
                    </div>
                    <Badge className={d.growth.startsWith("+") ? "bg-emerald-500/15 text-emerald-600" : "bg-rose-500/15 text-rose-600"}>
                      {d.growth}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </IndustryLayout>
  );
};

export default LiquorTerritoryHeatmaps;
