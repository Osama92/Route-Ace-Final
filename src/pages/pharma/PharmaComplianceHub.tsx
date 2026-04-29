import IndustryLayout from "@/components/industry/IndustryLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ShieldCheck, AlertTriangle, FileText, CheckCircle, XCircle, Clock, Activity, Scale } from "lucide-react";
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";

const complianceScores = [
  { area: "NAFDAC Registration", score: 96 },
  { area: "Batch Traceability", score: 92 },
  { area: "Cold Chain", score: 97 },
  { area: "Adverse Events", score: 88 },
  { area: "Controlled Substances", score: 94 },
  { area: "Recall Readiness", score: 85 },
  { area: "Documentation", score: 91 },
];

const pendingActions = [
  { action: "NAFDAC Renewal — Amoxicillin 250mg Suspension", deadline: "2026-03-20", priority: "high", status: "in_progress" },
  { action: "Adverse Event Report — Case #AE-2026-041", deadline: "2026-03-10", priority: "critical", status: "pending" },
  { action: "Recall Drill — Q1 Simulation", deadline: "2026-03-15", priority: "medium", status: "scheduled" },
  { action: "Controlled Substance Audit — Codeine Phosphate", deadline: "2026-03-25", priority: "high", status: "pending" },
  { action: "Pharmacovigilance Annual Report", deadline: "2026-04-01", priority: "medium", status: "in_progress" },
];

const regulatoryTimeline = [
  { event: "NAFDAC Inspection — Lagos Facility", date: "2026-02-15", result: "Passed", score: 94 },
  { event: "WHO PQ Audit — Sterile Facility", date: "2026-01-20", result: "Conditional", score: 87 },
  { event: "PCN Pharmacy Inspection", date: "2025-12-10", result: "Passed", score: 96 },
];

const PharmaComplianceHub = () => (
  <IndustryLayout industryCode="pharma">
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-bold text-foreground">Regulatory Compliance Hub</h1>
        <p className="text-muted-foreground mt-1">NAFDAC compliance, pharmacovigilance, and regulatory readiness dashboard</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Overall Compliance", value: "93.2%", icon: ShieldCheck, color: "text-emerald-500" },
          { label: "Pending Actions", value: "5", icon: Clock, color: "text-amber-500" },
          { label: "Active Registrations", value: "248", icon: FileText, color: "text-primary" },
          { label: "Adverse Events (YTD)", value: "12", icon: AlertTriangle, color: "text-amber-500" },
        ].map((kpi) => (
          <Card key={kpi.label}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{kpi.label}</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{kpi.value}</p>
                </div>
                <kpi.icon className={`w-8 h-8 ${kpi.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-lg">Compliance Radar</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={320}>
              <RadarChart data={complianceScores}>
                <PolarGrid stroke="hsl(var(--border))" />
                <PolarAngleAxis dataKey="area" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                <PolarRadiusAxis domain={[0, 100]} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} />
                <Radar name="Score" dataKey="score" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.2} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-lg">Pending Compliance Actions</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingActions.map((a, i) => (
                <div key={i} className="flex items-start justify-between p-3 rounded-lg border border-border">
                  <div className="flex-1">
                    <p className="font-medium text-foreground text-sm">{a.action}</p>
                    <p className="text-xs text-muted-foreground mt-1">Deadline: {a.deadline}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <Badge variant={a.priority === "critical" ? "destructive" : a.priority === "high" ? "destructive" : "secondary"} className="text-xs capitalize">{a.priority}</Badge>
                    <Badge variant="outline" className="text-xs capitalize">{a.status.replace("_", " ")}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-lg">Regulatory Inspection History</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {regulatoryTimeline.map((r, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                <div>
                  <p className="font-medium text-foreground">{r.event}</p>
                  <p className="text-sm text-muted-foreground">{r.date}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-foreground">{r.score}/100</span>
                  <Badge variant={r.result === "Passed" ? "default" : "secondary"} className="text-xs">{r.result}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  </IndustryLayout>
);

export default PharmaComplianceHub;
