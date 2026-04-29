import IndustryLayout from "@/components/industry/IndustryLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { DollarSign, ShoppingCart, Truck, Users, TrendingUp, Zap, ArrowUpRight } from "lucide-react";

const monthlyGMV = [
  { month: "Jan", gmv: 1800000, orders: 720 }, { month: "Feb", gmv: 2100000, orders: 810 },
  { month: "Mar", gmv: 2400000, orders: 920 }, { month: "Apr", gmv: 2200000, orders: 880 },
  { month: "May", gmv: 2800000, orders: 1050 }, { month: "Jun", gmv: 3100000, orders: 1180 },
];

const categoryMix = [
  { name: "Spirits", value: 42, color: "hsl(var(--primary))" },
  { name: "Beer", value: 28, color: "hsl(var(--accent))" },
  { name: "Wine", value: 18, color: "hsl(var(--secondary))" },
  { name: "RTD", value: 12, color: "hsl(var(--muted-foreground))" },
];

const topRetailers = [
  { name: "The Whiskey Lounge", orders: 48, revenue: 124000, growth: 22 },
  { name: "Metro Wine Bar", orders: 42, revenue: 98000, growth: 15 },
  { name: "Crown Spirits Shop", orders: 38, revenue: 86000, growth: 8 },
  { name: "Ember Cocktail Club", orders: 35, revenue: 78000, growth: 31 },
];

const LiquorDistributorDashboard = () => (
  <IndustryLayout industryCode="liquor">
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Monthly GMV", value: "$3.1M", change: "+10.7%", icon: DollarSign },
          { label: "Active Retailers", value: "420", change: "+28", icon: Users },
          { label: "Orders This Month", value: "1,180", change: "+130", icon: ShoppingCart },
          { label: "Platform Fees", value: "$31K", change: "1% take-rate", icon: TrendingUp },
        ].map((kpi, i) => (
          <Card key={i}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">{kpi.label}</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{kpi.value}</p>
                  <p className="text-xs text-emerald-500 mt-1 flex items-center gap-1"><ArrowUpRight className="w-3 h-3" />{kpi.change}</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <kpi.icon className="w-5 h-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle className="text-sm">GMV Trend</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={monthlyGMV}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border/30" />
                <XAxis dataKey="month" className="text-xs" />
                <YAxis className="text-xs" tickFormatter={(v) => `$${(v / 1000000).toFixed(1)}M`} />
                <Tooltip formatter={(v: number) => [`$${v.toLocaleString()}`, ""]} />
                <Area type="monotone" dataKey="gmv" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.12} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-sm">Category Mix</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={categoryMix} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" paddingAngle={3}>
                  {categoryMix.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-1.5 mt-2">
              {categoryMix.map((c, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: c.color }} />
                    <span className="text-muted-foreground">{c.name}</span>
                  </div>
                  <span className="font-medium text-foreground">{c.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-sm">Top Retailers</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {topRetailers.map((r, i) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-muted/30">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">{i + 1}</div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{r.name}</p>
                  <p className="text-xs text-muted-foreground">{r.orders} orders this month</p>
                </div>
                <p className="text-sm font-bold text-foreground">${(r.revenue / 1000).toFixed(0)}K</p>
                <Badge variant="secondary"><ArrowUpRight className="w-3 h-3 mr-1" />+{r.growth}%</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-4 flex items-start gap-3">
          <Zap className="w-5 h-5 text-primary mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-foreground">Distribution Insight</p>
            <p className="text-xs text-muted-foreground mt-1">Spirits category grew 18% this quarter, outpacing beer growth by 2.3x. Recommend expanding premium spirits inventory to capitalize on cocktail bar demand surge in downtown territories.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  </IndustryLayout>
);

export default LiquorDistributorDashboard;
