import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowRightLeft, TrendingUp, AlertTriangle, Globe, RefreshCw, Zap } from "lucide-react";
import { useState } from "react";

const mockCorridors = [
  { id: "1", origin: "Nigeria", destination: "UK", symbol: "USDT", onramp: 1580.50, offramp: 1.00, fxRate: 1585.00, liquidity: 2500000, volatility: 0.12, spread: 0.28, arbitrage: true },
  { id: "2", origin: "Nigeria", destination: "US", symbol: "USDC", onramp: 1575.00, offramp: 1.00, fxRate: 1580.00, liquidity: 5000000, volatility: 0.08, spread: 0.32, arbitrage: true },
  { id: "3", origin: "Ghana", destination: "UK", symbol: "USDT", onramp: 14.20, offramp: 1.00, fxRate: 14.25, liquidity: 800000, volatility: 0.15, spread: 0.35, arbitrage: false },
  { id: "4", origin: "Kenya", destination: "US", symbol: "EURC", onramp: 152.00, offramp: 1.08, fxRate: 153.50, liquidity: 1200000, volatility: 0.22, spread: 0.98, arbitrage: true },
  { id: "5", origin: "South Africa", destination: "EU", symbol: "USDC", onramp: 18.45, offramp: 1.00, fxRate: 18.50, liquidity: 3000000, volatility: 0.10, spread: 0.27, arbitrage: false },
];

const CorridorArbitrage = () => {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  };

  const activeArbitrageCount = mockCorridors.filter(c => c.arbitrage).length;
  const totalLiquidity = mockCorridors.reduce((s, c) => s + c.liquidity, 0);
  const avgSpread = mockCorridors.reduce((s, c) => s + c.spread, 0) / mockCorridors.length;

  return (
    <DashboardLayout title="Stablecoin Corridor Arbitrage" subtitle="Cross-border settlement optimization via pricing inefficiencies">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card><CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10"><ArrowRightLeft className="h-5 w-5 text-primary" /></div>
            <div><p className="text-sm text-muted-foreground">Active Corridors</p><p className="text-2xl font-bold">{mockCorridors.length}</p></div>
          </div>
        </CardContent></Card>
        <Card><CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10"><Zap className="h-5 w-5 text-emerald-500" /></div>
            <div><p className="text-sm text-muted-foreground">Arbitrage Opportunities</p><p className="text-2xl font-bold">{activeArbitrageCount}</p></div>
          </div>
        </CardContent></Card>
        <Card><CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10"><Globe className="h-5 w-5 text-blue-500" /></div>
            <div><p className="text-sm text-muted-foreground">Total Liquidity</p><p className="text-2xl font-bold">${(totalLiquidity / 1e6).toFixed(1)}M</p></div>
          </div>
        </CardContent></Card>
        <Card><CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/10"><TrendingUp className="h-5 w-5 text-amber-500" /></div>
            <div><p className="text-sm text-muted-foreground">Avg Spread</p><p className="text-2xl font-bold">{avgSpread.toFixed(2)}%</p></div>
          </div>
        </CardContent></Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Corridor Monitor</CardTitle>
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={refreshing}>
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
            Refresh Rates
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Corridor</TableHead>
                <TableHead>Token</TableHead>
                <TableHead>On-Ramp Rate</TableHead>
                <TableHead>Off-Ramp Rate</TableHead>
                <TableHead>FX Rate</TableHead>
                <TableHead>Spread</TableHead>
                <TableHead>Liquidity</TableHead>
                <TableHead>Volatility</TableHead>
                <TableHead>Signal</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockCorridors.map(c => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">{c.origin} → {c.destination}</TableCell>
                  <TableCell><Badge variant="outline">{c.symbol}</Badge></TableCell>
                  <TableCell>{c.onramp.toLocaleString()}</TableCell>
                  <TableCell>{c.offramp.toFixed(2)}</TableCell>
                  <TableCell>{c.fxRate.toLocaleString()}</TableCell>
                  <TableCell className={c.spread > 0.5 ? "text-amber-500 font-semibold" : ""}>{c.spread.toFixed(2)}%</TableCell>
                  <TableCell>${(c.liquidity / 1e6).toFixed(1)}M</TableCell>
                  <TableCell>
                    <Badge variant={c.volatility > 0.15 ? "destructive" : "secondary"}>
                      {(c.volatility * 100).toFixed(1)}%
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {c.arbitrage ? (
                      <Badge className="bg-emerald-500/15 text-emerald-500"><Zap className="w-3 h-3 mr-1" />Opportunity</Badge>
                    ) : (
                      <Badge variant="secondary">Normal</Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default CorridorArbitrage;
