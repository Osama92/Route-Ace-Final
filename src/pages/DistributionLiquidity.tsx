import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import {
  Zap, Package, Truck, Warehouse, TrendingUp, ArrowRight,
  DollarSign, Activity, Target, BarChart3, RefreshCw,
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from "recharts";

const liquidityData = Array.from({ length: 14 }, (_, i) => ({
  day: `Day ${i + 1}`,
  supply: Math.floor(Math.random() * 200) + 400,
  demand: Math.floor(Math.random() * 200) + 350,
  matched: Math.floor(Math.random() * 150) + 300,
}));

const idleAssets = [
  { type: "Idle Trucks", count: 127, potential: "₦18.4M/mo", icon: Truck, action: "Route Assignment" },
  { type: "Empty Warehouse", count: "4,200 sqm", potential: "₦6.2M/mo", icon: Warehouse, action: "List on Exchange" },
  { type: "Unsold Inventory", count: "340 tonnes", potential: "₦45M", icon: Package, action: "Match to Demand" },
];

const autoMatches = [
  { supply: "50t Cooking Oil (Lagos)", demand: "40t across 12 retailers (SW Nigeria)", logistics: "3 x 15T trucks auto-assigned", value: "₦32M", status: "In Progress" },
  { supply: "120t Cement (Dangote)", demand: "90t construction sites (Abuja)", logistics: "6 x 20T trucks queued", value: "₦54M", status: "Logistics Pending" },
  { supply: "30t Detergent (P&G)", demand: "25t FMCG retailers (Kano)", logistics: "2 x 15T trucks assigned", value: "₦18M", status: "Delivered" },
];

const DistributionLiquidity = () => {
  const [ticker, setTicker] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setTicker((t) => t + 1), 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <DashboardLayout title="Distribution Liquidity Engine" subtitle="Converting idle capacity into live trade transactions">
      <div className="space-y-6">
        {/* Liquidity Pulse */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Supply Liquidity", value: "2,847 listings", icon: Package, color: "text-emerald-500" },
            { label: "Demand Liquidity", value: "1,923 orders", icon: Target, color: "text-blue-500" },
            { label: "Matched Today", value: "63 trades", icon: Zap, color: "text-amber-500" },
            { label: "Idle → Active", value: "₦24.6M recovered", icon: RefreshCw, color: "text-purple-500" },
          ].map((s) => (
            <Card key={s.label} className="bg-card/80 border-border/50">
              <CardContent className="p-3 text-center">
                <s.icon className={`w-5 h-5 mx-auto mb-1 ${s.color}`} />
                <p className="text-lg font-bold">{s.value}</p>
                <p className="text-[10px] text-muted-foreground">{s.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Supply vs Demand Flow */}
        <Card>
          <CardHeader><CardTitle className="text-sm">Supply → Demand Liquidity Flow (14-Day)</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={liquidityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" fontSize={10} stroke="hsl(var(--muted-foreground))" />
                <YAxis fontSize={10} stroke="hsl(var(--muted-foreground))" />
                <Tooltip />
                <Area type="monotone" dataKey="supply" stroke="hsl(142 76% 36%)" fill="hsl(142 76% 36% / 0.15)" name="Supply" />
                <Area type="monotone" dataKey="demand" stroke="hsl(217 91% 60%)" fill="hsl(217 91% 60% / 0.15)" name="Demand" />
                <Area type="monotone" dataKey="matched" stroke="hsl(var(--primary))" fill="hsl(var(--primary) / 0.2)" name="Matched" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Tabs defaultValue="idle" className="space-y-4">
          <TabsList>
            <TabsTrigger value="idle">Idle Capacity Recovery</TabsTrigger>
            <TabsTrigger value="auto">Auto-Matched Trades</TabsTrigger>
            <TabsTrigger value="flywheel">Network Flywheel</TabsTrigger>
          </TabsList>

          <TabsContent value="idle" className="space-y-3">
            {idleAssets.map((asset) => (
              <Card key={asset.type} className="hover:border-primary/30 transition-all">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                      <asset.icon className="w-5 h-5 text-amber-500" />
                    </div>
                    <div>
                      <p className="font-semibold">{asset.type}</p>
                      <p className="text-sm text-muted-foreground">{asset.count} idle · Revenue potential: {asset.potential}</p>
                    </div>
                  </div>
                  <Button size="sm"><Zap className="w-3 h-3 mr-1" /> {asset.action}</Button>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="auto" className="space-y-3">
            {autoMatches.map((m, i) => (
              <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.1 }}>
                <Card className="border-primary/20">
                  <CardContent className="p-4 space-y-3">
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Supply</p>
                        <p className="font-medium">{m.supply}</p>
                      </div>
                      <div className="flex items-center justify-center">
                        <ArrowRight className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Demand</p>
                        <p className="font-medium">{m.demand}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-border/50">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Truck className="w-3 h-3" /> {m.logistics}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold">{m.value}</span>
                        <Badge className={m.status === "Delivered" ? "bg-emerald-500/15 text-emerald-600" : m.status === "In Progress" ? "bg-blue-500/15 text-blue-600" : "bg-amber-500/15 text-amber-600"}>
                          {m.status}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </TabsContent>

          <TabsContent value="flywheel">
            <Card>
              <CardContent className="py-10">
                <div className="max-w-md mx-auto space-y-4">
                  <h3 className="text-lg font-bold text-center">Network Effect Flywheel</h3>
                  <div className="space-y-3">
                    {[
                      { step: "More Suppliers", result: "→ More demand attracted", icon: Package },
                      { step: "More Demand", result: "→ More logistics activity", icon: Target },
                      { step: "More Logistics", result: "→ More distributors join", icon: Truck },
                      { step: "More Distributors", result: "→ More retailers served", icon: BarChart3 },
                      { step: "More Retailers", result: "→ More suppliers attracted", icon: TrendingUp },
                    ].map((f, i) => (
                      <motion.div key={f.step} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.15 }} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                        <f.icon className="w-5 h-5 text-primary flex-shrink-0" />
                        <div>
                          <span className="font-semibold text-sm">{f.step}</span>
                          <span className="text-sm text-muted-foreground ml-2">{f.result}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default DistributionLiquidity;
