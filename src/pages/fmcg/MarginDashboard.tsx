import FMCGLayout from "@/components/fmcg/FMCGLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, TrendingDown, Fuel, Clock, Package, CreditCard } from "lucide-react";

const losses = [
  { category: "Stockout Losses", amount: 2100000, icon: Package, trend: -18, period: "vs last month" },
  { category: "Delivery Delays", amount: 890000, icon: Clock, trend: -5, period: "vs last month" },
  { category: "Trade Spend Waste", amount: 1400000, icon: TrendingDown, trend: +12, period: "vs last month" },
  { category: "Credit Defaults", amount: 340000, icon: CreditCard, trend: -22, period: "vs last month" },
  { category: "Fuel Variance", amount: 560000, icon: Fuel, trend: +8, period: "vs last month" },
];

const corridors = [
  { name: "Lagos → South-East", growth: 24, margin: 18.2, risk: "low" },
  { name: "Lagos → North-Central", growth: 18, margin: 15.6, risk: "low" },
  { name: "Abuja → North-West", growth: 12, margin: 11.4, risk: "medium" },
  { name: "PH → South-South", growth: 8, margin: 9.8, risk: "medium" },
  { name: "Lagos → North-East", growth: -3, margin: 6.2, risk: "high" },
];

const MarginDashboard = () => {
  const totalLoss = losses.reduce((a, b) => a + b.amount, 0);

  return (
    <FMCGLayout title="Margin Protection Dashboard" subtitle="RTM KPI tracking & preventable loss detection">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="border-2 border-red-200">
          <CardContent className="pt-6 text-center">
            <p className="text-sm text-muted-foreground">Total Margin Leakage (MTD)</p>
            <p className="text-3xl font-bold text-red-600 mt-2">₦{(totalLoss / 1000000).toFixed(1)}M</p>
          </CardContent>
        </Card>
        <Card className="border-2 border-green-200">
          <CardContent className="pt-6 text-center">
            <p className="text-sm text-muted-foreground">Margin Improvement (MoM)</p>
            <p className="text-3xl font-bold text-green-600 mt-2">+4.2%</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-sm text-muted-foreground">Protection Score</p>
            <p className="text-3xl font-bold text-primary mt-2">82/100</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><ShieldCheck className="w-5 h-5" /> Top 5 Preventable Losses</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-4">
              {losses.map((l) => (
                <div key={l.category} className="flex items-center gap-4 py-2 border-b last:border-0">
                  <l.icon className="w-5 h-5 text-muted-foreground" />
                  <span className="flex-1 font-medium">{l.category}</span>
                  <span className="font-bold">₦{(l.amount / 1000000).toFixed(1)}M</span>
                  <Badge variant={l.trend < 0 ? "default" : "destructive"}>
                    {l.trend > 0 ? "+" : ""}{l.trend}%
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Top 5 Growth Corridors</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-4">
              {corridors.map((c) => (
                <div key={c.name} className="flex items-center gap-4 py-2 border-b last:border-0">
                  <span className="flex-1 font-medium">{c.name}</span>
                  <span className={`text-sm font-bold ${c.growth > 0 ? "text-green-600" : "text-red-600"}`}>{c.growth > 0 ? "+" : ""}{c.growth}%</span>
                  <span className="text-sm">{c.margin}% margin</span>
                  <Badge variant={c.risk === "low" ? "default" : c.risk === "medium" ? "secondary" : "destructive"}>{c.risk}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </FMCGLayout>
  );
};

export default MarginDashboard;
