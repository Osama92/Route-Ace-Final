import IndustryLayout from "@/components/industry/IndustryLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  Award, TrendingUp, MapPin, DollarSign, Target, Brain, Zap,
  ArrowUpRight, Globe, Users, BarChart3,
} from "lucide-react";
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  AreaChart, Area,
} from "recharts";

const brandExpansions = [
  {
    brand: "Premium Whiskey Co.",
    category: "Whiskey",
    score: 94,
    currentMarkets: ["Lagos", "Abuja"],
    growth: "+42%",
    retailerAdoption: 184,
    recommendedCities: [
      { city: "Port Harcourt", score: 91, reason: "Premium segment growing 28%, nightlife venue expansion", potential: "₦14.2M/mo" },
      { city: "Benin City", score: 86, reason: "Festive culture + rising disposable income", potential: "₦8.6M/mo" },
      { city: "Calabar", score: 78, reason: "Tourism + carnival season demand spike", potential: "₦5.4M/mo" },
    ],
  },
  {
    brand: "Craft Beer Co.",
    category: "Craft Beer",
    score: 91,
    currentMarkets: ["Lagos"],
    growth: "+68%",
    retailerAdoption: 62,
    recommendedCities: [
      { city: "Abuja", score: 89, reason: "12 bars actively requesting craft beer supply", potential: "₦9.8M/mo" },
      { city: "Ibadan", score: 82, reason: "University towns driving craft beverage culture", potential: "₦4.2M/mo" },
      { city: "Enugu", score: 76, reason: "Emerging cocktail and craft scene", potential: "₦3.1M/mo" },
    ],
  },
  {
    brand: "Casa Noble Tequila",
    category: "Tequila",
    score: 87,
    currentMarkets: ["Lagos Island"],
    growth: "+55%",
    retailerAdoption: 34,
    recommendedCities: [
      { city: "Abuja Wuse", score: 88, reason: "High-end Mexican restaurant openings", potential: "₦6.4M/mo" },
      { city: "Lekki", score: 84, reason: "Cocktail bar density increasing 40% QoQ", potential: "₦7.8M/mo" },
    ],
  },
];

const growthTrendData = [
  { month: "Sep", whiskey: 62, craft: 28, tequila: 18, wine: 44 },
  { month: "Oct", whiskey: 68, craft: 34, tequila: 22, wine: 46 },
  { month: "Nov", whiskey: 74, craft: 42, tequila: 28, wine: 48 },
  { month: "Dec", whiskey: 92, craft: 56, tequila: 38, wine: 62 },
  { month: "Jan", whiskey: 78, craft: 62, tequila: 42, wine: 52 },
  { month: "Feb", whiskey: 82, craft: 72, tequila: 48, wine: 54 },
  { month: "Mar", whiskey: 88, craft: 82, tequila: 56, wine: 58 },
];

const adoptionData = [
  { month: "Sep", newRetailers: 12, reorders: 34 },
  { month: "Oct", newRetailers: 18, reorders: 42 },
  { month: "Nov", newRetailers: 24, reorders: 56 },
  { month: "Dec", newRetailers: 38, reorders: 78 },
  { month: "Jan", newRetailers: 32, reorders: 84 },
  { month: "Feb", newRetailers: 44, reorders: 96 },
  { month: "Mar", newRetailers: 52, reorders: 112 },
];

const LiquorBrandExpansion = () => (
  <IndustryLayout industryCode="liquor">
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Award className="w-6 h-6 text-primary" /> Brand Expansion Intelligence
          </h1>
          <p className="text-sm text-muted-foreground">Predict which brands will trend and where to launch them</p>
        </div>
        <Button><Globe className="w-4 h-4 mr-1" /> Full Expansion Report</Button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Brands Analyzed", value: "28", icon: Award, color: "text-primary" },
          { label: "Growth Markets", value: "14", icon: TrendingUp, color: "text-emerald-500" },
          { label: "Revenue Opportunity", value: "₦186M/mo", icon: DollarSign, color: "text-amber-500" },
          { label: "New Retailers", value: "52/mo", icon: Users, color: "text-purple-500" },
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

      {/* Growth Trends */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle className="text-sm">Brand Category Growth Trends</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={growthTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" fontSize={10} stroke="hsl(var(--muted-foreground))" />
                <YAxis fontSize={10} stroke="hsl(var(--muted-foreground))" />
                <Tooltip />
                <Line type="monotone" dataKey="whiskey" name="Whiskey" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="craft" name="Craft Beer" stroke="hsl(142 76% 36%)" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="tequila" name="Tequila" stroke="hsl(45 93% 47%)" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="wine" name="Wine" stroke="hsl(280 68% 60%)" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-sm">Retailer Adoption Velocity</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={adoptionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" fontSize={10} stroke="hsl(var(--muted-foreground))" />
                <YAxis fontSize={10} stroke="hsl(var(--muted-foreground))" />
                <Tooltip />
                <Area type="monotone" dataKey="reorders" name="Reorders" fill="hsl(var(--primary))" fillOpacity={0.15} stroke="hsl(var(--primary))" strokeWidth={2} />
                <Area type="monotone" dataKey="newRetailers" name="New Retailers" fill="hsl(142 76% 36%)" fillOpacity={0.15} stroke="hsl(142 76% 36%)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Brand Expansion Cards */}
      <div className="space-y-3">
        <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Top Brand Expansion Opportunities</h3>
        {brandExpansions.map((brand, i) => (
          <motion.div key={brand.brand} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="hover:border-primary/30 transition-all">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <span className="text-lg font-bold text-primary">{brand.score}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold">{brand.brand}</p>
                        <Badge variant="outline">{brand.category}</Badge>
                        <Badge className="bg-emerald-500/15 text-emerald-600 flex items-center gap-1">
                          <ArrowUpRight className="w-3 h-3" />{brand.growth}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">Currently in: {brand.currentMarkets.join(", ")} · {brand.retailerAdoption} retailers</p>
                    </div>
                  </div>
                  <Button size="sm"><Zap className="w-3 h-3 mr-1" /> Expand</Button>
                </div>
                <div className="space-y-2">
                  {brand.recommendedCities.map((c, j) => (
                    <div key={j} className="p-2 rounded-lg bg-muted/30 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded bg-primary/10 flex items-center justify-center">
                          <span className="text-xs font-bold text-primary">{c.score}</span>
                        </div>
                        <div>
                          <span className="text-sm font-medium">{c.city}</span>
                          <p className="text-xs text-muted-foreground">{c.reason}</p>
                        </div>
                      </div>
                      <span className="text-sm font-bold text-emerald-600">{c.potential}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* AI Insight */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-4 flex items-start gap-3">
          <Brain className="w-5 h-5 text-primary mt-0.5" />
          <div>
            <p className="font-semibold text-sm">Brand Expansion Intelligence</p>
            <p className="text-sm text-muted-foreground mt-1">
              Craft Beer Co. shows the highest growth trajectory at +68% MoM with 12 Abuja bars actively 
              requesting supply. Recommend immediate Abuja launch — greenfield opportunity worth ₦9.8M/month. 
              Premium Whiskey Co. should prioritize Port Harcourt before Q4 festive season for ₦14.2M uplift.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  </IndustryLayout>
);

export default LiquorBrandExpansion;
