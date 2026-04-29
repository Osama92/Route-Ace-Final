import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import {
  Brain, TrendingUp, MapPin, AlertTriangle, Target, Zap, Globe, Store,
  Truck, Package, BarChart3, Users, ShieldCheck, Activity, ArrowUpRight,
  ArrowDownRight, Building2, Layers, Eye, Star, Clock,
} from "lucide-react";

/* ───── Demand Forecasts ───── */
const demandForecasts = [
  { product: "Cooking Oil (25L)", region: "Lagos Mainland", change: "+18%", period: "7 days", confidence: 94, volume: "42,000 units", icon: TrendingUp, trend: "up" },
  { product: "Malaria Drugs (ACT)", region: "Kano State", change: "+32%", period: "9 days", confidence: 91, volume: "28,500 units", icon: AlertTriangle, trend: "up" },
  { product: "Cement (50kg bags)", region: "Abuja FCT", change: "+40%", period: "30 days", confidence: 88, volume: "120,000 bags", icon: Package, trend: "up" },
  { product: "Baby Diapers", region: "Port Harcourt", change: "+15%", period: "14 days", confidence: 86, volume: "18,200 packs", icon: TrendingUp, trend: "up" },
  { product: "Beverages (PET)", region: "Ibadan", change: "+22%", period: "7 days", confidence: 92, volume: "65,000 crates", icon: Store, trend: "up" },
  { product: "Fertilizer (NPK)", region: "Kaduna", change: "-8%", period: "30 days", confidence: 79, volume: "35,000 bags", icon: ArrowDownRight, trend: "down" },
];

/* ───── Market Gaps ───── */
const marketGaps = [
  { region: "Enugu", category: "Baby Products", retailers: 1420, distributors: 2, gap: "Critical", opportunity: "₦890M", severity: 95 },
  { region: "Ibadan", category: "Beverages", retailers: 3200, distributors: 4, gap: "High", opportunity: "₦2.4B", severity: 82 },
  { region: "Kano", category: "Pharmaceuticals", retailers: 2800, distributors: 6, gap: "High", opportunity: "₦1.6B", severity: 78 },
  { region: "Abuja CBD", category: "Building Materials", retailers: 950, distributors: 3, gap: "Medium", opportunity: "₦3.6B", severity: 65 },
  { region: "Jos", category: "Agri-Inputs", retailers: 1800, distributors: 3, gap: "High", opportunity: "₦720M", severity: 75 },
  { region: "Warri", category: "FMCG General", retailers: 2100, distributors: 5, gap: "Medium", opportunity: "₦1.1B", severity: 60 },
];

/* ───── Distributor Scores ───── */
const distributorScores = [
  { name: "Dangote Distribution Ltd", region: "Lagos", reliability: 96, sellThrough: 89, coverage: 94, credit: 92, overall: 93, rank: 1 },
  { name: "Chisco Logistics", region: "Southeast", reliability: 91, sellThrough: 85, coverage: 88, credit: 90, overall: 88, rank: 2 },
  { name: "ABC Transport Distribution", region: "North Central", reliability: 88, sellThrough: 82, coverage: 85, credit: 87, overall: 85, rank: 3 },
  { name: "PZ Distribution Network", region: "Southwest", reliability: 85, sellThrough: 88, coverage: 82, credit: 83, overall: 84, rank: 4 },
  { name: "Oando Supply Chain", region: "South South", reliability: 82, sellThrough: 78, coverage: 80, credit: 86, overall: 81, rank: 5 },
];

/* ───── Territory Expansion ───── */
const expansionRecommendations = [
  { manufacturer: "Nigerian Breweries", action: "Add 3 distributors in Ibadan", impact: "+22% revenue", retailers: 1800, investmentRequired: "₦45M", roi: "340%", timeToROI: "4 months" },
  { manufacturer: "Nestlé Nigeria", action: "Enter Enugu baby product market", impact: "+18% market share", retailers: 1420, investmentRequired: "₦32M", roi: "280%", timeToROI: "6 months" },
  { manufacturer: "Dangote Cement", action: "Expand Abuja capacity 2x", impact: "+40% volume", retailers: 950, investmentRequired: "₦120M", roi: "520%", timeToROI: "3 months" },
  { manufacturer: "GSK Pharma", action: "Add cold-chain distributors in Kano", impact: "+32% coverage", retailers: 2800, investmentRequired: "₦68M", roi: "210%", timeToROI: "8 months" },
];

/* ───── Logistics Demand Forecast ───── */
const logisticsDemand = [
  { region: "Ibadan", tomorrow: 1200, nextWeek: 8400, change: "+28%", fleetCapacity: 850, gap: 350, status: "shortage" },
  { region: "Lagos Island", tomorrow: 3400, nextWeek: 22800, change: "+12%", fleetCapacity: 3200, gap: 200, status: "tight" },
  { region: "Kano Metro", tomorrow: 890, nextWeek: 6100, change: "+35%", fleetCapacity: 600, gap: 290, status: "shortage" },
  { region: "Abuja Central", tomorrow: 1600, nextWeek: 11200, change: "+18%", fleetCapacity: 1500, gap: 100, status: "adequate" },
  { region: "Port Harcourt", tomorrow: 750, nextWeek: 5200, change: "+8%", fleetCapacity: 700, gap: 50, status: "adequate" },
];

/* ───── Platform Intelligence KPIs ───── */
const intelligenceKPIs = [
  { label: "Data Signals Processed", value: "14.2M", delta: "+24%", description: "Daily supply chain signals analyzed" },
  { label: "Prediction Accuracy", value: "91.4%", delta: "+1.8%", description: "30-day demand forecast accuracy" },
  { label: "Market Gaps Detected", value: "847", delta: "+12%", description: "Active distribution gaps across Nigeria" },
  { label: "Revenue Unlocked", value: "₦18.6B", delta: "+32%", description: "Potential revenue from AI recommendations" },
];

const getSeverityColor = (severity: number) => {
  if (severity >= 80) return "text-destructive";
  if (severity >= 60) return "text-amber-500";
  return "text-emerald-500";
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case "shortage": return <Badge variant="destructive" className="text-[10px]">Fleet Shortage</Badge>;
    case "tight": return <Badge className="bg-amber-500/10 text-amber-500 text-[10px]">Tight Capacity</Badge>;
    default: return <Badge className="bg-emerald-500/10 text-emerald-500 text-[10px]">Adequate</Badge>;
  }
};

const anim = (i: number) => ({ initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 }, transition: { delay: i * 0.04 } });

const MarketIntelligenceEngine = () => (
  <DashboardLayout
    title="Market Intelligence Engine"
    subtitle="AI-powered demand prediction, market gap detection, and distribution intelligence across Africa"
  >
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {intelligenceKPIs.map((k) => (
          <Card key={k.label}>
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground mb-1">{k.label}</p>
              <div className="flex items-baseline gap-2">
                <p className="text-xl font-bold text-foreground">{k.value}</p>
                <span className="text-xs text-emerald-500 font-semibold">{k.delta}</span>
              </div>
              <p className="text-[10px] text-muted-foreground mt-1">{k.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="demand" className="space-y-4">
        <TabsList className="grid grid-cols-5 w-full max-w-3xl">
          <TabsTrigger value="demand" className="text-xs"><TrendingUp className="w-3 h-3 mr-1" />Demand</TabsTrigger>
          <TabsTrigger value="gaps" className="text-xs"><MapPin className="w-3 h-3 mr-1" />Market Gaps</TabsTrigger>
          <TabsTrigger value="distributors" className="text-xs"><Users className="w-3 h-3 mr-1" />Distributors</TabsTrigger>
          <TabsTrigger value="expansion" className="text-xs"><Target className="w-3 h-3 mr-1" />Expansion</TabsTrigger>
          <TabsTrigger value="logistics" className="text-xs"><Truck className="w-3 h-3 mr-1" />Logistics</TabsTrigger>
        </TabsList>

        {/* ── Demand Forecasting ── */}
        <TabsContent value="demand">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Brain className="w-4 h-4 text-primary" /> AI Demand Forecasting
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {demandForecasts.map((f, i) => (
                <motion.div key={i} {...anim(i)} className="p-4 rounded-xl bg-muted/30 border border-border/50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-semibold text-foreground">{f.product}</p>
                        <Badge variant="outline" className="text-[10px]">{f.region}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Expected volume: <span className="font-medium text-foreground">{f.volume}</span> within {f.period}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`text-lg font-bold ${f.trend === "up" ? "text-emerald-500" : "text-destructive"}`}>
                        {f.change}
                      </p>
                      <p className="text-[10px] text-muted-foreground">Confidence: {f.confidence}%</p>
                      <Progress value={f.confidence} className="h-1 mt-1 w-20" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Market Gap Detection ── */}
        <TabsContent value="gaps">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" /> Market Gap Detection
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {marketGaps.map((g, i) => (
                  <motion.div key={i} {...anim(i)} className="p-4 rounded-xl bg-muted/30 border border-border/50">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-sm font-semibold text-foreground">{g.region}</p>
                          <Badge className={`text-[10px] ${g.gap === "Critical" ? "bg-destructive/10 text-destructive" : g.gap === "High" ? "bg-amber-500/10 text-amber-500" : "bg-muted text-muted-foreground"}`}>
                            {g.gap}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          <span className="font-medium text-foreground">{g.retailers.toLocaleString()}</span> retailers, only <span className="font-medium text-destructive">{g.distributors}</span> distributors
                        </p>
                        <p className="text-xs text-muted-foreground">Category: {g.category}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-primary">{g.opportunity}</p>
                        <p className="text-[10px] text-muted-foreground">Market opportunity</p>
                        <div className="flex items-center gap-1 mt-1 justify-end">
                          <span className={`text-xs font-semibold ${getSeverityColor(g.severity)}`}>{g.severity}</span>
                          <span className="text-[10px] text-muted-foreground">severity</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Distributor Performance Scoring ── */}
        <TabsContent value="distributors">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Star className="w-4 h-4 text-primary" /> Distributor Performance Scoring
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {distributorScores.map((d, i) => (
                  <motion.div key={i} {...anim(i)} className="p-4 rounded-xl bg-muted/30 border border-border/50">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">
                            #{d.rank}
                          </span>
                          <p className="text-sm font-semibold text-foreground">{d.name}</p>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">{d.region}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-primary">{d.overall}</p>
                        <p className="text-[10px] text-muted-foreground">Overall Score</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-3">
                      {[
                        { label: "Reliability", val: d.reliability },
                        { label: "Sell-Through", val: d.sellThrough },
                        { label: "Coverage", val: d.coverage },
                        { label: "Credit", val: d.credit },
                      ].map((m) => (
                        <div key={m.label}>
                          <p className="text-[10px] text-muted-foreground mb-1">{m.label}</p>
                          <Progress value={m.val} className="h-1.5" />
                          <p className="text-xs font-medium text-foreground mt-0.5">{m.val}%</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Territory Expansion ── */}
        <TabsContent value="expansion">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Target className="w-4 h-4 text-primary" /> Territory Expansion Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {expansionRecommendations.map((e, i) => (
                  <motion.div key={i} {...anim(i)} className="p-5 rounded-xl bg-muted/30 border border-border/50">
                    <div className="flex items-center gap-2 mb-2">
                      <Building2 className="w-4 h-4 text-primary" />
                      <p className="text-sm font-semibold text-foreground">{e.manufacturer}</p>
                    </div>
                    <p className="text-xs text-muted-foreground mb-3">{e.action}</p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2 rounded-lg bg-background">
                        <p className="text-muted-foreground">Impact</p>
                        <p className="font-semibold text-emerald-500">{e.impact}</p>
                      </div>
                      <div className="p-2 rounded-lg bg-background">
                        <p className="text-muted-foreground">ROI</p>
                        <p className="font-semibold text-primary">{e.roi}</p>
                      </div>
                      <div className="p-2 rounded-lg bg-background">
                        <p className="text-muted-foreground">Investment</p>
                        <p className="font-semibold text-foreground">{e.investmentRequired}</p>
                      </div>
                      <div className="p-2 rounded-lg bg-background">
                        <p className="text-muted-foreground">Time to ROI</p>
                        <p className="font-semibold text-foreground">{e.timeToROI}</p>
                      </div>
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-2">
                      {e.retailers.toLocaleString()} untapped retailers in target area
                    </p>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Logistics Demand Forecasting ── */}
        <TabsContent value="logistics">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Truck className="w-4 h-4 text-primary" /> Logistics Demand Forecasting
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {logisticsDemand.map((l, i) => (
                  <motion.div key={i} {...anim(i)} className="p-4 rounded-xl bg-muted/30 border border-border/50">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-foreground">{l.region}</p>
                          {getStatusBadge(l.status)}
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Demand change: <span className="font-medium text-emerald-500">{l.change}</span>
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-foreground">{l.tomorrow.toLocaleString()}</p>
                        <p className="text-[10px] text-muted-foreground">orders tomorrow</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="p-2 rounded-lg bg-background text-center">
                        <p className="text-[10px] text-muted-foreground">Next Week</p>
                        <p className="text-sm font-semibold text-foreground">{l.nextWeek.toLocaleString()}</p>
                      </div>
                      <div className="p-2 rounded-lg bg-background text-center">
                        <p className="text-[10px] text-muted-foreground">Fleet Capacity</p>
                        <p className="text-sm font-semibold text-foreground">{l.fleetCapacity.toLocaleString()}</p>
                      </div>
                      <div className="p-2 rounded-lg bg-background text-center">
                        <p className="text-[10px] text-muted-foreground">Capacity Gap</p>
                        <p className={`text-sm font-semibold ${l.status === "shortage" ? "text-destructive" : l.status === "tight" ? "text-amber-500" : "text-emerald-500"}`}>
                          {l.gap > 0 ? `−${l.gap}` : "OK"}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  </DashboardLayout>
);

export default MarketIntelligenceEngine;
