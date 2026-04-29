import { useState } from "react";
import IndustryLayout from "@/components/industry/IndustryLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import {
  User, Wine, Beer, Martini, TrendingUp, TrendingDown, CreditCard,
  ShoppingCart, Truck, Star, Calendar, MapPin, BarChart3, Brain,
  ChevronRight, Package, DollarSign, Clock,
} from "lucide-react";
import { ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

const retailerProfile = {
  name: "The Gold Barrel Lounge",
  type: "Premium Cocktail Bar",
  tier: "Platinum",
  district: "Victoria Island, Lagos",
  owner: "Chinedu Okoro",
  since: "Mar 2022",
  score: 92,
  creditLimit: "₦8M",
  creditUsed: "₦5.2M",
  paymentBehavior: "On-time (97%)",
  monthlySpend: "₦4.2M",
  avgOrderValue: "₦680K",
  orderFrequency: "6.2x/month",
  lastVisit: "2 days ago",
  lastOrder: "Yesterday",
  deliveriesThisMonth: 8,
  topCategories: [
    { name: "Premium Spirits", pct: 45, value: "₦1.89M", trend: "+12%" },
    { name: "Champagne & Wine", pct: 28, value: "₦1.18M", trend: "+8%" },
    { name: "Beer & RTD", pct: 15, value: "₦630K", trend: "-3%" },
    { name: "Mixers & Non-Alc", pct: 12, value: "₦504K", trend: "+5%" },
  ],
  topBrands: [
    { brand: "Hennessy VS", cases: 42, revenue: "₦1.26M", growth: "+18%" },
    { brand: "Grey Goose", cases: 28, revenue: "₦840K", growth: "+24%" },
    { brand: "Moët & Chandon", cases: 18, revenue: "₦720K", growth: "+6%" },
    { brand: "Johnnie Walker Black", cases: 22, revenue: "₦660K", growth: "-2%" },
    { brand: "Ciroc Vodka", cases: 15, revenue: "₦450K", growth: "+32%" },
  ],
};

const radarData = [
  { metric: "Spend Volume", score: 92 },
  { metric: "Payment Reliability", score: 97 },
  { metric: "Order Frequency", score: 85 },
  { metric: "Brand Diversity", score: 78 },
  { metric: "Growth Trajectory", score: 88 },
  { metric: "Engagement", score: 90 },
];

const monthlyTrend = [
  { month: "Sep", spend: 3200 }, { month: "Oct", spend: 3500 },
  { month: "Nov", spend: 3800 }, { month: "Dec", spend: 5600 },
  { month: "Jan", spend: 3900 }, { month: "Feb", spend: 4200 },
];

const LiquorRetailerIntelligence = () => {
  const p = retailerProfile;

  return (
    <IndustryLayout industryCode="liquor">
      <div className="space-y-6">
        {/* Profile Header */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Martini className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-xl font-bold">{p.name}</h1>
                    <Badge className="bg-amber-500/15 text-amber-600">{p.tier}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{p.type} · {p.district}</p>
                  <p className="text-xs text-muted-foreground mt-1">Owner: {p.owner} · Customer since {p.since}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="w-16 h-16 rounded-full border-4 border-primary flex items-center justify-center mx-auto">
                  <span className="text-xl font-bold text-primary">{p.score}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Intelligence Score</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Monthly Spend", value: p.monthlySpend, icon: DollarSign, color: "text-emerald-500" },
            { label: "Avg Order Value", value: p.avgOrderValue, icon: ShoppingCart, color: "text-blue-500" },
            { label: "Order Frequency", value: p.orderFrequency, icon: Clock, color: "text-amber-500" },
            { label: "Deliveries (MTD)", value: String(p.deliveriesThisMonth), icon: Truck, color: "text-purple-500" },
          ].map(m => (
            <Card key={m.label}>
              <CardContent className="p-3 text-center">
                <m.icon className={`w-5 h-5 mx-auto mb-1 ${m.color}`} />
                <p className="text-xl font-bold">{m.value}</p>
                <p className="text-[10px] text-muted-foreground">{m.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="categories" className="space-y-4">
          <TabsList>
            <TabsTrigger value="categories">Category Mix</TabsTrigger>
            <TabsTrigger value="brands">Top Brands</TabsTrigger>
            <TabsTrigger value="credit">Credit Profile</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Category Mix */}
          <TabsContent value="categories" className="space-y-3">
            {p.topCategories.map((cat, i) => (
              <motion.div key={cat.name} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">{cat.name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold">{cat.value}</span>
                        <Badge className={cat.trend.startsWith("+") ? "bg-emerald-500/15 text-emerald-600" : "bg-rose-500/15 text-rose-600"}>
                          {cat.trend}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Progress value={cat.pct} className="flex-1 h-2" />
                      <span className="text-sm font-medium w-10 text-right">{cat.pct}%</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </TabsContent>

          {/* Top Brands */}
          <TabsContent value="brands" className="space-y-2">
            {p.topBrands.map((b, i) => (
              <motion.div key={b.brand} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                <Card className="hover:border-primary/30 transition-all">
                  <CardContent className="p-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                        #{i + 1}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{b.brand}</p>
                        <p className="text-xs text-muted-foreground">{b.cases} cases/mo</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-sm">{b.revenue}</span>
                      <Badge variant="outline" className={b.growth.startsWith("+") ? "text-emerald-600" : "text-rose-600"}>
                        {b.growth}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </TabsContent>

          {/* Credit Profile */}
          <TabsContent value="credit">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader><CardTitle className="text-sm">Credit Utilization</CardTitle></CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Credit Limit</span>
                      <span className="font-bold">{p.creditLimit}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Used</span>
                      <span className="font-bold text-amber-600">{p.creditUsed}</span>
                    </div>
                    <Progress value={65} className="h-3" />
                    <p className="text-xs text-muted-foreground">65% utilized — ₦2.8M available</p>
                    <div className="flex justify-between text-sm pt-2 border-t">
                      <span className="text-muted-foreground">Payment Behavior</span>
                      <Badge className="bg-emerald-500/15 text-emerald-600">{p.paymentBehavior}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle className="text-sm">Retailer Score Breakdown</CardTitle></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={220}>
                    <RadarChart data={radarData}>
                      <PolarGrid stroke="hsl(var(--border))" />
                      <PolarAngleAxis dataKey="metric" fontSize={9} stroke="hsl(var(--muted-foreground))" />
                      <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                      <Radar dataKey="score" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.2} strokeWidth={2} />
                    </RadarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Analytics */}
          <TabsContent value="analytics">
            <Card>
              <CardHeader><CardTitle className="text-sm">6-Month Spend Trend (₦'000)</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={monthlyTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" fontSize={10} stroke="hsl(var(--muted-foreground))" />
                    <YAxis fontSize={10} stroke="hsl(var(--muted-foreground))" />
                    <Tooltip />
                    <Area type="monotone" dataKey="spend" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.15} strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* AI Recommendation */}
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4 flex items-start gap-3">
            <Brain className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <p className="font-semibold text-sm">AI Recommendation</p>
              <p className="text-sm text-muted-foreground mt-1">
                Ciroc Vodka shows fastest growth (+32%) at this account. Recommend featuring in next trade promo. 
                December spend spike (₦5.6M) suggests strong festive season potential — pre-position premium inventory 
                by November. Credit utilization healthy at 65%.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </IndustryLayout>
  );
};

export default LiquorRetailerIntelligence;
