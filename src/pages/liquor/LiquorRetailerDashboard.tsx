import IndustryLayout from "@/components/industry/IndustryLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { ShoppingCart, CreditCard, Package, Clock, Zap, ArrowUpRight, Plus } from "lucide-react";

const orderHistory = [
  { month: "Jan", orders: 12, spend: 28000 }, { month: "Feb", orders: 14, spend: 32000 },
  { month: "Mar", orders: 16, spend: 38000 }, { month: "Apr", orders: 13, spend: 30000 },
  { month: "May", orders: 18, spend: 42000 }, { month: "Jun", orders: 20, spend: 48000 },
];

const recentOrders = [
  { id: "ORD-4521", items: "Hennessy VS (5), JW Black (3), Grey Goose (2)", total: 4200, status: "delivered", date: "Mar 6" },
  { id: "ORD-4498", items: "Patrón Silver (4), Moët (2)", total: 2800, status: "in_transit", date: "Mar 5" },
  { id: "ORD-4472", items: "Jameson (6), Absolut (4), Baileys (3)", total: 3100, status: "processing", date: "Mar 4" },
];

const activePromotions = [
  { brand: "Hennessy VS", offer: "Buy 5 cases, get 1 free", expires: "Mar 15", savings: "$180" },
  { brand: "Grey Goose", offer: "15% off 10+ cases", expires: "Mar 20", savings: "$420" },
];

const LiquorRetailerDashboard = () => (
  <IndustryLayout industryCode="liquor">
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Monthly Spend", value: "$48,000", change: "+14%", icon: ShoppingCart },
          { label: "Credit Available", value: "$12,800", change: "of $25K limit", icon: CreditCard },
          { label: "Pending Orders", value: "2", change: "Est. delivery: 2 days", icon: Package },
          { label: "Active Promos", value: "3", change: "Save up to $600", icon: Clock },
        ].map((kpi, i) => (
          <Card key={i}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">{kpi.label}</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{kpi.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{kpi.change}</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <kpi.icon className="w-5 h-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-end">
        <Button className="gap-2"><Plus className="w-4 h-4" /> Place New Order</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle className="text-sm">Monthly Spending</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={orderHistory}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border/30" />
                <XAxis dataKey="month" className="text-xs" />
                <YAxis className="text-xs" tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`} />
                <Tooltip formatter={(v: number) => [`$${v.toLocaleString()}`, ""]} />
                <Bar dataKey="spend" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-sm">Credit Status</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Credit Utilization</span>
                <span className="font-bold text-foreground">$12,200 / $25,000</span>
              </div>
              <Progress value={48.8} className="h-3" />
              <p className="text-xs text-muted-foreground mt-1">48.8% utilized · Credit Score: 88/100</p>
            </div>
            <div className="p-3 rounded-lg bg-muted/30">
              <p className="text-xs text-muted-foreground">Next Payment Due</p>
              <p className="text-sm font-semibold text-foreground">$4,200 · Mar 15, 2026</p>
            </div>
            <div className="p-3 rounded-lg bg-muted/30">
              <p className="text-xs text-muted-foreground">Payment Terms</p>
              <p className="text-sm font-semibold text-foreground">Net 30 · 8% APR on credit</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-sm">Recent Orders</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentOrders.map((o, i) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-muted/30">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-foreground">{o.id}</p>
                    <Badge variant={o.status === "delivered" ? "secondary" : o.status === "in_transit" ? "outline" : "default"} className="text-xs">{o.status.replace("_", " ")}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{o.items}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-foreground">${o.total.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">{o.date}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-sm">Active Promotions</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {activePromotions.map((p, i) => (
              <div key={i} className="p-4 rounded-lg border border-primary/20 bg-primary/5">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{p.brand}</p>
                    <p className="text-xs text-muted-foreground mt-1">{p.offer}</p>
                    <p className="text-xs text-muted-foreground">Expires: {p.expires}</p>
                  </div>
                  <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">Save {p.savings}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  </IndustryLayout>
);

export default LiquorRetailerDashboard;
