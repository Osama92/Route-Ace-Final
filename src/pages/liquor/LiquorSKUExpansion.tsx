import IndustryLayout from "@/components/industry/IndustryLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  Wine, TrendingUp, MapPin, DollarSign, Target, Brain, Zap,
  ArrowRight, BarChart3, Star,
} from "lucide-react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
} from "recharts";

const skuExpansionData = [
  {
    sku: "Clase Azul Reposado",
    category: "Premium Tequila",
    currentCities: ["Lagos Island", "Abuja Maitama"],
    expansionTargets: [
      { city: "Port Harcourt GRA", score: 92, demand: "Very Strong", revenue: "₦8.2M/mo", reason: "Oil exec nightlife district, 72% growth in tequila category" },
      { city: "Lekki Phase 1", score: 89, demand: "Strong", revenue: "₦6.4M/mo", reason: "New premium bars opening monthly, cocktail culture emerging" },
      { city: "Ibadan Bodija", score: 74, demand: "Moderate", revenue: "₦3.1M/mo", reason: "University-adjacent entertainment zone expanding" },
    ],
  },
  {
    sku: "Hennessy VS",
    category: "Cognac",
    currentCities: ["Lagos", "Abuja", "Port Harcourt"],
    expansionTargets: [
      { city: "Benin City", score: 88, demand: "Strong", revenue: "₦12.4M/mo", reason: "Festive culture, highest per-capita spirit consumption in South-South" },
      { city: "Enugu", score: 85, demand: "Strong", revenue: "₦9.8M/mo", reason: "Growing middle class, strong event/occasion buying pattern" },
      { city: "Onitsha", score: 81, demand: "Moderate", revenue: "₦7.2M/mo", reason: "Market hub with spillover from formal distribution gaps" },
    ],
  },
  {
    sku: "Aperol",
    category: "Aperitif",
    currentCities: ["Lagos Victoria Island"],
    expansionTargets: [
      { city: "Abuja Wuse", score: 91, demand: "Very Strong", revenue: "₦5.6M/mo", reason: "Brunch culture booming, 52% organic aperitif growth" },
      { city: "Lagos Ikoyi", score: 87, demand: "Strong", revenue: "₦4.8M/mo", reason: "High-net-worth residential area, strong cocktail adoption" },
      { city: "Port Harcourt", score: 78, demand: "Emerging", revenue: "₦2.4M/mo", reason: "International community driving demand" },
    ],
  },
  {
    sku: "Guinness Foreign Extra",
    category: "Stout",
    currentCities: ["National"],
    expansionTargets: [
      { city: "Calabar", score: 86, demand: "Strong", revenue: "₦14.2M/mo", reason: "Festival city, underserved formal distribution" },
      { city: "Uyo", score: 84, demand: "Strong", revenue: "₦11.8M/mo", reason: "Fastest-growing city in South-South, new entertainment hubs" },
      { city: "Kaduna", score: 72, demand: "Moderate", revenue: "₦6.1M/mo", reason: "Licensed venues expanding in GRA districts" },
    ],
  },
];

const categoryDemandData = [
  { city: "Lagos", spirits: 92, beer: 88, wine: 74, cocktails: 82, aperitifs: 68 },
  { city: "Abuja", spirits: 86, beer: 72, wine: 81, cocktails: 78, aperitifs: 72 },
  { city: "PH", spirits: 78, beer: 84, wine: 62, cocktails: 64, aperitifs: 48 },
  { city: "Ibadan", spirits: 64, beer: 82, wine: 42, cocktails: 38, aperitifs: 22 },
  { city: "Enugu", spirits: 72, beer: 78, wine: 48, cocktails: 44, aperitifs: 28 },
  { city: "Benin", spirits: 76, beer: 86, wine: 38, cocktails: 42, aperitifs: 18 },
];

const radarData = [
  { metric: "Demand Signal", value: 88 },
  { metric: "Retailer Readiness", value: 76 },
  { metric: "Logistics Score", value: 82 },
  { metric: "Competition Gap", value: 91 },
  { metric: "Income Match", value: 74 },
  { metric: "Regulatory Clear", value: 95 },
];

const LiquorSKUExpansion = () => (
  <IndustryLayout industryCode="liquor">
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Wine className="w-6 h-6 text-primary" /> SKU Expansion Intelligence
          </h1>
          <p className="text-sm text-muted-foreground">AI-powered product launch planning across Nigerian markets</p>
        </div>
        <Button><Brain className="w-4 h-4 mr-1" /> Generate SKU Plan</Button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "SKUs Analyzed", value: "142", icon: Wine, color: "text-primary" },
          { label: "Expansion Targets", value: "68", icon: Target, color: "text-emerald-500" },
          { label: "Revenue Potential", value: "₦412M/mo", icon: DollarSign, color: "text-amber-500" },
          { label: "Avg Launch Score", value: "84", icon: Star, color: "text-purple-500" },
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

      <Tabs defaultValue="sku-targets">
        <TabsList>
          <TabsTrigger value="sku-targets">SKU Targets</TabsTrigger>
          <TabsTrigger value="category-demand">Category Demand</TabsTrigger>
          <TabsTrigger value="readiness">Launch Readiness</TabsTrigger>
        </TabsList>

        <TabsContent value="sku-targets" className="space-y-4">
          {skuExpansionData.map((sku, i) => (
            <motion.div key={sku.sku} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Wine className="w-4 h-4 text-primary" />
                      <span>{sku.sku}</span>
                      <Badge variant="outline">{sku.category}</Badge>
                    </div>
                    <span className="text-xs text-muted-foreground">Currently in: {sku.currentCities.join(", ")}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {sku.expansionTargets.map((t, j) => (
                      <div key={j} className="p-3 rounded-lg bg-muted/30 flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <span className="text-sm font-bold text-primary">{t.score}</span>
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <MapPin className="w-3 h-3 text-muted-foreground" />
                              <span className="font-medium text-sm">{t.city}</span>
                              <ArrowRight className="w-3 h-3 text-muted-foreground" />
                              <Badge variant={t.demand === "Very Strong" ? "default" : "secondary"} className="text-[10px]">{t.demand}</Badge>
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5">{t.reason}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-emerald-600">{t.revenue}</p>
                          <Button size="sm" variant="outline" className="mt-1"><Zap className="w-3 h-3 mr-1" /> Launch</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </TabsContent>

        <TabsContent value="category-demand">
          <Card>
            <CardHeader><CardTitle className="text-sm">Category Demand Heatmap by City</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={categoryDemandData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="city" fontSize={11} stroke="hsl(var(--muted-foreground))" />
                  <YAxis fontSize={10} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip />
                  <Bar dataKey="spirits" name="Spirits" fill="hsl(var(--primary))" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="beer" name="Beer" fill="hsl(45 93% 47%)" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="wine" name="Wine" fill="hsl(280 68% 60%)" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="cocktails" name="Cocktails" fill="hsl(142 76% 36%)" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="aperitifs" name="Aperitifs" fill="hsl(350 80% 55%)" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="readiness">
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader><CardTitle className="text-sm">Launch Readiness Radar — Port Harcourt GRA</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={280}>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="hsl(var(--border))" />
                    <PolarAngleAxis dataKey="metric" fontSize={10} stroke="hsl(var(--muted-foreground))" />
                    <PolarRadiusAxis domain={[0, 100]} fontSize={9} stroke="hsl(var(--muted-foreground))" />
                    <Radar dataKey="value" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.2} />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-5">
                <Brain className="w-6 h-6 text-primary mb-3" />
                <h3 className="font-semibold mb-2">AI Launch Recommendation</h3>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <p><strong className="text-foreground">Priority 1:</strong> Launch Clase Azul Reposado in Port Harcourt GRA. Score 92/100 — oil exec nightlife district shows 72% tequila growth with zero premium tequila distribution.</p>
                  <p><strong className="text-foreground">Priority 2:</strong> Expand Aperol into Abuja Wuse. Score 91/100 — brunch culture boom with 52% organic aperitif growth.</p>
                  <p><strong className="text-foreground">Priority 3:</strong> Deploy Hennessy VS in Benin City. Score 88/100 — highest per-capita spirit consumption in South-South region.</p>
                  <p className="text-xs pt-2 border-t border-border">Combined revenue opportunity: ₦26.2M/month across 3 launches.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  </IndustryLayout>
);

export default LiquorSKUExpansion;
