import IndustryLayout from "@/components/industry/IndustryLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import {
  Globe, Target, MapPin, DollarSign, Brain, TrendingUp,
  AlertTriangle, CheckCircle2, Wine, Truck, ShieldCheck,
  Award, ArrowRight, Zap, Users, BarChart3,
} from "lucide-react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  PieChart, Pie, Cell,
} from "recharts";

const expansionSummary = [
  { label: "Total Opportunity", value: "₦1.4B/yr", icon: DollarSign, color: "text-emerald-500" },
  { label: "Target Cities", value: "14", icon: MapPin, color: "text-primary" },
  { label: "SKUs to Launch", value: "68", icon: Wine, color: "text-amber-500" },
  { label: "Expansion Score", value: "84", icon: Brain, color: "text-purple-500" },
];

const demandHeatmap = [
  { city: "Lagos", demand: 96, retailers: 2840, potential: "₦284M" },
  { city: "Abuja", demand: 88, retailers: 1240, potential: "₦186M" },
  { city: "Port Harcourt", demand: 82, retailers: 860, potential: "₦124M" },
  { city: "Ibadan", demand: 72, retailers: 620, potential: "₦86M" },
  { city: "Benin City", demand: 78, retailers: 480, potential: "₦72M" },
  { city: "Enugu", demand: 74, retailers: 420, potential: "₦64M" },
  { city: "Calabar", demand: 68, retailers: 280, potential: "₦42M" },
  { city: "Uyo", demand: 66, retailers: 240, potential: "₦38M" },
  { city: "Onitsha", demand: 76, retailers: 580, potential: "₦88M" },
  { city: "Abeokuta", demand: 62, retailers: 320, potential: "₦44M" },
  { city: "Kaduna", demand: 38, retailers: 120, potential: "₦18M" },
  { city: "Kano", demand: 12, retailers: 42, potential: "₦6M" },
];

const topAlerts = [
  { type: "demand", message: "High demand for craft beer detected in Abuja — 12 bars requesting supply", city: "Abuja", priority: "high" },
  { type: "stockout", message: "Premium tequila demand emerging in Port Harcourt nightlife venues", city: "Port Harcourt", priority: "high" },
  { type: "coverage", message: "Low distributor coverage detected in Benin City — 78% unserved outlets", city: "Benin City", priority: "medium" },
  { type: "regulatory", message: "Kaduna southern LGA alcohol permits expiring — renewal required by Q2", city: "Kaduna", priority: "medium" },
  { type: "opportunity", message: "Calabar carnival season approaching — 3x historical demand spike expected", city: "Calabar", priority: "high" },
];

const pieData = [
  { name: "Lagos", value: 34 },
  { name: "Abuja", value: 22 },
  { name: "Port Harcourt", value: 16 },
  { name: "South-South", value: 12 },
  { name: "South-East", value: 10 },
  { name: "North", value: 6 },
];

const COLORS = [
  "hsl(var(--primary))", "hsl(142 76% 36%)", "hsl(217 91% 60%)",
  "hsl(45 93% 47%)", "hsl(280 68% 60%)", "hsl(350 80% 55%)",
];

const strategicRecs = [
  { role: "Suppliers", icon: Award, recs: [
    "Launch Aperol campaign across Lagos/Abuja nightlife — ₦3.2M GMV potential",
    "Expand Craft Beer Co. to Abuja — 12 bars actively requesting",
    "Pre-position premium whiskey for Q4 festive season in PH/Benin",
  ]},
  { role: "Distributors", icon: Truck, recs: [
    "Open micro-depot in Ibadan — reduce cost/drop from ₦6,400 to ₦3,800",
    "Expand territory into Benin City GRA — greenfield with ₦72M annual potential",
    "Deploy cold-chain vehicles for Port Harcourt premium segment",
  ]},
  { role: "Retailers", icon: MapPin, recs: [
    "Stock emerging cocktail brands — category growing 52% QoQ",
    "Introduce premium tequila range — high-margin, trending in nightlife",
    "Partner with craft breweries for exclusive tap rotations",
  ]},
];

const LiquorExpansionDashboard = () => (
  <IndustryLayout industryCode="liquor">
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Globe className="w-6 h-6 text-primary" /> Global Expansion Engine
          </h1>
          <p className="text-sm text-muted-foreground">Strategic AI system for Nigerian alcohol market expansion decisions</p>
        </div>
        <Button><Brain className="w-4 h-4 mr-1" /> Generate Strategy</Button>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {expansionSummary.map(k => (
          <Card key={k.label}>
            <CardContent className="p-3 text-center">
              <k.icon className={`w-5 h-5 mx-auto mb-1 ${k.color}`} />
              <p className="text-xl font-bold">{k.value}</p>
              <p className="text-[10px] text-muted-foreground">{k.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Market Overview</TabsTrigger>
          <TabsTrigger value="alerts">Expansion Alerts</TabsTrigger>
          <TabsTrigger value="strategy">Strategic Recs</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {/* Demand Heatmap */}
            <Card>
              <CardHeader><CardTitle className="text-sm">Nigeria Demand Intensity</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={demandHeatmap} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis type="number" domain={[0, 100]} fontSize={10} stroke="hsl(var(--muted-foreground))" />
                    <YAxis type="category" dataKey="city" fontSize={10} stroke="hsl(var(--muted-foreground))" width={80} />
                    <Tooltip />
                    <Bar dataKey="demand" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Market Share Distribution */}
            <Card>
              <CardHeader><CardTitle className="text-sm">Revenue Distribution by Region</CardTitle></CardHeader>
              <CardContent className="flex items-center justify-center">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={2} dataKey="value" label={({ name, value }) => `${name} ${value}%`}>
                      {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* City Quick View */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {demandHeatmap.slice(0, 8).map(c => (
              <Card key={c.city} className="hover:border-primary/30 transition-all cursor-pointer">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-sm">{c.city}</span>
                    <Badge variant={c.demand >= 80 ? "default" : c.demand >= 60 ? "secondary" : "outline"} className="text-[10px]">{c.demand}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{c.retailers} retailers</p>
                  <p className="text-sm font-bold text-emerald-600">{c.potential}/yr</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-3">
          {topAlerts.map((alert, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className={alert.priority === "high" ? "border-amber-500/30" : ""}>
                <CardContent className="p-4 flex items-start gap-3">
                  {alert.priority === "high"
                    ? <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5" />
                    : <TrendingUp className="w-5 h-5 text-primary mt-0.5" />
                  }
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="text-[10px]">{alert.city}</Badge>
                      <Badge className={alert.priority === "high" ? "bg-amber-500/15 text-amber-600" : "bg-primary/15 text-primary"} >{alert.priority}</Badge>
                    </div>
                    <p className="text-sm text-foreground">{alert.message}</p>
                  </div>
                  <Button size="sm" variant="outline"><Zap className="w-3 h-3 mr-1" /> Act</Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </TabsContent>

        <TabsContent value="strategy" className="space-y-4">
          {strategicRecs.map((group, i) => (
            <Card key={group.role}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <group.icon className="w-4 h-4 text-primary" /> {group.role} Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {group.recs.map((rec, j) => (
                    <div key={j} className="p-3 rounded-lg bg-muted/30 flex items-center gap-3">
                      <Zap className="w-4 h-4 text-primary shrink-0" />
                      <p className="text-sm text-foreground">{rec}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      {/* Master AI Insight */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-4 flex items-start gap-3">
          <Brain className="w-5 h-5 text-primary mt-0.5" />
          <div>
            <p className="font-semibold text-sm">Expansion Engine Summary</p>
            <p className="text-sm text-muted-foreground mt-1">
              The Nigerian alcohol market presents ₦1.4B in annual expansion opportunities across 14 target cities. 
              The Lagos → Abuja → Port Harcourt corridor remains the primary growth axis (72% of total opportunity). 
              Emerging markets in Benin City, Enugu, and Calabar show 30-45% demand growth. Northern expansion 
              is constrained by Sharia regulations to hotel-licensed venues only. Recommend prioritizing 5 cities 
              in the southern corridor with combined ₦820M annual potential and low regulatory risk.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  </IndustryLayout>
);

export default LiquorExpansionDashboard;
