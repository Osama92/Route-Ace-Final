import IndustryLayout from "@/components/industry/IndustryLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Activity, DollarSign, Database, Globe, TrendingUp, Zap, ArrowUpRight, Building2 } from "lucide-react";

const platformRevenue = [
  { month: "Jan", txn: 82000, data: 180000, finance: 213000, demand: 24000 },
  { month: "Feb", txn: 91000, data: 195000, finance: 240000, demand: 27000 },
  { month: "Mar", txn: 104000, data: 210000, finance: 260000, demand: 31000 },
  { month: "Apr", txn: 112000, data: 225000, finance: 280000, demand: 29000 },
  { month: "May", txn: 125000, data: 238000, finance: 307000, demand: 34000 },
  { month: "Jun", txn: 138000, data: 248000, finance: 333000, demand: 38000 },
];

const engineBreakdown = [
  { engine: "Transaction Revenue", monthly: 138000, annual: 1656000, growth: 14.2 },
  { engine: "Data Intelligence", monthly: 248000, annual: 2976000, growth: 8.2 },
  { engine: "Embedded Finance", monthly: 333000, annual: 4000000, growth: 12.3 },
  { engine: "Supplier Demand", monthly: 38000, annual: 456000, growth: 22.0 },
];

const networkMetrics = [
  { metric: "Total Network GMV", value: "$12.5M/mo", trend: "+14.2%" },
  { metric: "Active Distributors", value: "186", trend: "+24" },
  { metric: "Active Retailers", value: "5,012", trend: "+340" },
  { metric: "Active Suppliers", value: "42", trend: "+8" },
  { metric: "Territories Covered", value: "28", trend: "+4" },
  { metric: "Products Listed", value: "8,420", trend: "+680" },
];

const LiquorPlatformIntelligence = () => (
  <IndustryLayout industryCode="liquor">
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Total Platform Revenue", value: "$757K/mo", change: "+11.8%", icon: DollarSign, sub: "$9.1M ARR" },
          { label: "Network GMV", value: "$12.5M", change: "+14.2%", icon: Activity, sub: "Monthly" },
          { label: "Data Subscribers", value: "65", change: "+12", icon: Database, sub: "$248K MRR" },
          { label: "Network Participants", value: "5,240", change: "+372", icon: Globe, sub: "All actors" },
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

      <Tabs defaultValue="revenue">
        <TabsList>
          <TabsTrigger value="revenue">Revenue by Engine</TabsTrigger>
          <TabsTrigger value="breakdown">Engine Breakdown</TabsTrigger>
          <TabsTrigger value="network">Network Health</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue">
          <Card>
            <CardHeader><CardTitle className="text-sm">Platform Revenue — All Engines</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={320}>
                <AreaChart data={platformRevenue}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border/30" />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis className="text-xs" tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`} />
                  <Tooltip formatter={(v: number) => [`$${v.toLocaleString()}`, ""]} />
                  <Area type="monotone" dataKey="finance" stackId="1" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.3} name="Finance" />
                  <Area type="monotone" dataKey="data" stackId="1" stroke="hsl(var(--accent))" fill="hsl(var(--accent))" fillOpacity={0.3} name="Data" />
                  <Area type="monotone" dataKey="txn" stackId="1" stroke="hsl(var(--secondary))" fill="hsl(var(--secondary))" fillOpacity={0.3} name="Transactions" />
                  <Area type="monotone" dataKey="demand" stackId="1" stroke="hsl(var(--muted-foreground))" fill="hsl(var(--muted-foreground))" fillOpacity={0.3} name="Demand" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="breakdown">
          <Card>
            <CardHeader><CardTitle className="text-sm">Revenue Engine Performance</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-4">
                {engineBreakdown.map((e, i) => (
                  <div key={i} className="p-4 rounded-lg bg-muted/30">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Building2 className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{e.engine}</p>
                          <p className="text-xs text-muted-foreground">${(e.annual / 1000000).toFixed(1)}M ARR</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-foreground">${(e.monthly / 1000).toFixed(0)}K<span className="text-xs text-muted-foreground font-normal">/mo</span></p>
                        <Badge variant="secondary" className="text-xs"><ArrowUpRight className="w-3 h-3 mr-1" />+{e.growth}%</Badge>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold text-foreground">Total Platform Revenue</p>
                    <div className="text-right">
                      <p className="text-xl font-bold text-primary">$757K<span className="text-xs text-muted-foreground font-normal">/mo</span></p>
                      <p className="text-xs text-muted-foreground">$9.1M ARR</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="network">
          <Card>
            <CardHeader><CardTitle className="text-sm">Network Health Metrics</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {networkMetrics.map((m, i) => (
                  <div key={i} className="p-4 rounded-lg bg-muted/30 text-center">
                    <p className="text-xs text-muted-foreground">{m.metric}</p>
                    <p className="text-xl font-bold text-foreground mt-1">{m.value}</p>
                    <p className="text-xs text-emerald-500 mt-1">{m.trend}</p>
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
            <p className="text-sm font-semibold text-foreground">Platform Intelligence</p>
            <p className="text-xs text-muted-foreground mt-1">Embedded Finance is the fastest-growing engine at $4M ARR with industry-low 1.8% default rate. Supplier Demand Engine shows strongest momentum (+22% MoM) — onboarding 3 additional global spirits brands would accelerate to $1M+ ARR by Q4.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  </IndustryLayout>
);

export default LiquorPlatformIntelligence;
