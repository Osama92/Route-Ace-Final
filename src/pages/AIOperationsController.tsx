import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Cpu, TrendingUp, TrendingDown, AlertTriangle, Zap, BarChart3,
  Truck, DollarSign, Target, RefreshCw, Play, Pause, Settings,
  Activity, Brain, Eye, Shield, Clock, Users, MapPin, Route
} from "lucide-react";

const predictions = [
  { metric: "Demand Spike Risk", value: 78, trend: "up", recommendation: "Pre-position 8 trucks in Lagos Island zone by 06:00", priority: "high" },
  { metric: "SLA Breach Probability", value: 34, trend: "up", recommendation: "Reassign 3 delayed routes to alternate drivers immediately", priority: "high" },
  { metric: "Revenue Shortfall Risk", value: 22, trend: "down", recommendation: "Activate dynamic pricing surge for peak hours", priority: "medium" },
  { metric: "Fuel Cost Overrun", value: 61, trend: "up", recommendation: "Switch Route R-041 to optimized highway path (saves ₦18,400)", priority: "medium" },
  { metric: "Driver Fatigue Risk", value: 45, trend: "up", recommendation: "Rotate Drivers #7, #14, #22 — exceeded 10h shift", priority: "high" },
  { metric: "Maintenance Alert", value: 88, trend: "up", recommendation: "Vehicle TRK-009 due for service — 4,980/5,000 km threshold", priority: "critical" },
];

const aiDecisions = [
  { id: "AI-001", action: "Fleet Reallocation", desc: "Moved 4 trucks from Apapa to VI due to demand surge", outcome: "+₦320,000 revenue recovered", status: "executed", time: "8m ago", mode: "auto" },
  { id: "AI-002", action: "Dynamic Price Surge", desc: "Applied 1.3x multiplier on Lagos-Ibadan corridor", outcome: "+18% revenue per trip", status: "executed", time: "45m ago", mode: "auto" },
  { id: "AI-003", action: "Route Optimization", desc: "Rerouted 6 deliveries via Eko Bridge to avoid traffic", outcome: "Saved 2.4 hours total ETA", status: "pending_approval", time: "2m ago", mode: "advisory" },
  { id: "AI-004", action: "Driver Reallocation", desc: "Recommend swapping Emeka & Chibuike on Routes R-12/R-15", outcome: "Estimated +12% on-time rate", status: "pending_approval", time: "5m ago", mode: "advisory" },
  { id: "AI-005", action: "Maintenance Block", desc: "TRK-009 flagged for immediate service before next dispatch", outcome: "Prevented breakdown risk (est. ₦890K repair avoided)", status: "executed", time: "1h ago", mode: "auto" },
];

const whatIfScenarios = [
  { scenario: "Add 10 more trucks", impact: { revenue: "+₦4.2M/mo", sla: "+8%", cost: "+₦1.8M/mo", netChange: "+₦2.4M/mo" } },
  { scenario: "Increase driver pay 15%", impact: { revenue: "+₦1.1M/mo", sla: "+12%", cost: "+₦2.1M/mo", netChange: "-₦1.0M/mo" } },
  { scenario: "Launch Abuja corridor", impact: { revenue: "+₦6.8M/mo", sla: "-3%", cost: "+₦3.2M/mo", netChange: "+₦3.6M/mo" } },
  { scenario: "Remove bottom 5 routes", impact: { revenue: "-₦2.4M/mo", sla: "+15%", cost: "-₦3.1M/mo", netChange: "+₦0.7M/mo" } },
];

export default function AIOperationsController() {
  const [activeTab, setActiveTab] = useState("predictions");
  const [automationMode, setAutomationMode] = useState(false);
  const [aiSensitivity, setAiSensitivity] = useState([70]);
  const [selectedScenario, setSelectedScenario] = useState("");

  return (
    <DashboardLayout title="AI Autonomous Operations Controller" subtitle="Predictive intelligence — advisory first, automation on demand">
      {/* Mode Banner */}
      <div className={`flex items-center justify-between p-4 rounded-xl border mb-6 ${automationMode ? "bg-primary/10 border-primary" : "bg-muted border-border"}`}>
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${automationMode ? "bg-primary animate-pulse" : "bg-muted-foreground"}`} />
          <div>
            <p className="font-bold">{automationMode ? "🤖 Automation Mode ACTIVE" : "🧠 Advisory Mode"}</p>
            <p className="text-xs text-muted-foreground">
              {automationMode ? "AI is executing decisions automatically. Review logs for all actions." : "AI is recommending actions. You approve each decision."}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium">{automationMode ? "Disable Auto" : "Enable Auto"}</span>
          <Switch checked={automationMode} onCheckedChange={setAutomationMode} />
        </div>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { label: "AI Interventions Today", value: "23", icon: Brain, color: "text-primary" },
          { label: "Revenue Recovered", value: "₦2.1M", icon: TrendingUp, color: "text-green-500" },
          { label: "Cost Savings", value: "₦480K", icon: DollarSign, color: "text-blue-500" },
          { label: "Pending Approvals", value: "2", icon: Clock, color: "text-yellow-500" },
        ].map((k) => (
          <Card key={k.label}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-muted">
                <k.icon className={`w-5 h-5 ${k.color}`} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{k.label}</p>
                <p className="text-lg font-bold">{k.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="flex-wrap h-auto gap-1 mb-4">
          <TabsTrigger value="predictions">Predictions</TabsTrigger>
          <TabsTrigger value="decisions">AI Decisions</TabsTrigger>
          <TabsTrigger value="whatif">What-If Simulator</TabsTrigger>
          <TabsTrigger value="config">AI Configuration</TabsTrigger>
        </TabsList>

        {/* ─── PREDICTIONS ─── */}
        <TabsContent value="predictions">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {predictions.map((p) => (
              <Card key={p.metric} className={`border-l-4 ${
                p.priority === "critical" ? "border-l-destructive" :
                p.priority === "high" ? "border-l-orange-500" :
                "border-l-yellow-500"
              }`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <p className="font-semibold text-sm">{p.metric}</p>
                    <div className="flex items-center gap-2">
                      {p.trend === "up" ? <TrendingUp className="w-4 h-4 text-destructive" /> : <TrendingDown className="w-4 h-4 text-green-500" />}
                      <Badge className={
                        p.priority === "critical" ? "bg-destructive/20 text-destructive" :
                        p.priority === "high" ? "bg-orange-500/20 text-orange-700" :
                        "bg-yellow-500/20 text-yellow-700"
                      }>{p.priority}</Badge>
                    </div>
                  </div>
                  <div className="space-y-2 mb-3">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Risk Score</span>
                      <span className="font-bold">{p.value}%</span>
                    </div>
                    <Progress value={p.value} className="h-2" />
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-xs font-medium flex items-center gap-1 mb-1"><Brain className="w-3 h-3" />AI Recommendation</p>
                    <p className="text-xs text-muted-foreground">{p.recommendation}</p>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Button size="sm" className="flex-1 h-8 text-xs">Execute Now</Button>
                    <Button variant="outline" size="sm" className="h-8 text-xs">Dismiss</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* ─── AI DECISIONS ─── */}
        <TabsContent value="decisions">
          <div className="space-y-3">
            {aiDecisions.map((d) => (
              <Card key={d.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-xs text-muted-foreground">{d.id}</span>
                        <Badge variant="outline" className="text-xs">{d.mode === "auto" ? "🤖 Auto" : "💡 Advisory"}</Badge>
                        <Badge className={
                          d.status === "executed" ? "bg-green-500/20 text-green-700 text-xs" :
                          "bg-yellow-500/20 text-yellow-700 text-xs"
                        }>{d.status.replace("_", " ")}</Badge>
                      </div>
                      <p className="font-semibold text-sm">{d.action}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{d.desc}</p>
                      <p className="text-xs text-primary font-medium mt-1">Outcome: {d.outcome}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs text-muted-foreground">{d.time}</p>
                      {d.status === "pending_approval" && (
                        <div className="flex gap-1 mt-2">
                          <Button size="sm" className="h-7 text-xs">Approve</Button>
                          <Button variant="outline" size="sm" className="h-7 text-xs">Reject</Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* ─── WHAT-IF ─── */}
        <TabsContent value="whatif">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {whatIfScenarios.map((s) => (
              <Card key={s.scenario} className={`cursor-pointer transition-colors ${selectedScenario === s.scenario ? "border-primary bg-primary/5" : ""}`}
                onClick={() => setSelectedScenario(s.scenario)}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">📊 {s.scenario}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {[
                    { label: "Revenue Impact", value: s.impact.revenue, positive: s.impact.revenue.startsWith("+") },
                    { label: "SLA Impact", value: s.impact.sla, positive: s.impact.sla.startsWith("+") },
                    { label: "Cost Impact", value: s.impact.cost, positive: s.impact.cost.startsWith("-") },
                    { label: "Net Business Change", value: s.impact.netChange, positive: s.impact.netChange.startsWith("+"), bold: true },
                  ].map((row) => (
                    <div key={row.label} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{row.label}</span>
                      <span className={`font-${row.bold ? "bold" : "medium"} ${row.positive ? "text-green-500" : "text-destructive"}`}>{row.value}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>

          {selectedScenario && (
            <Card className="mt-4 border-primary">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2"><Zap className="w-4 h-4 text-primary" />Selected Scenario: {selectedScenario}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">AI confidence in this simulation: <strong>87%</strong> based on 18 months of historical data.</p>
                <div className="flex gap-2">
                  <Button>Run Full Simulation</Button>
                  <Button variant="outline">Schedule Implementation</Button>
                  <Button variant="outline">Export Report</Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* ─── CONFIG ─── */}
        <TabsContent value="config">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader><CardTitle className="text-base flex items-center gap-2"><Settings className="w-4 h-4" />AI Sensitivity Controls</CardTitle></CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex justify-between mb-3">
                    <label className="text-sm font-medium">Detection Sensitivity</label>
                    <span className="text-sm font-bold">{aiSensitivity[0]}%</span>
                  </div>
                  <Slider value={aiSensitivity} onValueChange={setAiSensitivity} min={10} max={100} step={5} className="w-full" />
                  <p className="text-xs text-muted-foreground mt-1">Higher = more alerts, lower = only critical actions triggered</p>
                </div>

                {[
                  { label: "Demand Forecasting", desc: "Predict surges 2-12h ahead", enabled: true },
                  { label: "Autonomous Fleet Allocation", desc: "Auto-move vehicles based on demand", enabled: automationMode },
                  { label: "Dynamic Pricing Engine", desc: "Auto-adjust prices during peak periods", enabled: automationMode },
                  { label: "SLA Risk Intervention", desc: "Auto-reassign routes at 70%+ risk", enabled: true },
                  { label: "Cost Leakage Detection", desc: "Flag anomalous expenses automatically", enabled: true },
                  { label: "Maintenance Scheduler", desc: "Auto-block vehicles at service threshold", enabled: true },
                ].map((ctrl) => (
                  <div key={ctrl.label} className="flex items-center justify-between p-3 rounded-lg border">
                    <div>
                      <p className="font-medium text-sm">{ctrl.label}</p>
                      <p className="text-xs text-muted-foreground">{ctrl.desc}</p>
                    </div>
                    <Switch checked={ctrl.enabled} disabled={!automationMode && ctrl.label === "Autonomous Fleet Allocation"} />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="text-base flex items-center gap-2"><Activity className="w-4 h-4" />AI Model Performance</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {[
                  { model: "Demand Forecasting", accuracy: 89, predictions: 1_842 },
                  { model: "SLA Risk Scorer", accuracy: 94, predictions: 3_210 },
                  { model: "Route Optimizer", accuracy: 91, predictions: 988 },
                  { model: "Fraud Detector", accuracy: 97, predictions: 15_400 },
                  { model: "Maintenance Predictor", accuracy: 85, predictions: 442 },
                ].map((m) => (
                  <div key={m.model}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium">{m.model}</span>
                      <span className="font-bold">{m.accuracy}% accuracy</span>
                    </div>
                    <Progress value={m.accuracy} className="h-2 mb-1" />
                    <p className="text-xs text-muted-foreground">{m.predictions.toLocaleString()} predictions made</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}
