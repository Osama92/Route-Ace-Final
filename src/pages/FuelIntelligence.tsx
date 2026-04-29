import { useState, useMemo } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import DashboardExportButton from "@/components/shared/DashboardExportButton";
import {
  Fuel, AlertTriangle, TrendingDown, TrendingUp, Shield, Users, Truck,
  Eye, CheckCircle, XCircle, Clock, Gauge, Brain, Search, Filter,
} from "lucide-react";
import { toast } from "sonner";
import FuelInvestigateDialog from "@/components/fuel/FuelInvestigateDialog";

// ─── Mock data for initial render ───
const MOCK_SUMMARY = {
  total_fuel_spend: 4850000,
  total_litres: 6928,
  estimated_loss_litres: 847,
  estimated_loss_cost: 592900,
  efficiency_score: 72,
  active_fraud_flags: 8,
  high_risk_trips: 12,
  total_trips_analyzed: 156,
  fraud_breakdown: { over_fueling: 3, ghost_fueling: 2, receipt_mismatch: 2, route_deviation: 1 },
};

const MOCK_VEHICLES = [
  { id: "v1", name: "TRK-001", expected: 120, actual: 142, variance: 18.3, score: 68, status: "inefficient" },
  { id: "v2", name: "TRK-002", expected: 95, actual: 138, variance: 45.3, score: 32, status: "high_risk" },
  { id: "v3", name: "VAN-010", expected: 45, actual: 47, variance: 4.4, score: 92, status: "normal" },
  { id: "v4", name: "TRK-005", expected: 110, actual: 115, variance: 4.5, score: 88, status: "normal" },
  { id: "v5", name: "BKE-020", expected: 8, actual: 12, variance: 50.0, score: 25, status: "high_risk" },
  { id: "v6", name: "TRK-008", expected: 130, actual: 148, variance: 13.8, score: 71, status: "inefficient" },
];

const MOCK_DRIVERS = [
  { id: "d1", name: "Musa Ibrahim", score: 28, risk: "high_risk", variance: 42, trips: 34, flags: 3 },
  { id: "d2", name: "Chidi Okafor", score: 45, risk: "suspicious", variance: 22, trips: 28, flags: 1 },
  { id: "d3", name: "Bola Adeyemi", score: 12, risk: "normal", variance: 5, trips: 41, flags: 0 },
  { id: "d4", name: "Emeka Nwosu", score: 62, risk: "high_risk", variance: 35, trips: 22, flags: 2 },
  { id: "d5", name: "Ade Johnson", score: 18, risk: "normal", variance: 8, trips: 38, flags: 0 },
];

const MOCK_FRAUD = [
  { id: "f1", type: "over_fueling", driver: "Musa Ibrahim", vehicle: "TRK-002", severity: "critical", date: "2026-04-12", location: "Apapa" },
  { id: "f2", type: "ghost_fueling", driver: "Emeka Nwosu", vehicle: "TRK-008", severity: "high", date: "2026-04-11", location: "Ikeja" },
  { id: "f3", type: "receipt_mismatch", driver: "Chidi Okafor", vehicle: "TRK-001", severity: "medium", date: "2026-04-10", location: "Ojota" },
  { id: "f4", type: "route_deviation", driver: "Musa Ibrahim", vehicle: "TRK-002", severity: "high", date: "2026-04-09", location: "Oshodi" },
  { id: "f5", type: "over_fueling", driver: "Emeka Nwosu", vehicle: "BKE-020", severity: "critical", date: "2026-04-08", location: "Surulere" },
];

const MOCK_AI_INSIGHTS = [
  { severity: "critical", message: "Fuel consumption 28% above expected across 5 vehicles this week", module: "Fleet" },
  { severity: "high", message: "Driver Musa Ibrahim flagged for repeated over-fueling — 3 incidents in 7 days", module: "Driver" },
  { severity: "medium", message: "Route Apapa → Ikeja showing abnormal consumption patterns (+18%)", module: "Route" },
  { severity: "info", message: "Fleet-wide fuel efficiency improved 3% compared to last month", module: "Trend" },
];

function riskColor(level: string) {
  if (level === "high_risk" || level === "critical") return "text-red-500";
  if (level === "suspicious" || level === "inefficient" || level === "high" || level === "medium") return "text-yellow-500";
  return "text-green-500";
}

function riskBadge(level: string) {
  if (level === "high_risk" || level === "critical") return <Badge variant="destructive" className="text-xs">{level.replace("_", " ").toUpperCase()}</Badge>;
  if (level === "suspicious" || level === "inefficient" || level === "high" || level === "medium") return <Badge className="bg-yellow-500/20 text-yellow-700 text-xs">{level.replace("_", " ").toUpperCase()}</Badge>;
  return <Badge className="bg-green-500/20 text-green-700 text-xs">{level.toUpperCase()}</Badge>;
}

export default function FuelIntelligence() {
  const [activeTab, setActiveTab] = useState("command");
  const [investigateOpen, setInvestigateOpen] = useState(false);
  const [investigateTarget, setInvestigateTarget] = useState<{ driverId?: string; vehicleId?: string }>({});
  const summary = MOCK_SUMMARY;

  const getExportData = () => ({
    title: "Fuel Intelligence Report",
    subtitle: "RouteAce Fuel Command Center",
    filename: "fuel-intelligence-report",
    columns: [
      { key: "metric", label: "Metric" },
      { key: "value", label: "Value" },
    ],
    data: [
      { metric: "Total Fuel Spend", value: `₦${summary.total_fuel_spend.toLocaleString()}` },
      { metric: "Total Litres", value: summary.total_litres.toLocaleString() },
      { metric: "Estimated Loss", value: `₦${summary.estimated_loss_cost.toLocaleString()}` },
      { metric: "Efficiency Score", value: `${summary.efficiency_score}%` },
      { metric: "Active Fraud Flags", value: summary.active_fraud_flags },
      { metric: "High Risk Trips", value: summary.high_risk_trips },
    ],
  });

  return (
    <DashboardLayout title="Fuel Intelligence Command Center">
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Fuel className="h-7 w-7 text-orange-500" />
            Fuel Intelligence Command Center
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Real-time fuel loss detection, driver accountability & cost recovery</p>
        </div>
        <div className="flex items-center gap-2">
          <DashboardExportButton getExportData={getExportData} />
        </div>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-primary">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-medium">TOTAL FUEL SPEND</p>
                <p className="text-2xl font-bold">₦{(summary.total_fuel_spend / 1_000_000).toFixed(1)}M</p>
                <p className="text-xs text-muted-foreground">{summary.total_litres.toLocaleString()} litres</p>
              </div>
              <Fuel className="h-8 w-8 text-primary opacity-60" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-medium">FUEL LOSS ESTIMATE</p>
                <p className="text-2xl font-bold text-red-500">₦{(summary.estimated_loss_cost / 1000).toFixed(0)}K</p>
                <p className="text-xs text-red-400">{summary.estimated_loss_litres}L wasted</p>
              </div>
              <TrendingDown className="h-8 w-8 text-red-500 opacity-60" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-medium">ACTIVE ALERTS</p>
                <p className="text-2xl font-bold text-yellow-600">{summary.active_fraud_flags}</p>
                <p className="text-xs text-muted-foreground">{summary.high_risk_trips} high-risk trips</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-500 opacity-60" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-medium">EFFICIENCY SCORE</p>
                <p className="text-2xl font-bold">{summary.efficiency_score}/100</p>
                <Progress value={summary.efficiency_score} className="mt-2 h-2" />
              </div>
              <Gauge className="h-8 w-8 text-green-500 opacity-60" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Insights Panel */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-500" />
            AI Insight Feed
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {MOCK_AI_INSIGHTS.map((insight, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
              <div className={`mt-0.5 ${riskColor(insight.severity)}`}>
                {insight.severity === "critical" ? <XCircle className="h-4 w-4" /> :
                 insight.severity === "high" ? <AlertTriangle className="h-4 w-4" /> :
                 insight.severity === "medium" ? <Clock className="h-4 w-4" /> :
                 <TrendingUp className="h-4 w-4" />}
              </div>
              <div className="flex-1">
                <p className="text-sm">{insight.message}</p>
                <p className="text-xs text-muted-foreground mt-1">{insight.module} Module</p>
              </div>
              {riskBadge(insight.severity)}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Tabbed Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="flex flex-wrap">
          <TabsTrigger value="command">Vehicles</TabsTrigger>
          <TabsTrigger value="drivers">Drivers</TabsTrigger>
          <TabsTrigger value="fraud">Fraud Detection</TabsTrigger>
          <TabsTrigger value="cost">Cost Analytics</TabsTrigger>
        </TabsList>

        {/* Vehicle Efficiency */}
        <TabsContent value="command">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Truck className="h-5 w-5" /> Vehicle Efficiency Monitor
              </CardTitle>
              <CardDescription>Expected vs actual fuel per vehicle — click to drill down</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vehicle</TableHead>
                    <TableHead className="text-right">Expected (L)</TableHead>
                    <TableHead className="text-right">Actual (L)</TableHead>
                    <TableHead className="text-right">Variance %</TableHead>
                    <TableHead className="text-right">Score</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {MOCK_VEHICLES.map(v => (
                    <TableRow key={v.id} className="cursor-pointer hover:bg-muted/60">
                      <TableCell className="font-medium">{v.name}</TableCell>
                      <TableCell className="text-right">{v.expected}</TableCell>
                      <TableCell className="text-right">{v.actual}</TableCell>
                      <TableCell className={`text-right font-semibold ${v.variance > 20 ? "text-red-500" : v.variance > 10 ? "text-yellow-500" : "text-green-500"}`}>
                        +{v.variance.toFixed(1)}%
                      </TableCell>
                      <TableCell className="text-right">{v.score}</TableCell>
                      <TableCell>{riskBadge(v.status)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Driver Leaderboard */}
        <TabsContent value="drivers">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="h-5 w-5" /> Driver Fuel Behavior Leaderboard
              </CardTitle>
              <CardDescription>Risk score: higher = more risk. Based on variance, idling, fraud flags.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Rank</TableHead>
                    <TableHead>Driver</TableHead>
                    <TableHead className="text-right">Risk Score</TableHead>
                    <TableHead className="text-right">Avg Variance %</TableHead>
                    <TableHead className="text-right">Trips</TableHead>
                    <TableHead className="text-right">Flags</TableHead>
                    <TableHead>Risk Level</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[...MOCK_DRIVERS].sort((a, b) => b.score - a.score).map((d, i) => (
                    <TableRow key={d.id} className="cursor-pointer hover:bg-muted/60">
                      <TableCell className="font-medium">#{i + 1}</TableCell>
                      <TableCell>{d.name}</TableCell>
                      <TableCell className={`text-right font-bold ${riskColor(d.risk)}`}>{d.score}</TableCell>
                      <TableCell className="text-right">+{d.variance}%</TableCell>
                      <TableCell className="text-right">{d.trips}</TableCell>
                      <TableCell className="text-right">{d.flags > 0 ? <span className="text-red-500 font-semibold">{d.flags}</span> : "0"}</TableCell>
                      <TableCell>{riskBadge(d.risk)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Fraud Detection */}
        <TabsContent value="fraud">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Shield className="h-5 w-5 text-red-500" /> Fuel Fraud Detection
                  </CardTitle>
                  <CardDescription>Flagged cases requiring investigation</CardDescription>
                </div>
                <div className="flex gap-2 text-xs">
                  <Badge variant="destructive">{summary.fraud_breakdown.over_fueling} Over-fuel</Badge>
                  <Badge className="bg-yellow-500/20 text-yellow-700">{summary.fraud_breakdown.ghost_fueling} Ghost</Badge>
                  <Badge className="bg-blue-500/20 text-blue-700">{summary.fraud_breakdown.receipt_mismatch} Receipt</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Driver</TableHead>
                    <TableHead>Vehicle</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {MOCK_FRAUD.map(f => (
                    <TableRow key={f.id}>
                      <TableCell className="font-medium capitalize">{f.type.replace(/_/g, " ")}</TableCell>
                      <TableCell>{f.driver}</TableCell>
                      <TableCell>{f.vehicle}</TableCell>
                      <TableCell>{f.location}</TableCell>
                      <TableCell className="text-muted-foreground">{f.date}</TableCell>
                      <TableCell>{riskBadge(f.severity)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-1 justify-end">
                          <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => { setInvestigateTarget({ driverId: f.id, vehicleId: f.id }); setInvestigateOpen(true); }}>
                            <Eye className="h-3 w-3 mr-1" /> Investigate
                          </Button>
                          <Button size="sm" variant="ghost" className="h-7 text-xs text-green-600">
                            <CheckCircle className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Cost Analytics */}
        <TabsContent value="cost">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Cost Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { label: "Fuel Purchases", amount: summary.total_fuel_spend, pct: 100 },
                  { label: "Estimated Waste", amount: summary.estimated_loss_cost, pct: Math.round((summary.estimated_loss_cost / summary.total_fuel_spend) * 100) },
                  { label: "Recoverable Savings", amount: Math.round(summary.estimated_loss_cost * 0.7), pct: Math.round((summary.estimated_loss_cost * 0.7 / summary.total_fuel_spend) * 100) },
                ].map((item, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>{item.label}</span>
                      <span className="font-semibold">₦{(item.amount / 1000).toFixed(0)}K</span>
                    </div>
                    <Progress value={item.pct} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-green-500/30 bg-green-500/5">
              <CardHeader>
                <CardTitle className="text-base text-green-700">💰 Recoverable Cost Opportunity</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-green-600">
                  ₦{(Math.round(summary.estimated_loss_cost * 0.7) / 1000).toFixed(0)}K
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Estimated monthly savings through fuel optimization, fraud prevention, and driver retraining.
                </p>
                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Driver retraining impact</span>
                    <span className="font-medium text-green-600">₦{(summary.estimated_loss_cost * 0.3 / 1000).toFixed(0)}K</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Fraud elimination</span>
                    <span className="font-medium text-green-600">₦{(summary.estimated_loss_cost * 0.25 / 1000).toFixed(0)}K</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Route optimization</span>
                    <span className="font-medium text-green-600">₦{(summary.estimated_loss_cost * 0.15 / 1000).toFixed(0)}K</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
    <FuelInvestigateDialog
      open={investigateOpen}
      onOpenChange={setInvestigateOpen}
      driverId={investigateTarget.driverId}
      vehicleId={investigateTarget.vehicleId}
    />
    </DashboardLayout>
  );
}
