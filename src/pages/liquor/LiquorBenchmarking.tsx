import IndustryLayout from "@/components/industry/IndustryLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Globe, TrendingUp, BarChart3, Target, Wine, DollarSign,
  Users, Package, ShieldCheck, ArrowUpRight, ArrowDownRight,
} from "lucide-react";

const benchmarks = [
  { metric: "Revenue per Account", yours: "₦24,200", industry: "₦18,500", pct: 131, trend: "up" },
  { metric: "Cases per Rep/Month", yours: "340", industry: "280", pct: 121, trend: "up" },
  { metric: "On-Time Delivery", yours: "94.1%", industry: "88.0%", pct: 107, trend: "up" },
  { metric: "Gross Margin", yours: "34.2%", industry: "31.5%", pct: 109, trend: "down" },
  { metric: "Days Sales Outstanding", yours: "14d", industry: "21d", pct: 67, trend: "up" },
  { metric: "Stock Turnover (x/year)", yours: "18.4", industry: "14.2", pct: 130, trend: "up" },
  { metric: "Breakage Rate", yours: "0.8%", industry: "1.4%", pct: 57, trend: "up" },
  { metric: "Excise Compliance", yours: "98.2%", industry: "92.0%", pct: 107, trend: "up" },
];

const categoryPerformance = [
  { category: "Whisky", yourShare: 29, marketShare: 32, gap: -3 },
  { category: "Cognac", yourShare: 25, marketShare: 18, gap: 7 },
  { category: "Vodka", yourShare: 10, marketShare: 15, gap: -5 },
  { category: "Beer & Stout", yourShare: 20, marketShare: 22, gap: -2 },
  { category: "Gin", yourShare: 9, marketShare: 8, gap: 1 },
  { category: "Wine & Champagne", yourShare: 7, marketShare: 5, gap: 2 },
];

const LiquorBenchmarking = () => (
  <IndustryLayout industryCode="liquor">
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, hsl(0 72% 51%), hsl(348 83% 47%))" }}>
          <Globe className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-heading font-bold">Industry Benchmarking</h1>
          <p className="text-sm text-muted-foreground">Your performance vs. Nigerian liquor distribution market averages</p>
        </div>
      </div>

      {/* Overall Score */}
      <Card className="border-rose-500/20">
        <CardContent className="py-6 text-center">
          <p className="text-6xl font-bold text-rose-400">112</p>
          <p className="text-lg text-muted-foreground mt-2">Composite Benchmark Index</p>
          <p className="text-sm text-emerald-400">12% above industry average</p>
        </CardContent>
      </Card>

      {/* Metric Comparison */}
      <Card>
        <CardHeader><CardTitle>Key Metric Benchmarks</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {benchmarks.map((b) => (
            <div key={b.metric} className="flex items-center justify-between py-2 border-b last:border-0 border-border/30">
              <div className="flex-1">
                <p className="font-medium text-sm">{b.metric}</p>
                <div className="flex items-center gap-4 mt-1">
                  <span className="text-sm font-bold">{b.yours}</span>
                  <span className="text-xs text-muted-foreground">vs {b.industry} (industry)</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge className={b.pct >= 100 ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" : "bg-amber-500/15 text-amber-400 border-amber-500/30"}>
                  {b.pct >= 100 ? `+${b.pct - 100}%` : `-${100 - b.pct}%`}
                </Badge>
                {b.trend === "up" ? <ArrowUpRight className="w-4 h-4 text-emerald-400" /> : <ArrowDownRight className="w-4 h-4 text-destructive" />}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Category Share */}
      <Card>
        <CardHeader><CardTitle>Category Share vs Market</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {categoryPerformance.map((c) => (
            <div key={c.category} className="flex items-center gap-4">
              <span className="w-32 text-sm font-medium">{c.category}</span>
              <div className="flex-1">
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Progress value={c.yourShare} className="h-2" />
                    <p className="text-xs mt-0.5">You: {c.yourShare}%</p>
                  </div>
                  <div className="flex-1">
                    <Progress value={c.marketShare} className="h-2 opacity-50" />
                    <p className="text-xs mt-0.5 text-muted-foreground">Market: {c.marketShare}%</p>
                  </div>
                </div>
              </div>
              <Badge className={`text-xs ${c.gap > 0 ? "bg-emerald-500/15 text-emerald-400" : "bg-amber-500/15 text-amber-400"}`}>
                {c.gap > 0 ? "+" : ""}{c.gap}pp
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  </IndustryLayout>
);

export default LiquorBenchmarking;
