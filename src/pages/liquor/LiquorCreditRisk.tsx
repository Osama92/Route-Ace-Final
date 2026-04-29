import IndustryLayout from "@/components/industry/IndustryLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ShieldAlert, AlertTriangle, CheckCircle, TrendingDown } from "lucide-react";

const creditRisks = [
  { retailer: "Nite Owl Ibadan", riskScore: 82, creditLimit: "₦2.5M", utilized: "₦2.1M", utilization: 84, latePayments: 4, avgDaysLate: 12, trend: "deteriorating" },
  { retailer: "Quick Stop Enugu", riskScore: 76, creditLimit: "₦1.8M", utilized: "₦1.6M", utilization: 89, latePayments: 3, avgDaysLate: 8, trend: "deteriorating" },
  { retailer: "Bar Central Lagos", riskScore: 18, creditLimit: "₦5M", utilized: "₦2.8M", utilization: 56, latePayments: 0, avgDaysLate: 0, trend: "stable" },
  { retailer: "The Grill House Lekki", riskScore: 45, creditLimit: "₦3.2M", utilized: "₦2.4M", utilization: 75, latePayments: 1, avgDaysLate: 3, trend: "stable" },
  { retailer: "Club Vibe Abuja", riskScore: 62, creditLimit: "₦4M", utilized: "₦3.6M", utilization: 90, latePayments: 2, avgDaysLate: 6, trend: "declining" },
];

const riskDistribution = [
  { level: "Low Risk (0-30)", count: 3240, pct: 65, color: "bg-emerald-500" },
  { level: "Medium (30-60)", count: 1120, pct: 22, color: "bg-yellow-500" },
  { level: "High (60-80)", count: 480, pct: 10, color: "bg-orange-500" },
  { level: "Critical (80+)", count: 172, pct: 3, color: "bg-red-500" },
];

const LiquorCreditRisk = () => (
  <IndustryLayout industryCode="liquor">
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <ShieldAlert className="w-6 h-6 text-destructive" /> Credit Risk Intelligence
        </h2>
        <p className="text-sm text-muted-foreground mt-1">AI-scored default probability across the retailer network</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {riskDistribution.map((r) => (
          <Card key={r.level}>
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">{r.level}</p>
              <p className="text-2xl font-bold text-foreground mt-1">{r.count.toLocaleString()}</p>
              <div className="flex items-center gap-2 mt-2">
                <div className={`w-full h-1.5 rounded-full bg-muted overflow-hidden`}>
                  <div className={`h-full ${r.color} rounded-full`} style={{ width: `${r.pct}%` }} />
                </div>
                <span className="text-xs text-muted-foreground">{r.pct}%</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader><CardTitle className="text-sm flex items-center gap-2"><AlertTriangle className="w-4 h-4" /> High-Risk Retailer Watch List</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-4">
            {creditRisks.map((r, i) => (
              <div key={i} className="p-4 rounded-lg border border-border">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-semibold text-foreground">{r.retailer}</p>
                    <Badge variant={r.trend === "deteriorating" ? "destructive" : r.trend === "declining" ? "secondary" : "outline"} className="text-[10px] mt-1">
                      {r.trend === "deteriorating" ? <TrendingDown className="w-3 h-3 mr-1" /> : null}{r.trend}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <p className={`text-2xl font-bold ${r.riskScore >= 70 ? "text-red-500" : r.riskScore >= 40 ? "text-yellow-500" : "text-emerald-500"}`}>{r.riskScore}</p>
                    <p className="text-[10px] text-muted-foreground">Risk Score</p>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-3 text-xs">
                  <div><span className="text-muted-foreground">Credit Limit</span><p className="font-semibold text-foreground">{r.creditLimit}</p></div>
                  <div><span className="text-muted-foreground">Utilized</span><p className="font-semibold text-foreground">{r.utilized} ({r.utilization}%)</p></div>
                  <div><span className="text-muted-foreground">Late Payments</span><p className="font-semibold text-foreground">{r.latePayments}</p></div>
                  <div><span className="text-muted-foreground">Avg Days Late</span><p className="font-semibold text-foreground">{r.avgDaysLate}</p></div>
                </div>
                <Progress value={r.riskScore} className="h-1.5 mt-3" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  </IndustryLayout>
);

export default LiquorCreditRisk;
