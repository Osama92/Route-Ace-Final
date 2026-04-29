import IndustryLayout from "@/components/industry/IndustryLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import {
  PieChart as PieIcon, TrendingUp, TrendingDown, Globe, BarChart3,
  Brain, Target, Award, MapPin,
} from "lucide-react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

const spiritsShare = [
  { name: "Hennessy", value: 24, color: "hsl(var(--primary))" },
  { name: "Johnnie Walker", value: 19, color: "hsl(142 76% 36%)" },
  { name: "Grey Goose", value: 15, color: "hsl(262 83% 58%)" },
  { name: "Ciroc", value: 10, color: "hsl(350 89% 60%)" },
  { name: "Jack Daniel's", value: 8, color: "hsl(45 93% 47%)" },
  { name: "Others", value: 24, color: "hsl(var(--muted))" },
];

const beerShare = [
  { name: "Heineken", value: 28, color: "hsl(142 76% 36%)" },
  { name: "Guinness", value: 22, color: "hsl(var(--primary))" },
  { name: "Star Lager", value: 18, color: "hsl(45 93% 47%)" },
  { name: "Trophy", value: 12, color: "hsl(262 83% 58%)" },
  { name: "Life Lager", value: 8, color: "hsl(350 89% 60%)" },
  { name: "Others", value: 12, color: "hsl(var(--muted))" },
];

const cityShare = [
  { city: "Lagos", spirits: 42, wine: 28, beer: 30 },
  { city: "Abuja", spirits: 38, wine: 32, beer: 30 },
  { city: "Port Harcourt", spirits: 30, wine: 18, beer: 52 },
  { city: "Ibadan", spirits: 22, wine: 12, beer: 66 },
  { city: "Enugu", spirits: 26, wine: 14, beer: 60 },
];

const shareMovements = [
  { brand: "Ciroc", category: "Vodka", change: "+3.2pp", direction: "up", from: "6.8%", to: "10.0%", reason: "Aggressive on-premise activations in Lagos nightlife" },
  { brand: "Grey Goose", category: "Vodka", change: "+2.1pp", direction: "up", from: "12.9%", to: "15.0%", reason: "Premium positioning resonating in cocktail bars" },
  { brand: "Johnnie Walker Red", category: "Scotch", change: "-1.8pp", direction: "down", from: "8.2%", to: "6.4%", reason: "Losing ground to Hennessy in price-sensitive segments" },
  { brand: "Star Lager", category: "Beer", change: "-2.4pp", direction: "down", from: "20.4%", to: "18.0%", reason: "Craft beer and Heineken capturing younger demographics" },
  { brand: "Moët", category: "Champagne", change: "+1.6pp", direction: "up", from: "11.4%", to: "13.0%", reason: "Exclusive distribution deal in premium venues" },
];

const retailCategoryShare = [
  { type: "Cocktail Bars", spirits: 72, wine: 12, beer: 16 },
  { type: "Nightclubs", spirits: 65, wine: 5, beer: 30 },
  { type: "Restaurants", spirits: 28, wine: 48, beer: 24 },
  { type: "Liquor Stores", spirits: 38, wine: 22, beer: 40 },
  { type: "Supermarkets", spirits: 25, wine: 30, beer: 45 },
];

const LiquorMarketShare = () => {
  return (
    <IndustryLayout industryCode="liquor">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Market Share Intelligence</h1>
          <p className="text-sm text-muted-foreground">Brand share estimation across cities, districts, and retail categories</p>
        </div>

        {/* Share Pies */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { title: "Spirits Market Share", data: spiritsShare },
            { title: "Beer Market Share", data: beerShare },
          ].map(chart => (
            <Card key={chart.title}>
              <CardHeader><CardTitle className="text-sm">{chart.title}</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={chart.data} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={2} dataKey="value">
                      {chart.data.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Pie>
                    <Tooltip formatter={(value: number) => `${value}%`} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-3 gap-1 mt-2">
                  {chart.data.map(d => (
                    <div key={d.name} className="flex items-center gap-1 text-xs">
                      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: d.color }} />
                      <span className="truncate">{d.name} ({d.value}%)</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="movements" className="space-y-4">
          <TabsList>
            <TabsTrigger value="movements">Share Movements</TabsTrigger>
            <TabsTrigger value="cities">By City</TabsTrigger>
            <TabsTrigger value="retail">By Retail Type</TabsTrigger>
          </TabsList>

          {/* Share Movements */}
          <TabsContent value="movements" className="space-y-2">
            {shareMovements.map((m, i) => (
              <motion.div key={m.brand} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                <Card className={`border-l-4 ${m.direction === "up" ? "border-l-emerald-500" : "border-l-rose-500"}`}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        {m.direction === "up" ? <TrendingUp className="w-4 h-4 text-emerald-500" /> : <TrendingDown className="w-4 h-4 text-rose-500" />}
                        <span className="font-semibold text-sm">{m.brand}</span>
                        <Badge variant="outline">{m.category}</Badge>
                      </div>
                      <Badge className={m.direction === "up" ? "bg-emerald-500/15 text-emerald-600" : "bg-rose-500/15 text-rose-600"}>
                        {m.change}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                      <span>{m.from}</span> → <span className="font-medium text-foreground">{m.to}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{m.reason}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </TabsContent>

          {/* By City */}
          <TabsContent value="cities">
            <Card>
              <CardHeader><CardTitle className="text-sm">Category Mix by City (%)</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={cityShare}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="city" fontSize={10} stroke="hsl(var(--muted-foreground))" />
                    <YAxis fontSize={10} stroke="hsl(var(--muted-foreground))" />
                    <Tooltip />
                    <Bar dataKey="spirits" stackId="a" fill="hsl(var(--primary))" name="Spirits" />
                    <Bar dataKey="wine" stackId="a" fill="hsl(350 89% 60%)" name="Wine" />
                    <Bar dataKey="beer" stackId="a" fill="hsl(45 93% 47%)" name="Beer" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* By Retail Type */}
          <TabsContent value="retail" className="space-y-3">
            {retailCategoryShare.map((r, i) => (
              <motion.div key={r.type} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                <Card>
                  <CardContent className="p-4">
                    <p className="font-semibold text-sm mb-3">{r.type}</p>
                    <div className="space-y-2">
                      {[
                        { label: "Spirits", value: r.spirits, color: "bg-primary" },
                        { label: "Wine", value: r.wine, color: "bg-rose-500" },
                        { label: "Beer", value: r.beer, color: "bg-amber-500" },
                      ].map(cat => (
                        <div key={cat.label} className="flex items-center gap-3">
                          <span className="text-xs w-14 text-muted-foreground">{cat.label}</span>
                          <div className="flex-1 bg-muted/30 rounded-full h-2">
                            <div className={`h-2 rounded-full ${cat.color} transition-all`} style={{ width: `${cat.value}%` }} />
                          </div>
                          <span className="text-xs font-medium w-8 text-right">{cat.value}%</span>
                        </div>
                      ))}
                    </div>
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
              <p className="font-semibold text-sm">Market Share Intelligence</p>
              <p className="text-sm text-muted-foreground mt-1">
                Ciroc gained +3.2 percentage points in the vodka segment this quarter — the largest movement 
                across all brands. Port Harcourt remains beer-dominated (52%) with significant spirits upside. 
                Restaurants show strongest wine share (48%) — wine brands should prioritize food pairing activations 
                in this channel.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </IndustryLayout>
  );
};

export default LiquorMarketShare;
