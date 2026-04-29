import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Shield, TrendingDown, AlertTriangle, RefreshCw, Activity, PieChart } from "lucide-react";

const mockExposure = [
  { asset: "USDT", exposure: 42, hedgeRatio: 0.85, volatility: 0.08, risk: 12, action: "Maintain", color: "bg-blue-500" },
  { asset: "USDC", exposure: 28, hedgeRatio: 0.92, volatility: 0.05, risk: 8, action: "Maintain", color: "bg-emerald-500" },
  { asset: "EURC", exposure: 15, hedgeRatio: 0.70, volatility: 0.15, risk: 25, action: "Increase hedge", color: "bg-amber-500" },
  { asset: "eNaira (CBDC)", exposure: 10, hedgeRatio: 1.0, volatility: 0.02, risk: 3, action: "No action", color: "bg-primary" },
  { asset: "BTC (Collateral)", exposure: 5, hedgeRatio: 0.45, volatility: 0.55, risk: 68, action: "Reduce exposure", color: "bg-destructive" },
];

const DigitalAssetHedge = () => {
  const totalRisk = Math.round(mockExposure.reduce((s, e) => s + e.risk * (e.exposure / 100), 0));
  const avgHedge = (mockExposure.reduce((s, e) => s + e.hedgeRatio * (e.exposure / 100), 0) * 100).toFixed(0);
  const alertCount = mockExposure.filter(e => e.risk > 20).length;

  return (
    <DashboardLayout title="Digital Asset Hedge Engine" subtitle="Volatility protection & treasury rebalancing">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card><CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10"><PieChart className="h-5 w-5 text-primary" /></div>
            <div><p className="text-sm text-muted-foreground">Portfolio Risk</p><p className="text-2xl font-bold">{totalRisk}/100</p></div>
          </div>
        </CardContent></Card>
        <Card><CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10"><Shield className="h-5 w-5 text-emerald-500" /></div>
            <div><p className="text-sm text-muted-foreground">Avg Hedge Ratio</p><p className="text-2xl font-bold">{avgHedge}%</p></div>
          </div>
        </CardContent></Card>
        <Card><CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/10"><AlertTriangle className="h-5 w-5 text-amber-500" /></div>
            <div><p className="text-sm text-muted-foreground">Risk Alerts</p><p className="text-2xl font-bold">{alertCount}</p></div>
          </div>
        </CardContent></Card>
        <Card><CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10"><Activity className="h-5 w-5 text-blue-500" /></div>
            <div><p className="text-sm text-muted-foreground">Assets Tracked</p><p className="text-2xl font-bold">{mockExposure.length}</p></div>
          </div>
        </CardContent></Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Exposure Heatmap</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {mockExposure.map(e => (
              <div key={e.asset} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm">{e.asset}</span>
                  <div className="flex items-center gap-2">
                    <Badge variant={e.risk > 30 ? "destructive" : e.risk > 15 ? "secondary" : "outline"}>
                      Risk: {e.risk}
                    </Badge>
                    <span className="text-sm text-muted-foreground">{e.exposure}%</span>
                  </div>
                </div>
                <Progress value={e.exposure} className="h-3" />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Treasury Risk Gauge</CardTitle>
            <Button variant="outline" size="sm"><RefreshCw className="w-4 h-4 mr-2" />Rebalance</Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockExposure.map(e => (
              <div key={e.asset} className="flex items-center justify-between p-3 rounded-lg border border-border/50">
                <div>
                  <p className="font-medium text-sm">{e.asset}</p>
                  <p className="text-xs text-muted-foreground">Hedge: {(e.hedgeRatio * 100).toFixed(0)}% | Vol: {(e.volatility * 100).toFixed(1)}%</p>
                </div>
                <div className="text-right">
                  <Badge className={
                    e.action === "Reduce exposure" ? "bg-destructive/15 text-destructive" :
                    e.action === "Increase hedge" ? "bg-amber-500/15 text-amber-500" :
                    "bg-emerald-500/15 text-emerald-500"
                  }>
                    {e.action === "Reduce exposure" && <TrendingDown className="w-3 h-3 mr-1" />}
                    {e.action}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default DigitalAssetHedge;
