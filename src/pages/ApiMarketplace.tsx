import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
  Zap, Package, TrendingUp, DollarSign, Shield, Code, Users,
  ArrowUpRight, BarChart3, Globe, Lock, Copy, Check, AlertTriangle,
  Layers, Key, Activity
} from "lucide-react";
import { motion } from "framer-motion";

/* ── API Product Catalog ── */
const API_PRODUCTS = [
  { id: "dispatch", name: "Dispatch API", desc: "Create and manage dispatches programmatically", pricePerCall: 25, wholesalePrice: 15, category: "core", plan: "growth", rateLimit: 1000 },
  { id: "tracking", name: "Tracking API", desc: "Real-time shipment tracking and status updates", pricePerCall: 10, wholesalePrice: 6, category: "core", plan: "starter", rateLimit: 5000 },
  { id: "route-opt", name: "Route Optimization API", desc: "AI-powered route planning and optimization", pricePerCall: 50, wholesalePrice: 30, category: "ai", plan: "growth", rateLimit: 500 },
  { id: "pricing", name: "Pricing API", desc: "Dynamic rate quotes and cost estimation", pricePerCall: 15, wholesalePrice: 8, category: "core", plan: "starter", rateLimit: 2000 },
  { id: "pod", name: "Proof of Delivery API", desc: "POD capture, verification, and retrieval", pricePerCall: 20, wholesalePrice: 12, category: "core", plan: "growth", rateLimit: 1000 },
  { id: "analytics", name: "Analytics API", desc: "Fleet and delivery performance analytics", pricePerCall: 35, wholesalePrice: 20, category: "intelligence", plan: "enterprise", rateLimit: 500 },
  { id: "ccc-kpi", name: "CCC KPI API", desc: "Cash conversion cycle and financial KPIs", pricePerCall: 40, wholesalePrice: 25, category: "intelligence", plan: "enterprise", rateLimit: 300 },
  { id: "order", name: "Order Creation API", desc: "Create delivery orders from external systems", pricePerCall: 20, wholesalePrice: 12, category: "core", plan: "starter", rateLimit: 2000 },
  { id: "invoice", name: "Billing & Invoice API", desc: "Generate and manage invoices programmatically", pricePerCall: 30, wholesalePrice: 18, category: "finance", plan: "growth", rateLimit: 500 },
];

/* Revenue split: 80% RouteAce / 20% Reseller — immutable across all tiers */
const RESELLER_TIERS = [
  { name: "Starter Reseller", minMonthly: 0, markup: 40, commission: 20, support: "Email", maxClients: 5 },
  { name: "Growth Reseller", minMonthly: 500000, markup: 50, commission: 20, support: "Priority", maxClients: 25 },
  { name: "Enterprise Reseller", minMonthly: 2000000, markup: 65, commission: 20, support: "Dedicated", maxClients: 999 },
];

const MOCK_USAGE = [
  { date: "Mar 1", calls: 1245, revenue: 31125 },
  { date: "Mar 5", calls: 1890, revenue: 47250 },
  { date: "Mar 10", calls: 2340, revenue: 58500 },
  { date: "Mar 15", calls: 2780, revenue: 69500 },
  { date: "Mar 20", calls: 3120, revenue: 78000 },
];

const MOCK_SUBCLIENTS = [
  { id: "SC-001", name: "FastMove Logistics", plan: "Growth", calls: 12450, revenue: 311250, status: "active" },
  { id: "SC-002", name: "QuickDrop NG", plan: "Starter", calls: 5200, revenue: 78000, status: "active" },
  { id: "SC-003", name: "NorthFleet", plan: "Growth", calls: 8900, revenue: 222500, status: "active" },
  { id: "SC-004", name: "BikeDash Lagos", plan: "Starter", calls: 3100, revenue: 46500, status: "trial" },
];

const fmt = (n: number) => `₦${n.toLocaleString()}`;

const ApiMarketplace = () => {
  const [estimatorCalls, setEstimatorCalls] = useState([500]);
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied(null), 2000);
  };

  const estimatedRevenue = estimatorCalls[0] * 25; // avg per call

  return (
    <DashboardLayout title="API Marketplace" subtitle="Monetize logistics infrastructure through metered APIs and reseller programs">
      <div className="space-y-6">

        {/* Revenue KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: "API Revenue (MTD)", value: fmt(2_340_000), icon: DollarSign, change: "+18%", color: "text-green-500" },
            { label: "Total API Calls", value: "156,780", icon: Activity, change: "+12%", color: "text-blue-500" },
            { label: "Active Resellers", value: "14", icon: Users, change: "+3", color: "text-purple-500" },
            { label: "Sub-Clients", value: "47", icon: Layers, change: "+8", color: "text-orange-500" },
          ].map((kpi, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <Card>
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">{kpi.label}</p>
                      <p className="text-xl font-bold mt-1">{kpi.value}</p>
                      <span className={`text-xs ${kpi.color}`}>{kpi.change}</span>
                    </div>
                    <kpi.icon className={`h-8 w-8 ${kpi.color} opacity-60`} />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <Tabs defaultValue="catalog">
          <TabsList>
            <TabsTrigger value="catalog">API Catalog</TabsTrigger>
            <TabsTrigger value="pricing">Pricing & Estimator</TabsTrigger>
            <TabsTrigger value="resellers">Reseller Program</TabsTrigger>
            <TabsTrigger value="subclients">Sub-Clients</TabsTrigger>
            <TabsTrigger value="usage">Usage Analytics</TabsTrigger>
          </TabsList>

          {/* ── API Catalog ── */}
          <TabsContent value="catalog" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {API_PRODUCTS.map((api) => (
                <Card key={api.id} className="hover:border-primary/30 transition-colors">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm">{api.name}</CardTitle>
                      <Badge variant={api.category === "ai" ? "default" : "secondary"} className="text-[10px]">
                        {api.category}
                      </Badge>
                    </div>
                    <CardDescription className="text-xs">{api.desc}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-muted-foreground">Retail</span>
                        <p className="font-semibold">{fmt(api.pricePerCall)}/call</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Wholesale</span>
                        <p className="font-semibold text-green-600">{fmt(api.wholesalePrice)}/call</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Rate: {api.rateLimit.toLocaleString()}/min</span>
                      <Badge variant="outline" className="text-[10px]">{api.plan}+</Badge>
                    </div>
                    <Button size="sm" className="w-full text-xs" variant="outline"
                      onClick={() => handleCopy(`https://api.routeace.com/v1/${api.id}`)}>
                      {copied === `https://api.routeace.com/v1/${api.id}` ? (
                        <><Check className="h-3 w-3 mr-1" /> Copied</>
                      ) : (
                        <><Copy className="h-3 w-3 mr-1" /> Copy Endpoint</>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* ── Pricing Estimator ── */}
          <TabsContent value="pricing" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Revenue Estimator</CardTitle>
                  <CardDescription className="text-xs">Estimate monthly API revenue</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <label className="text-xs text-muted-foreground mb-2 block">
                      Monthly API Calls: <strong>{estimatorCalls[0].toLocaleString()}</strong>
                    </label>
                    <Slider value={estimatorCalls} onValueChange={setEstimatorCalls}
                      min={100} max={50000} step={100} className="mt-2" />
                  </div>
                  <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
                    <p className="text-xs text-muted-foreground">Estimated Monthly Revenue</p>
                    <p className="text-2xl font-bold text-primary mt-1">{fmt(estimatedRevenue)}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Based on ₦25 avg per call × {estimatorCalls[0].toLocaleString()} calls
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">API Subscription Plans</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { plan: "Starter API", price: "₦50,000/mo", calls: "5,000 calls", features: ["Dispatch + Tracking", "Basic rate limits"] },
                    { plan: "Growth API", price: "₦200,000/mo", calls: "25,000 calls", features: ["All Core APIs", "Route Optimization", "Priority support"] },
                    { plan: "Enterprise API", price: "Custom", calls: "Unlimited", features: ["All APIs", "Dedicated infra", "SLA guarantee", "Custom models"] },
                  ].map((p, i) => (
                    <div key={i} className="p-3 rounded-lg border hover:border-primary/30 transition-colors">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold">{p.plan}</p>
                          <p className="text-xs text-muted-foreground">{p.calls} included</p>
                        </div>
                        <p className="text-sm font-bold text-primary">{p.price}</p>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {p.features.map((f, fi) => (
                          <Badge key={fi} variant="secondary" className="text-[10px]">{f}</Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* ── Reseller Program ── */}
          <TabsContent value="resellers" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {RESELLER_TIERS.map((tier, i) => (
                <Card key={i} className={i === 1 ? "border-primary/40 ring-1 ring-primary/20" : ""}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm">{tier.name}</CardTitle>
                      {i === 1 && <Badge className="text-[10px]">Popular</Badge>}
                    </div>
                    <CardDescription className="text-xs">
                      Min {fmt(tier.minMonthly)}/mo volume
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between"><span className="text-muted-foreground">Max Markup</span><span className="font-semibold">{tier.markup}%</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Commission</span><span className="font-semibold text-green-600">{tier.commission}%</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Max Clients</span><span className="font-semibold">{tier.maxClients === 999 ? "Unlimited" : tier.maxClients}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Support</span><span className="font-semibold">{tier.support}</span></div>
                    </div>
                    <div className="pt-2 border-t">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Shield className="h-3 w-3" />
                        <span>Tenant isolation enforced</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                        <Lock className="h-3 w-3" />
                        <span>No raw data access</span>
                      </div>
                    </div>
                    <Button size="sm" className="w-full text-xs" variant={i === 1 ? "default" : "outline"}>
                      Apply Now
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Data isolation reminder */}
            <Card className="border-amber-500/30 bg-amber-500/5">
              <CardContent className="pt-4 pb-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold">Strict Data Isolation</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Resellers can only view: tenant status, usage counts, plan tier, and billing status.
                      Operational data (vehicles, drivers, routes, invoices, PODs) is never exposed to reseller accounts.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── Sub-Clients ── */}
          <TabsContent value="subclients" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">Downstream Tenants</CardTitle>
                  <Button size="sm" className="text-xs"><Users className="h-3 w-3 mr-1" /> Provision Client</Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs">Client</TableHead>
                      <TableHead className="text-xs">Plan</TableHead>
                      <TableHead className="text-xs">API Calls</TableHead>
                      <TableHead className="text-xs">Revenue</TableHead>
                      <TableHead className="text-xs">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {MOCK_SUBCLIENTS.map((c) => (
                      <TableRow key={c.id}>
                        <TableCell className="text-xs font-medium">{c.name}</TableCell>
                        <TableCell><Badge variant="outline" className="text-[10px]">{c.plan}</Badge></TableCell>
                        <TableCell className="text-xs">{c.calls.toLocaleString()}</TableCell>
                        <TableCell className="text-xs font-semibold">{fmt(c.revenue)}</TableCell>
                        <TableCell>
                          <Badge variant={c.status === "active" ? "default" : "secondary"} className="text-[10px]">
                            {c.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── Usage Analytics ── */}
          <TabsContent value="usage" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">API Usage Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {MOCK_USAGE.map((d, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <span className="text-xs text-muted-foreground w-14">{d.date}</span>
                        <div className="flex-1">
                          <Progress value={(d.calls / 3500) * 100} className="h-2" />
                        </div>
                        <span className="text-xs font-mono w-16 text-right">{d.calls.toLocaleString()}</span>
                        <span className="text-xs font-semibold w-20 text-right text-green-600">{fmt(d.revenue)}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Revenue by API Product</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {API_PRODUCTS.slice(0, 5).map((api, i) => {
                      const rev = [890000, 560000, 420000, 310000, 160000][i];
                      const pct = (rev / 890000) * 100;
                      return (
                        <div key={api.id}>
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span>{api.name}</span>
                            <span className="font-semibold">{fmt(rev)}</span>
                          </div>
                          <Progress value={pct} className="h-1.5" />
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default ApiMarketplace;
