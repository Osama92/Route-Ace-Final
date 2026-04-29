import IndustryLayout from "@/components/industry/IndustryLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { Globe, TrendingUp, Target, Users, Zap, ArrowUpRight } from "lucide-react";

const brandPerformance = [
  { month: "Jan", volume: 12400, revenue: 2480000 }, { month: "Feb", volume: 13800, revenue: 2760000 },
  { month: "Mar", volume: 15200, revenue: 3040000 }, { month: "Apr", volume: 14600, revenue: 2920000 },
  { month: "May", volume: 16800, revenue: 3360000 }, { month: "Jun", volume: 18200, revenue: 3640000 },
];

const distributorPerformance = [
  { name: "Metro Spirits Ltd", volume: 4200, target: 5000, growth: 18, territory: "Downtown" },
  { name: "Prime Beverages", volume: 3800, target: 4500, growth: 12, territory: "Midtown" },
  { name: "Atlas Drinks", volume: 3200, target: 3500, growth: 22, territory: "Uptown" },
  { name: "Crown Distributors", volume: 2800, target: 3000, growth: 8, territory: "Suburban" },
];

const campaignMetrics = [
  { name: "Summer Spirits Push", spend: 45000, lift: 23, roi: 3.2, status: "active" },
  { name: "Cocktail Bar Activation", spend: 20000, lift: 18, roi: 2.8, status: "active" },
  { name: "Holiday Gift Packs", spend: 60000, lift: 31, roi: 4.1, status: "completed" },
];

const LiquorSupplierDashboard = () => (
  <IndustryLayout industryCode="liquor">
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Monthly Volume", value: "18,200", change: "+8.3%", icon: Globe, sub: "Cases sold" },
          { label: "Network Revenue", value: "$3.64M", change: "+12.1%", icon: TrendingUp, sub: "Through distributors" },
          { label: "Active Distributors", value: "24", change: "+3", icon: Users, sub: "Across 8 territories" },
          { label: "Retail Reach", value: "3,840", change: "+420", icon: Target, sub: "Active outlets" },
        ].map((kpi, i) => (
          <Card key={i}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">{kpi.label}</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{kpi.value}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <ArrowUpRight className="w-3 h-3 text-emerald-500" />
                    <span className="text-xs text-emerald-500">{kpi.change}</span>
                    <span className="text-xs text-muted-foreground ml-1">{kpi.sub}</span>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <kpi.icon className="w-5 h-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="performance">
        <TabsList>
          <TabsTrigger value="performance">Brand Performance</TabsTrigger>
          <TabsTrigger value="distributors">Distributor Network</TabsTrigger>
          <TabsTrigger value="campaigns">Campaign ROI</TabsTrigger>
        </TabsList>

        <TabsContent value="performance">
          <Card>
            <CardHeader><CardTitle className="text-sm">Volume & Revenue Trend</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={brandPerformance}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border/30" />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis className="text-xs" tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
                  <Tooltip formatter={(v: number) => [v.toLocaleString(), ""]} />
                  <Line type="monotone" dataKey="volume" stroke="hsl(var(--primary))" strokeWidth={2.5} name="Cases" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="distributors">
          <Card>
            <CardHeader><CardTitle className="text-sm">Distributor Performance vs Target</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-4">
                {distributorPerformance.map((d, i) => (
                  <div key={i} className="p-4 rounded-lg bg-muted/30">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="text-sm font-medium text-foreground">{d.name}</p>
                        <p className="text-xs text-muted-foreground">{d.territory}</p>
                      </div>
                      <Badge variant="secondary"><ArrowUpRight className="w-3 h-3 mr-1" />+{d.growth}%</Badge>
                    </div>
                    <ResponsiveContainer width="100%" height={30}>
                      <BarChart data={[{ actual: d.volume, target: d.target }]} layout="vertical">
                        <XAxis type="number" hide domain={[0, d.target * 1.1]} />
                        <YAxis type="category" hide />
                        <Bar dataKey="target" fill="hsl(var(--muted))" radius={[4, 4, 4, 4]} />
                        <Bar dataKey="actual" fill="hsl(var(--primary))" radius={[4, 4, 4, 4]} />
                      </BarChart>
                    </ResponsiveContainer>
                    <p className="text-xs text-muted-foreground mt-1">{d.volume.toLocaleString()} / {d.target.toLocaleString()} cases ({Math.round((d.volume / d.target) * 100)}%)</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="campaigns">
          <Card>
            <CardHeader><CardTitle className="text-sm">Trade Marketing Campaigns</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                {campaignMetrics.map((c, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 rounded-lg bg-muted/30">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{c.name}</p>
                      <p className="text-xs text-muted-foreground">Spend: ${(c.spend / 1000).toFixed(0)}K · Lift: +{c.lift}%</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-primary">{c.roi}x ROI</p>
                    </div>
                    <Badge variant={c.status === "active" ? "secondary" : "outline"}>{c.status}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-4 flex items-start gap-3">
          <Zap className="w-5 h-5 text-primary mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-foreground">Supplier Intelligence</p>
            <p className="text-xs text-muted-foreground mt-1">Atlas Drinks outperforming target by 22% — consider increasing allocation. Downtown territory shows highest velocity; recommend launching a premium cocktail activation campaign targeting top 50 bars.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  </IndustryLayout>
);

export default LiquorSupplierDashboard;
