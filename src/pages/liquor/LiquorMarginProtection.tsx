import IndustryLayout from "@/components/industry/IndustryLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  ShieldCheck, AlertTriangle, TrendingDown, TrendingUp, DollarSign,
  Wine, Percent, Brain, BarChart3, Target, Zap,
} from "lucide-react";

const marginAlerts = [
  { brand: "Smirnoff Vodka 1L", channel: "Off-Premise", currentMargin: 18, targetMargin: 28, erosion: -10, cause: "Competitor pricing pressure from Brand X", severity: "critical" },
  { brand: "Gordon's Gin 750ml", channel: "Supermarkets", currentMargin: 22, targetMargin: 25, erosion: -3, cause: "Rising import duties (+2.5%)", severity: "warning" },
  { brand: "Guinness FES 600ml", channel: "On-Premise", currentMargin: 20, targetMargin: 22, erosion: -2, cause: "Volume discount tier exceeded", severity: "low" },
];

const categoryMargins = [
  { category: "Cognac & Brandy", margin: 38, target: 35, trend: "up", revenue: "₦10.8M" },
  { category: "Whisky & Scotch", margin: 35, target: 32, trend: "up", revenue: "₦12.4M" },
  { category: "Liqueur", margin: 42, target: 38, trend: "up", revenue: "₦4.1M" },
  { category: "Vodka", margin: 22, target: 28, trend: "down", revenue: "₦4.2M" },
  { category: "Gin", margin: 25, target: 25, trend: "flat", revenue: "₦3.8M" },
  { category: "Beer & Stout", margin: 20, target: 22, trend: "down", revenue: "₦8.6M" },
];

const severityConfig = {
  critical: { color: "border-destructive/30 bg-destructive/5", badge: "destructive" as const },
  warning: { color: "border-amber-500/30 bg-amber-500/5", badge: "secondary" as const },
  low: { color: "border-blue-500/30 bg-blue-500/5", badge: "outline" as const },
};

const LiquorMarginProtection = () => (
  <IndustryLayout industryCode="liquor">
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, hsl(0 72% 51%), hsl(348 83% 47%))" }}>
          <ShieldCheck className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-heading font-bold">Margin Protection</h1>
          <p className="text-sm text-muted-foreground">Margin erosion detection, pricing intelligence & profitability safeguards</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card><CardContent className="pt-5 text-center">
          <Percent className="w-5 h-5 mx-auto mb-1 text-emerald-400" />
          <p className="text-xl font-bold">34.2%</p>
          <p className="text-xs text-muted-foreground">Blended Gross Margin</p>
        </CardContent></Card>
        <Card className="border-destructive/20"><CardContent className="pt-5 text-center">
          <AlertTriangle className="w-5 h-5 mx-auto mb-1 text-destructive" />
          <p className="text-xl font-bold">3</p>
          <p className="text-xs text-muted-foreground">Margin Erosion Alerts</p>
        </CardContent></Card>
        <Card><CardContent className="pt-5 text-center">
          <DollarSign className="w-5 h-5 mx-auto mb-1 text-blue-400" />
          <p className="text-xl font-bold">₦1.4M</p>
          <p className="text-xs text-muted-foreground">Margin at Risk</p>
        </CardContent></Card>
        <Card><CardContent className="pt-5 text-center">
          <Target className="w-5 h-5 mx-auto mb-1 text-violet-400" />
          <p className="text-xl font-bold">92%</p>
          <p className="text-xs text-muted-foreground">Products Above Floor</p>
        </CardContent></Card>
      </div>

      {/* Margin Alerts */}
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-destructive" /> Active Margin Alerts</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {marginAlerts.map((alert) => {
            const sev = severityConfig[alert.severity as keyof typeof severityConfig];
            return (
              <div key={alert.brand} className={`p-4 rounded-xl border ${sev.color}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <Wine className="w-5 h-5 text-rose-400" />
                    <div>
                      <p className="font-semibold text-sm">{alert.brand}</p>
                      <p className="text-xs text-muted-foreground">{alert.channel} · {alert.cause}</p>
                    </div>
                  </div>
                  <Badge variant={sev.badge}>{alert.severity}</Badge>
                </div>
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Current</p>
                    <p className="font-bold text-destructive">{alert.currentMargin}%</p>
                  </div>
                  <TrendingDown className="w-4 h-4 text-destructive" />
                  <div>
                    <p className="text-xs text-muted-foreground">Target</p>
                    <p className="font-bold">{alert.targetMargin}%</p>
                  </div>
                  <Badge variant="destructive" className="ml-auto">{alert.erosion}pp</Badge>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Category Margins */}
      <Card>
        <CardHeader><CardTitle>Category Margin Health</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {categoryMargins.map((c) => (
            <div key={c.category} className="flex items-center justify-between py-3 border-b last:border-0 border-border/30">
              <div className="flex items-center gap-3">
                <BarChart3 className="w-4 h-4 text-rose-400" />
                <div>
                  <p className="font-medium text-sm">{c.category}</p>
                  <p className="text-xs text-muted-foreground">{c.revenue} revenue</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-32">
                  <Progress value={c.margin} className="h-2" />
                  <p className="text-xs mt-0.5">{c.margin}% (target: {c.target}%)</p>
                </div>
                {c.trend === "up" ? (
                  <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/30"><TrendingUp className="w-3 h-3 mr-1" />Above</Badge>
                ) : c.trend === "down" ? (
                  <Badge className="bg-destructive/15 text-destructive border-destructive/30"><TrendingDown className="w-3 h-3 mr-1" />Below</Badge>
                ) : (
                  <Badge variant="outline">On Track</Badge>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* AI Recommendation */}
      <Card className="border-rose-500/30 bg-rose-500/5">
        <CardContent className="py-4 flex items-center gap-4">
          <Brain className="w-6 h-6 text-rose-400 flex-shrink-0" />
          <div className="flex-1">
            <p className="font-semibold text-sm">AI Margin Recovery Plan</p>
            <p className="text-xs text-muted-foreground">Vodka category: Increase retail price by ₦200/bottle + shift 15% volume to on-premise (higher margin). Projected margin recovery: +6pp within 30 days.</p>
          </div>
          <Badge className="bg-rose-500/15 text-rose-400 border-rose-500/30">Action Required</Badge>
        </CardContent>
      </Card>
    </div>
  </IndustryLayout>
);

export default LiquorMarginProtection;
