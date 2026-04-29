import IndustryLayout from "@/components/industry/IndustryLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { FileText, CheckCircle, AlertTriangle, XCircle, TrendingUp, Activity, Pill, Stethoscope } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";

const prescriptionVolume = [
  { month: "Jan", validated: 3200, rejected: 180, pending: 45 },
  { month: "Feb", validated: 3500, rejected: 150, pending: 38 },
  { month: "Mar", validated: 4100, rejected: 210, pending: 52 },
  { month: "Apr", validated: 4800, rejected: 190, pending: 41 },
  { month: "May", validated: 5200, rejected: 170, pending: 33 },
  { month: "Jun", validated: 4900, rejected: 160, pending: 28 },
];

const topDrugs = [
  { name: "Amoxicillin 500mg", prescriptions: 1240, trend: "+12%", status: "high" },
  { name: "Metformin 850mg", prescriptions: 980, trend: "+8%", status: "high" },
  { name: "Amlodipine 5mg", prescriptions: 870, trend: "+5%", status: "medium" },
  { name: "Omeprazole 20mg", prescriptions: 760, trend: "-2%", status: "medium" },
  { name: "Ciprofloxacin 500mg", prescriptions: 650, trend: "+15%", status: "high" },
];

const interactionAlerts = [
  { drug1: "Warfarin", drug2: "Aspirin", severity: "critical", count: 12 },
  { drug1: "Metformin", drug2: "Contrast Dye", severity: "high", count: 8 },
  { drug1: "Simvastatin", drug2: "Grapefruit", severity: "moderate", count: 23 },
  { drug1: "Lisinopril", drug2: "Potassium", severity: "moderate", count: 15 },
];

const conversionData = [
  { name: "Prescribed", value: 5200 },
  { name: "Validated", value: 4900 },
  { name: "Dispensed", value: 4650 },
  { name: "Collected", value: 4400 },
];

const COLORS = ["hsl(var(--primary))", "hsl(142 76% 36%)", "hsl(45 93% 47%)", "hsl(25 95% 53%)"];

const PharmaPrescriptionIntelligence = () => (
  <IndustryLayout industryCode="pharma">
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-bold text-foreground">Prescription Intelligence</h1>
        <p className="text-muted-foreground mt-1">Validate, track, and analyze prescription workflows across the network</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Today's Prescriptions", value: "284", icon: FileText, change: "+18%", color: "text-primary" },
          { label: "Validation Rate", value: "96.8%", icon: CheckCircle, change: "+1.2%", color: "text-emerald-500" },
          { label: "Drug Interactions Flagged", value: "7", icon: AlertTriangle, change: "-3", color: "text-amber-500" },
          { label: "Conversion Rate", value: "84.6%", icon: TrendingUp, change: "+2.1%", color: "text-primary" },
        ].map((kpi) => (
          <Card key={kpi.label}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{kpi.label}</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{kpi.value}</p>
                  <p className={`text-xs ${kpi.color} mt-1`}>{kpi.change} vs last period</p>
                </div>
                <kpi.icon className={`w-8 h-8 ${kpi.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-lg">Prescription Volume Trends</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={prescriptionVolume}>
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }} />
                <Bar dataKey="validated" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                <Bar dataKey="rejected" fill="hsl(0 84% 60%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-lg">Prescription Funnel</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-4">
              {conversionData.map((step, i) => (
                <div key={step.name} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-foreground font-medium">{step.name}</span>
                    <span className="text-muted-foreground">{step.value.toLocaleString()}</span>
                  </div>
                  <Progress value={(step.value / conversionData[0].value) * 100} className="h-3" />
                  {i > 0 && (
                    <p className="text-xs text-muted-foreground">
                      {((step.value / conversionData[i - 1].value) * 100).toFixed(1)}% conversion from previous step
                    </p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-lg flex items-center gap-2"><Pill className="w-5 h-5" /> Top Prescribed Drugs</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topDrugs.map((drug) => (
                <div key={drug.name} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div>
                    <p className="font-medium text-foreground text-sm">{drug.name}</p>
                    <p className="text-xs text-muted-foreground">{drug.prescriptions.toLocaleString()} prescriptions</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={drug.trend.startsWith("+") ? "default" : "secondary"} className="text-xs">{drug.trend}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-lg flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-amber-500" /> Drug Interaction Alerts</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {interactionAlerts.map((alert, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-border">
                  <div>
                    <p className="font-medium text-foreground text-sm">{alert.drug1} + {alert.drug2}</p>
                    <p className="text-xs text-muted-foreground">{alert.count} instances this month</p>
                  </div>
                  <Badge variant={alert.severity === "critical" ? "destructive" : alert.severity === "high" ? "destructive" : "secondary"} className="text-xs capitalize">
                    {alert.severity}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </IndustryLayout>
);

export default PharmaPrescriptionIntelligence;
