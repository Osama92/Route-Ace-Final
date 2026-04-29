import { useState } from "react";
import IndustryLayout from "@/components/industry/IndustryLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import {
  Wine, Beer, Martini, TrendingUp, TrendingDown, Award, Target,
  BarChart3, Brain, Globe, Star, Zap,
} from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line, PieChart, Pie, Cell } from "recharts";

const topBrands = [
  { brand: "Hennessy VS", category: "Cognac", revenue: "₦68M", cases: 2240, growth: "+18%", marketShare: 24, topChannel: "On-Premise", topCity: "Lagos", velocity: 8.2 },
  { brand: "Johnnie Walker Black", category: "Scotch", revenue: "₦54M", cases: 1800, growth: "+12%", marketShare: 19, topChannel: "Off-Premise", topCity: "Lagos", velocity: 7.1 },
  { brand: "Grey Goose", category: "Vodka", revenue: "₦42M", cases: 1400, growth: "+24%", marketShare: 15, topChannel: "On-Premise", topCity: "Lagos", velocity: 6.8 },
  { brand: "Moët & Chandon", category: "Champagne", revenue: "₦38M", cases: 950, growth: "+8%", marketShare: 13, topChannel: "On-Premise", topCity: "Abuja", velocity: 5.4 },
  { brand: "Heineken", category: "Beer", revenue: "₦32M", cases: 6400, growth: "+6%", marketShare: 11, topChannel: "Off-Premise", topCity: "Lagos", velocity: 12.6 },
  { brand: "Ciroc", category: "Vodka", revenue: "₦28M", cases: 930, growth: "+32%", marketShare: 10, topChannel: "On-Premise", topCity: "Lagos", velocity: 5.8 },
  { brand: "Guinness FES", category: "Stout", revenue: "₦24M", cases: 8000, growth: "+4%", marketShare: 8, topChannel: "Off-Premise", topCity: "Port Harcourt", velocity: 14.2 },
];

const channelMix = [
  { name: "On-Premise (Bars)", value: 42, color: "hsl(var(--primary))" },
  { name: "On-Premise (Restaurants)", value: 18, color: "hsl(262 83% 58%)" },
  { name: "Off-Premise (Liquor Stores)", value: 28, color: "hsl(142 76% 36%)" },
  { name: "Off-Premise (Supermarkets)", value: 12, color: "hsl(45 93% 47%)" },
];

const monthlyTrend = [
  { month: "Sep", spirits: 142, wine: 68, beer: 94 },
  { month: "Oct", spirits: 156, wine: 72, beer: 98 },
  { month: "Nov", spirits: 168, wine: 82, beer: 102 },
  { month: "Dec", spirits: 248, wine: 124, beer: 156 },
  { month: "Jan", spirits: 172, wine: 78, beer: 104 },
  { month: "Feb", spirits: 186, wine: 84, beer: 108 },
];

const categoryInsights = [
  { category: "Premium Spirits", insight: "Tequila fastest-growing sub-category (+67%). Don Julio and Patrón driving.", icon: Martini },
  { category: "Wine", insight: "Rosé outselling red wine in premium on-premise for first time. +45% QoQ.", icon: Wine },
  { category: "Beer", insight: "Craft beer segment growing 3x faster than mainstream. Lekki leads adoption.", icon: Beer },
  { category: "Champagne", insight: "December spike +180%. Pre-position inventory by mid-November for 2x ROI.", icon: Star },
];

const LiquorBrandPerformance = () => {
  const [channel, setChannel] = useState("all");

  return (
    <IndustryLayout industryCode="liquor">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Brand Performance Intelligence</h1>
            <p className="text-sm text-muted-foreground">Cross-channel brand analytics across the distribution network</p>
          </div>
          <Select value={channel} onValueChange={setChannel}>
            <SelectTrigger className="w-[180px]"><SelectValue placeholder="All Channels" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Channels</SelectItem>
              <SelectItem value="on-premise">On-Premise</SelectItem>
              <SelectItem value="off-premise">Off-Premise</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Category Trend */}
        <Card>
          <CardHeader><CardTitle className="text-sm">Revenue Trend by Category (₦M)</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" fontSize={10} stroke="hsl(var(--muted-foreground))" />
                <YAxis fontSize={10} stroke="hsl(var(--muted-foreground))" />
                <Tooltip />
                <Line type="monotone" dataKey="spirits" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} name="Spirits" />
                <Line type="monotone" dataKey="wine" stroke="hsl(350 89% 60%)" strokeWidth={2} dot={false} name="Wine" />
                <Line type="monotone" dataKey="beer" stroke="hsl(45 93% 47%)" strokeWidth={2} dot={false} name="Beer" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Channel Mix */}
          <Card>
            <CardHeader><CardTitle className="text-sm">Channel Distribution</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={channelMix} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                    {channelMix.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-1 mt-2">
                {channelMix.map(c => (
                  <div key={c.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }} />
                      <span>{c.name}</span>
                    </div>
                    <span className="font-medium">{c.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Category Insights */}
          <Card className="col-span-2">
            <CardHeader><CardTitle className="text-sm flex items-center gap-2"><Zap className="w-4 h-4 text-amber-500" /> Category Insights</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {categoryInsights.map((c, i) => (
                <motion.div key={c.category} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                  <c.icon className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-sm">{c.category}</p>
                    <p className="text-xs text-muted-foreground">{c.insight}</p>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Brand Rankings */}
        <div className="space-y-2">
          <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Brand Leaderboard</h3>
          {topBrands.map((b, i) => (
            <motion.div key={b.brand} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
              <Card className="hover:border-primary/30 transition-all">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                        #{i + 1}
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{b.brand}</p>
                        <p className="text-xs text-muted-foreground">{b.category} · {b.topChannel}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="font-bold">{b.revenue}</p>
                        <p className="text-[10px] text-muted-foreground">{b.cases.toLocaleString()} cases</p>
                      </div>
                      <Badge className={b.growth.startsWith("+") && parseInt(b.growth) >= 20 ? "bg-emerald-500/15 text-emerald-600" : b.growth.startsWith("+") ? "bg-blue-500/15 text-blue-600" : "bg-rose-500/15 text-rose-600"}>
                        {b.growth}
                      </Badge>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-xs">
                    <div className="p-1.5 bg-muted/20 rounded text-center"><span className="font-medium">{b.marketShare}%</span><br /><span className="text-[10px] text-muted-foreground">Share</span></div>
                    <div className="p-1.5 bg-muted/20 rounded text-center"><span className="font-medium">{b.velocity}</span><br /><span className="text-[10px] text-muted-foreground">Velocity</span></div>
                    <div className="p-1.5 bg-muted/20 rounded text-center"><span className="font-medium">{b.topChannel}</span><br /><span className="text-[10px] text-muted-foreground">Channel</span></div>
                    <div className="p-1.5 bg-muted/20 rounded text-center"><span className="font-medium">{b.topCity}</span><br /><span className="text-[10px] text-muted-foreground">Top City</span></div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* AI Summary */}
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4 flex items-start gap-3">
            <Brain className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <p className="font-semibold text-sm">Brand Intelligence Summary</p>
              <p className="text-sm text-muted-foreground mt-1">
                Ciroc (+32%) and Grey Goose (+24%) are the fastest-growing premium spirits. 
                On-premise cocktail bars drive 42% of total revenue. December shows 2.5x typical volume — 
                brands should pre-invest in Q4 trade promotions. Guinness FES leads velocity at 14.2 cases/outlet/month 
                but has the lowest growth (+4%), signaling market maturity.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </IndustryLayout>
  );
};

export default LiquorBrandPerformance;
